import { NextResponse } from "next/server";
import { getPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/portfolio";
import { isAuthenticated } from "@/lib/auth";
import { submitToIndexNow, portfolioUrls } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const item = await updatePortfolioItem(id, body);

  if (!item) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  // 내용이 바뀌었으니 검색엔진에 다시 알린다.
  await submitToIndexNow(portfolioUrls(item.seq)).catch(() => []);

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  // 삭제 전에 번호를 확보해야 어떤 주소가 사라졌는지 알릴 수 있다.
  const target = await getPortfolioItem(id);
  const success = await deletePortfolioItem(id);

  if (!success) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  // 사라진 주소도 알려야 검색 결과에서 정리된다.
  await submitToIndexNow(portfolioUrls(target?.seq)).catch(() => []);

  return NextResponse.json({ success: true });
}
