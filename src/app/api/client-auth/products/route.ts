import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedClientId } from "@/lib/client-auth";

export const dynamic = "force-dynamic";

/** 고객센터에 보여줄 상품. 켜 둔 것만 나간다. */
export async function GET() {
  if (!(await getAuthenticatedClientId())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, tagline, description, price, price_note, category, features, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}
