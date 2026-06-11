import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProject, getWebsiteByProject, getPages } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const { projectId } = await params;
    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const website = await getWebsiteByProject(projectId);
    if (!website) {
      return NextResponse.json({ pages: [], website: null });
    }

    const pages = await getPages(website.id || website._id);
    return NextResponse.json({ pages, website });
  } catch (e: any) {
    console.error("GET project pages failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
