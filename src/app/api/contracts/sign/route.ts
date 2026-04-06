import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

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

// POST: 클라이언트 서명 (증거 수집 포함)
export async function POST(request: Request) {
  const body = await request.json();
  const { token, signature } = body;

  if (!token || !signature) {
    return NextResponse.json({ error: "토큰과 서명이 필요합니다." }, { status: 400 });
  }

  // 계약서 전체 조회 (해시 생성용)
  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("sign_token", token)
    .single();

  if (!contract) return NextResponse.json({ error: "계약서를 찾을 수 없습니다." }, { status: 404 });
  if (contract.status === "signed") return NextResponse.json({ error: "이미 서명된 계약서입니다." }, { status: 400 });

  // 서명자 IP 수집
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const userAgent = request.headers.get("user-agent") || "unknown";
  const signedAt = new Date().toISOString();

  // 계약 내용 해시 (서명 시점의 계약 내용 + 서명 데이터로 무결성 보장)
  const hashPayload = JSON.stringify({
    contract_number: contract.contract_number,
    client_name: contract.client_name,
    project_name: contract.project_name,
    total_amount: contract.total_amount,
    items: contract.items,
    specs: contract.specs,
    terms: contract.terms,
    payment_terms: contract.payment_terms,
    signature,
    signed_at: signedAt,
    sign_ip: ip,
  });
  const contentHash = crypto.createHash("sha256").update(hashPayload).digest("hex");

  const { error } = await supabase
    .from("contracts")
    .update({
      client_signature: signature,
      signed_at: signedAt,
      status: "signed",
      sign_ip: ip,
      sign_user_agent: userAgent,
      content_hash: contentHash,
      updated_at: signedAt,
    })
    .eq("id", contract.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
