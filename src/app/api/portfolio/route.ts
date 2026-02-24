import { NextResponse } from "next/server";
import { getPortfolioItems, createPortfolioItem } from "@/lib/portfolio";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = getPortfolioItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const item = createPortfolioItem({
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

  return NextResponse.json({ item }, { status: 201 });
}
