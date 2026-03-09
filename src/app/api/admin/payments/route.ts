import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const [paymentsRes, clientsRes] = await Promise.all([
    supabase.from("payments").select("id, client_id, amount, type, description, payment_date, status, created_at"),
    supabase.from("clients").select("id, name"),
  ]);

  const payments = paymentsRes.data ?? [];
  const clients = clientsRes.data ?? [];
  const clientMap = new Map(clients.map((c) => [c.id, c.name]));

  const result = payments.map((p) => ({
    ...p,
    client_name: clientMap.get(p.client_id) ?? "알 수 없음",
  }));

  return NextResponse.json({ payments: result });
}
