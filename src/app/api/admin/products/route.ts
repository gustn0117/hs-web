import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "상품 이름은 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: body.name.trim(),
      tagline: body.tagline?.trim() || null,
      description: body.description?.trim() || null,
      price: body.price === "" || body.price == null ? null : Number(body.price),
      price_note: body.price_note?.trim() || null,
      category: body.category?.trim() || "제작",
      features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
      is_active: body.is_active !== false,
      sort_order: Number(body.sort_order) || 100,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
