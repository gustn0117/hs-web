import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPortfolioItems } from "@/lib/portfolio";
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
    // 기본: 주요 페이지 + 포트폴리오 전체
    const items = await getPortfolioItems();
    urls = [
      SITE_URL,
      `${SITE_URL}/portfolio`,
      `${SITE_URL}/services`,
      `${SITE_URL}/pricing`,
      `${SITE_URL}/contact`,
      ...items.filter((i) => i.seq > 0).map((i) => `${SITE_URL}/portfolio/${i.seq}`),
    ];
  }

  const results = await submitToIndexNow(urls);
  const ok = results.some((r) => r.ok);

  return NextResponse.json({ ok, count: urls.length, results }, { status: ok ? 200 : 502 });
}
