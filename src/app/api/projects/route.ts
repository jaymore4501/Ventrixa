import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getProjects, createProject } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const userId = (session.user as any).id || "demo-user-id";
    const projectsList = await getProjects(userId);
    return NextResponse.json(projectsList);
  } catch (e: any) {
    console.error("GET projects failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const body = await req.json();
    const userId = (session.user as any).id || "demo-user-id";

    const projectData = {
      ...body,
      userId,
      status: "draft",
    };

    const newProject = await createProject(projectData);
    return NextResponse.json(newProject, { status: 201 });
  } catch (e: any) {
    console.error("POST project failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
