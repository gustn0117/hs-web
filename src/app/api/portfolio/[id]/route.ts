import { NextResponse } from "next/server";
import { getPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/portfolio";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getPortfolioItem(id);
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
  const item = updatePortfolioItem(id, body);

  if (!item) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const success = deletePortfolioItem(id);

  if (!success) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
