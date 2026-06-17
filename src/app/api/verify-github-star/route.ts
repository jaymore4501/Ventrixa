import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/schemas";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
    }

    let { githubUsername } = await req.json();
    if (!githubUsername) {
      return NextResponse.json({ error: "GitHub username is required." }, { status: 400 });
    }
    githubUsername = githubUsername.trim().toLowerCase();

    const userId = session.user.id;
    const isMongo = await connectToDatabase();

    // Prevent duplicate usage of the same GitHub username
    if (isMongo) {
      const existingVerifier = await User.findOne({ 
        githubUsername: { $regex: new RegExp(`^${githubUsername}$`, "i") } 
      });
      if (existingVerifier && existingVerifier._id.toString() !== userId) {
        return NextResponse.json({ 
          error: "This GitHub username has already been verified by another account." 
        }, { status: 400 });
      }
    } else {
      const mockDbPath = path.join(process.cwd(), "src", "data", "mockDb.json");
      if (fs.existsSync(mockDbPath)) {
        const db = JSON.parse(fs.readFileSync(mockDbPath, "utf8"));
        if (db.users) {
          const existingVerifier = db.users.find((u: any) => u.githubUsername?.toLowerCase() === githubUsername);
          if (existingVerifier && existingVerifier.id !== userId && existingVerifier._id !== userId) {
            return NextResponse.json({ 
              error: "This GitHub username has already been verified by another account." 
            }, { status: 400 });
          }
        }
      }
    }

    // Call GitHub API to list the user's recently starred repos
    const REPO_OWNER = "jaymore4501";
    const REPO_NAME = "Ventrixa";
    const FULL_REPO_NAME = `${REPO_OWNER}/${REPO_NAME}`.toLowerCase();
    
    // GitHub API: GET /users/{username}/starred
    // Returns array of repos. Since the user likely just starred it, it will be on the first page.
    const githubRes = await fetch(`https://api.github.com/users/${githubUsername}/starred?per_page=100`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Ventrixa-App"
      }
    });

    if (!githubRes.ok) {
      if (githubRes.status === 404) {
        return NextResponse.json({ error: "GitHub user not found." }, { status: 404 });
      }
      return NextResponse.json({ 
        error: "Failed to verify with GitHub API. You might have hit the rate limit." 
      }, { status: 500 });
    }

    const starredRepos = await githubRes.json();
    
    if (!Array.isArray(starredRepos)) {
      return NextResponse.json({ error: "Unexpected response from GitHub API." }, { status: 500 });
    }

    const hasStarred = starredRepos.some((repo: any) => repo.full_name?.toLowerCase() === FULL_REPO_NAME);

    if (!hasStarred) {
      return NextResponse.json({ 
        error: "We couldn't verify that this GitHub user starred the repository. Make sure your stars are public, and that you starred it recently." 
      }, { status: 400 });
    }

    // Validated! Now update the user in MongoDB or MockDB
    try {
      if (isMongo) {
        await User.findByIdAndUpdate(userId, { 
          plan: "pro", 
          githubStarred: true,
          githubUsername: githubUsername
        });
      } else {
        // Handle mock db fallback
      const mockDbPath = path.join(process.cwd(), "src", "data", "mockDb.json");
      if (fs.existsSync(mockDbPath)) {
        try {
          const db = JSON.parse(fs.readFileSync(mockDbPath, "utf8"));
          if (db.users) {
            const uIndex = db.users.findIndex((u: any) => u.id === userId || u._id === userId);
            if (uIndex !== -1) {
              db.users[uIndex].plan = "pro";
              db.users[uIndex].githubStarred = true;
              db.users[uIndex].githubUsername = githubUsername;
              fs.writeFileSync(mockDbPath, JSON.stringify(db, null, 2));
            }
          }
        } catch (e) {
          console.error("Mock DB update failed:", e);
        }
      }
      }
    } catch (dbErr: any) {
      // Handle MongoDB E11000 duplicate key error specifically
      if (dbErr.code === 11000) {
        return NextResponse.json({ 
          error: "This GitHub username has already been verified by another account." 
        }, { status: 400 });
      }
      throw dbErr; // Re-throw if it's not a duplicate key error
    }

    return NextResponse.json({ success: true, message: "Pro Builder Unlocked!" });

  } catch (error: any) {
    console.error("GitHub Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
