import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) {
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "상품 이름은 필수입니다." }, { status: 400 });
    }
    patch.name = body.name.trim();
  }
  if (body.tagline !== undefined) patch.tagline = body.tagline?.trim() || null;
  if (body.description !== undefined) patch.description = body.description?.trim() || null;
  if (body.price !== undefined) patch.price = body.price === "" || body.price == null ? null : Number(body.price);
  if (body.price_note !== undefined) patch.price_note = body.price_note?.trim() || null;
  if (body.category !== undefined) patch.category = body.category?.trim() || "제작";
  if (body.features !== undefined) patch.features = Array.isArray(body.features) ? body.features.filter(Boolean) : [];
  if (body.is_active !== undefined) patch.is_active = !!body.is_active;
  if (body.sort_order !== undefined) patch.sort_order = Number(body.sort_order) || 100;

  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
