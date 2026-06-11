export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getSections, saveSections } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const sections = await getSections(pageId);
    return NextResponse.json(sections);
  } catch (e: any) {
    console.error("GET sections failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const { pageId } = await params;
    const body = await req.json(); // Array of sections
    const saved = await saveSections(pageId, body);
    return NextResponse.json(saved);
  } catch (e: any) {
    console.error("POST sections failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
