import { NextResponse } from "next/server";
import { getAuthenticatedClientId } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientId = await getAuthenticatedClientId();
  if (!clientId) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { paymentId } = await request.json();
  if (!paymentId) {
    return NextResponse.json({ error: "결제 ID가 필요합니다." }, { status: 400 });
  }

  // Verify the payment belongs to this client and is in a confirmable state
  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select("id, client_id, status")
    .eq("id", paymentId)
    .single();

  if (fetchError || !payment) {
    return NextResponse.json({ error: "결제를 찾을 수 없습니다." }, { status: 404 });
  }

  if (payment.client_id !== clientId) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  if (payment.status !== "pending" && payment.status !== "overdue") {
    return NextResponse.json({ error: "이미 처리된 결제입니다." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("payments")
    .update({ status: "confirming" })
    .eq("id", paymentId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
