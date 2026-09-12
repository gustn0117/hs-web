import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type CalendarEventType = "payment" | "hosting" | "domain";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  clientId: string | null;
  clientName: string;
  amount: number | null;
  /** 결제 건에만 존재 */
  status: string | null;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json(
      { error: "from, to를 YYYY-MM-DD 형식으로 전달해주세요." },
      { status: 400 }
    );
  }

  const [clientsRes, hostingRes, domainsRes, paymentsRes] = await Promise.all([
    supabase.from("clients").select("id, name"),
    supabase
      .from("hosting")
      .select("id, client_id, provider, plan, amount, end_date")
      .gte("end_date", from)
      .lte("end_date", to),
    supabase
      .from("domains")
      .select("id, client_id, domain_name, expires_date")
      .gte("expires_date", from)
      .lte("expires_date", to),
    supabase
      .from("payments")
      .select("id, client_id, amount, type, description, payment_date, status")
      .gte("payment_date", from)
      .lte("payment_date", to),
  ]);

  const firstError =
    clientsRes.error || hostingRes.error || domainsRes.error || paymentsRes.error;
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 });
  }

  const clientName = new Map(
    (clientsRes.data ?? []).map((c) => [c.id, c.name as string])
  );
  const nameOf = (id: string | null) =>
    (id && clientName.get(id)) || "알 수 없음";

  const events: CalendarEvent[] = [];

  for (const p of paymentsRes.data ?? []) {
    events.push({
      id: `payment-${p.id}`,
      type: "payment",
      date: p.payment_date,
      title: p.description?.trim() || p.type || "결제",
      clientId: p.client_id,
      clientName: nameOf(p.client_id),
      amount: p.amount === null ? null : Number(p.amount),
      status: p.status ?? null,
    });
  }

  for (const h of hostingRes.data ?? []) {
    events.push({
      id: `hosting-${h.id}`,
      type: "hosting",
      date: h.end_date,
      title: `${[h.provider, h.plan].filter(Boolean).join(" ") || "호스팅"} 만료`,
      clientId: h.client_id,
      clientName: nameOf(h.client_id),
      amount: h.amount === null ? null : Number(h.amount),
      status: null,
    });
  }

  for (const d of domainsRes.data ?? []) {
    events.push({
      id: `domain-${d.id}`,
      type: "domain",
      date: d.expires_date,
      title: `${d.domain_name} 만료`,
      clientId: d.client_id,
      clientName: nameOf(d.client_id),
      amount: null,
      status: null,
    });
  }

  events.sort((a, b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type));

  return NextResponse.json({ events });
}
