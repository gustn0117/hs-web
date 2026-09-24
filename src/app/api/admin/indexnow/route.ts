import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import sitemap from "@/app/sitemap";
import { submitToIndexNow, SITE_URL } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

/** 관리자 화면에서 전체 색인 요청을 누를 때 쓴다. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  let urls: string[] = Array.isArray(body.urls) ? body.urls : [];

  if (urls.length === 0) {
    // 사이트맵을 그대로 읽어 모든 공개 페이지를 보낸다. 페이지가 늘어도 따로 손댈 필요가 없다.
    const entries = await sitemap();
    urls = [
      ...entries.map((e) => (typeof e.url === "string" ? e.url : String(e.url))),
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/feed.xml`,
    ];
  }

  const results = await submitToIndexNow(urls);
  const ok = results.some((r) => r.ok);

  return NextResponse.json({ ok, count: urls.length, results }, { status: ok ? 200 : 502 });
}
