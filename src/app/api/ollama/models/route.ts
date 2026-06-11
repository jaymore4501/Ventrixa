import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customUrl = searchParams.get("url") || "http://127.0.0.1:11434";
    
    let targetUrl = customUrl.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `http://${targetUrl}`;
    }

    const tagsUrl = `${targetUrl.replace(/\/$/, "")}/api/tags`;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(tagsUrl, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });
    
    clearTimeout(id);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ online: true, models: data.models || [] });
    }
  } catch (err) {
    // offline or unreachable
  }
  return NextResponse.json({ online: false, models: [] });
}
