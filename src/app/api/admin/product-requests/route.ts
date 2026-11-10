import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** 고객이 올린 신청 목록. 어느 고객이 올렸는지 함께 내려 준다. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const requests = data ?? [];
  const clientIds = [...new Set(requests.map((r) => r.client_id))];

  // 고객 이름을 한 번에 끌어와 붙인다. 신청마다 따로 묻지 않으려는 것이다.
  const names = new Map<string, { name: string; phone: string | null }>();
  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from("clients")
      .select("id, name, phone")
      .in("id", clientIds);
    for (const c of clients ?? []) names.set(c.id, { name: c.name, phone: c.phone });
  }

  return NextResponse.json({
    requests: requests.map((r) => ({
      ...r,
      client_name: names.get(r.client_id)?.name ?? "(삭제된 고객)",
      client_phone: names.get(r.client_id)?.phone ?? null,
    })),
  });
}
