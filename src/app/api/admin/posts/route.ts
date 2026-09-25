import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllPosts, createPost } from "@/lib/posts";
import { submitToIndexNow, SITE_URL } from "@/lib/indexnow";
import { refreshInsightPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  }

  const post = await createPost({
    title: body.title,
    summary: body.summary ?? "",
    content: body.content ?? "",
    category: body.category ?? "",
    tags: body.tags ?? [],
    coverImage: body.coverImage ?? "",
    region: body.region ?? "",
    regionDetail: body.regionDetail ?? "",
    faq: body.faq ?? [],
    published: Boolean(body.published),
    publishedAt: body.publishedAt ?? "",
  });

  refreshInsightPages(post.seq);

  // 공개 글만 검색엔진에 알린다.
  if (post.published) {
    await submitToIndexNow([`${SITE_URL}/insights`, `${SITE_URL}/insights/${post.seq}`]).catch(() => []);
  }

  return NextResponse.json({ post }, { status: 201 });
}
