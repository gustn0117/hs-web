import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function getVisitorHash(request: NextRequest): string {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const today = new Date().toISOString().slice(0, 10);

  return crypto
    .createHash("sha256")
    .update(`${ip}:${userAgent}:${today}`)
    .digest("hex")
    .slice(0, 16);
}

// POST: hs-web 미들웨어에서 호출
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const site = body?.site;
  const path = body?.path || "/";

  if (!site || typeof site !== "string") {
    return NextResponse.json({ error: "site is required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const visitorHash = getVisitorHash(request);

  await supabase.from("page_views").upsert(
    {
      site,
      visited_at: today,
      visitor_hash: visitorHash,
      path: path.slice(0, 255),
    },
    { onConflict: "site,visited_at,visitor_hash,path", ignoreDuplicates: true }
  );

  return NextResponse.json({ ok: true });
}

// GET: 다른 사이트용 1x1 트래킹 픽셀
export async function GET(request: NextRequest) {
  const site = request.nextUrl.searchParams.get("site");
  const path = request.nextUrl.searchParams.get("path") || "/";

  if (!site) {
    return new NextResponse(null, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const visitorHash = getVisitorHash(request);

  await supabase.from("page_views").upsert(
    {
      site,
      visited_at: today,
      visitor_hash: visitorHash,
      path: path.slice(0, 255),
    },
    { onConflict: "site,visited_at,visitor_hash,path", ignoreDuplicates: true }
  );

  // 1x1 투명 GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
