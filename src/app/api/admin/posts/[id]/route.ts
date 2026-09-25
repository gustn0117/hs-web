import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPostById, updatePost, deletePost } from "@/lib/posts";
import { submitToIndexNow, SITE_URL } from "@/lib/indexnow";
import { refreshInsightPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const post = await updatePost(id, body);
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });

  refreshInsightPages(post.seq);

  if (post.published) {
    await submitToIndexNow([`${SITE_URL}/insights`, `${SITE_URL}/insights/${post.seq}`]).catch(() => []);
  }

  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;
  const target = await getPostById(id);
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });

  refreshInsightPages(target?.seq);

  // 사라진 주소도 알려야 검색 결과에서 정리된다.
  await submitToIndexNow([`${SITE_URL}/insights`, ...(target ? [`${SITE_URL}/insights/${target.seq}`] : [])]).catch(() => []);

  return NextResponse.json({ success: true });
}
