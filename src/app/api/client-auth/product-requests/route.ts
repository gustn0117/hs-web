import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedClientId } from "@/lib/client-auth";

export const dynamic = "force-dynamic";

/** 내가 올린 신청만 본다. */
export async function GET() {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data ?? [] });
}

export async function POST(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { product_id, message } = await request.json();

  if (!product_id) {
    return NextResponse.json({ error: "어떤 상품인지 알 수 없습니다." }, { status: 400 });
  }

  // 켜 둔 상품인지 서버에서 다시 확인한다. 이름도 여기서 가져와 신청에
  // 박아 둔다 — 나중에 상품을 고치거나 지워도 신청 기록은 남아야 한다.
  const { data: product } = await supabase
    .from("products")
    .select("id, name, is_active")
    .eq("id", product_id)
    .maybeSingle();

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "지금은 신청할 수 없는 상품입니다." }, { status: 400 });
  }

  // 같은 상품을 이미 올려 두고 아직 처리 전이면 또 쌓지 않는다.
  const { data: open } = await supabase
    .from("product_requests")
    .select("id")
    .eq("client_id", clientId)
    .eq("product_id", product_id)
    .in("status", ["new", "contacted"])
    .maybeSingle();

  if (open) {
    return NextResponse.json(
      { error: "이미 신청하셨습니다. 곧 연락드리겠습니다." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("product_requests")
    .insert({
      client_id: clientId,
      product_id: product.id,
      product_name: product.name,
      message: typeof message === "string" && message.trim() ? message.trim() : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ request: data });
}
