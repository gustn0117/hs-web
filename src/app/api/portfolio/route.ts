import { NextResponse } from "next/server";
import { getPortfolioItems, createPortfolioItem } from "@/lib/portfolio";
import { isAuthenticated } from "@/lib/auth";
import { submitToIndexNow, portfolioUrls } from "@/lib/indexnow";
import { refreshPortfolioPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getPortfolioItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const item = await createPortfolioItem({
    title: body.title || "",
    category: body.category || "",
    client: body.client || "",
    date: body.date || "",
    description: body.description || "",
    content: body.content || "",
    thumbnail: body.thumbnail || "",
    images: body.images || [],
    tags: body.tags || [],
    url: body.url || "",
    featured: body.featured || false,
    order: body.order ?? 999,
  });

  refreshPortfolioPages(item.seq);

  // 새 사례를 검색엔진에 바로 알린다. 실패해도 등록 자체는 성공으로 둔다.
  await submitToIndexNow(portfolioUrls(item.seq)).catch(() => []);

  return NextResponse.json({ item }, { status: 201 });
}
