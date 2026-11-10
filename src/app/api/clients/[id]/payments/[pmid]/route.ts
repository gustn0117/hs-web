import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeForDb } from "@/lib/sanitize";
import { sendToClient } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pmid } = await params;

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", pmid)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payment: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id: clientId, pmid } = await params;
  const body = await request.json();

  // 바뀌기 전 상태를 먼저 봐 둔다. '완료'로 넘어가는 그 한 번만 알리려는 것이다.
  const { data: before } = await supabase
    .from("payments")
    .select("status, amount")
    .eq("id", pmid)
    .maybeSingle();

  const { error: updateError } = await supabase
    .from("payments")
    .update(sanitizeForDb(body))
    .eq("id", pmid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (before && before.status !== "paid" && body.status === "paid") {
    const amount = Number(before.amount || 0).toLocaleString("ko-KR");
    // 알림이 안 가도 결제 처리는 끝난 것이다. 그래서 기다리되 막지는 않는다.
    await sendToClient(clientId, {
      title: "입금이 확인됐습니다",
      body: `${amount}원 결제가 완료 처리됐습니다.`,
      path: "/client/dashboard",
    }).catch(() => {});
  }

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("id", pmid)
    .single();

  return NextResponse.json({ payment: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pmid: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { pmid } = await params;

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", pmid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
