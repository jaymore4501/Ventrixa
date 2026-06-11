import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/schemas";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // ── Validate inputs ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }

    // ── Connect to DB ─────────────────────────────────────────────────
    await connectDB();

    // ── Check email uniqueness ────────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // ── Hash password ─────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Create user ───────────────────────────────────────────────────
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[SIGNUP ERROR]", err);
    // Mongo duplicate key error
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
