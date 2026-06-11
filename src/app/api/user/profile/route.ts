import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User, Project } from "@/models/schemas";

// ── GET /api/user/profile ─────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[GET PROFILE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── PATCH /api/user/profile ───────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, location, websiteUrl, image, currentPassword, newPassword } = body;

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (name && name.trim().length >= 2) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;
    if (image !== undefined) updates.image = image;

    // Password change (credentials users only)
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required." }, { status: 400 });
      }
      if (!user.password) {
        return NextResponse.json({ error: "Password change not available for OAuth accounts." }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await User.findByIdAndUpdate(user._id, updates, { new: true }).select("-password");
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("[PATCH PROFILE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── DELETE /api/user/profile ──────────────────────────────────────────────────
export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all user projects
    await Project.deleteMany({ userId: user._id.toString() });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    return NextResponse.json({ success: true, message: "Account deleted." });
  } catch (err) {
    console.error("[DELETE PROFILE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
