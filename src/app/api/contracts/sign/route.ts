import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: 서명 토큰으로 계약서 조회 (공개)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "토큰이 필요합니다." }, { status: 400 });

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("sign_token", token)
    .single();

  if (error || !data) return NextResponse.json({ error: "계약서를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ contract: data });
}

// POST: 클라이언트 서명
export async function POST(request: Request) {
  const body = await request.json();
  const { token, signature } = body;

  if (!token || !signature) {
    return NextResponse.json({ error: "토큰과 서명이 필요합니다." }, { status: 400 });
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, status")
    .eq("sign_token", token)
    .single();

  if (!contract) return NextResponse.json({ error: "계약서를 찾을 수 없습니다." }, { status: 404 });
  if (contract.status === "signed") return NextResponse.json({ error: "이미 서명된 계약서입니다." }, { status: 400 });

  const { error } = await supabase
    .from("contracts")
    .update({
      client_signature: signature,
      signed_at: new Date().toISOString(),
      status: "signed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", contract.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
