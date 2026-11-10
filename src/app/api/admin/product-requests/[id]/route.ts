import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sendToClient } from "@/lib/push";

export const dynamic = "force-dynamic";

const ALLOWED = ["new", "contacted", "done", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: "알 수 없는 상태입니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const word = status === "contacted" ? "확인했습니다" : status === "done" ? "완료됐습니다" : null;
  if (word) {
    await sendToClient(data.client_id, {
      title: `신청하신 「${data.product_name}」`,
      body: `${word}. 고객센터에서 확인하실 수 있습니다.`,
      path: "/client/dashboard",
    }).catch(() => {});
  }

  return NextResponse.json({ request: data });
}
