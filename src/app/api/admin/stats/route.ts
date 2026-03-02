import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const [clientsRes, projectsRes, hostingRes, domainsRes, paymentsRes] =
    await Promise.all([
      supabase.from("clients").select("id, name, is_active, created_at"),
      supabase.from("projects").select("id, client_id, name, status, started_at, completed_at"),
      supabase.from("hosting").select("id, client_id, provider, plan, amount, billing_cycle, start_date, end_date, auto_renew"),
      supabase.from("domains").select("id, client_id, domain_name, registrar, expires_date, auto_renew"),
      supabase.from("payments").select("id, client_id, amount, type, description, payment_date, status"),
    ]);

  const clients = clientsRes.data ?? [];
  const projects = projectsRes.data ?? [];
  const hosting = hostingRes.data ?? [];
  const domains = domainsRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  // Payment aggregation
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount), 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + Number(p.amount), 0);
  const overdueAmount = payments
    .filter((p) => p.status === "overdue")
    .reduce((s, p) => s + Number(p.amount), 0);

  // Monthly revenue (last 12 months)
  const now = new Date();
  const monthlyRevenue: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = `${year}-${String(month + 1).padStart(2, "0")}`;
    const amount = payments
      .filter((p) => {
        if (p.status !== "paid" || !p.payment_date) return false;
        const pd = new Date(p.payment_date);
        return pd.getFullYear() === year && pd.getMonth() === month;
      })
      .reduce((s, p) => s + Number(p.amount), 0);
    monthlyRevenue.push({ month: label, amount });
  }

  // Revenue by type
  const revenueByType: Record<string, number> = {};
  payments
    .filter((p) => p.status === "paid")
    .forEach((p) => {
      revenueByType[p.type] = (revenueByType[p.type] || 0) + Number(p.amount);
    });

  // Upcoming renewals (within 30 days)
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const hostingRenewals = hosting.filter((h) => {
    if (!h.end_date) return false;
    const ed = new Date(h.end_date);
    return ed >= now && ed <= in30Days;
  });
  const domainRenewals = domains.filter((d) => {
    if (!d.expires_date) return false;
    const ed = new Date(d.expires_date);
    return ed >= now && ed <= in30Days;
  });

  // Expired items
  const expiredHosting = hosting.filter(
    (h) => h.end_date && new Date(h.end_date) < now
  );
  const expiredDomains = domains.filter(
    (d) => d.expires_date && new Date(d.expires_date) < now
  );

  // Overdue/unpaid payments (pending/overdue/confirming with past payment_date)
  const overduePayments = payments
    .filter((p) => {
      if (p.status === "paid") return false;
      if (p.status === "overdue" || p.status === "confirming") return true;
      // pending with past payment_date
      if (p.status === "pending" && p.payment_date && new Date(p.payment_date) < now) return true;
      return false;
    })
    .sort((a, b) => (a.payment_date ?? "").localeCompare(b.payment_date ?? ""))
    .map((p) => {
      const client = clients.find((c) => c.id === p.client_id);
      return { ...p, client_name: client?.name ?? "알 수 없음" };
    });

  // Recent payments (last 10)
  const recentPayments = [...payments]
    .sort((a, b) => (b.payment_date ?? "").localeCompare(a.payment_date ?? ""))
    .slice(0, 10)
    .map((p) => {
      const client = clients.find((c) => c.id === p.client_id);
      return { ...p, client_name: client?.name ?? "알 수 없음" };
    });

  // Project status counts
  const projectStatusCounts: Record<string, number> = {};
  projects.forEach((p) => {
    projectStatusCounts[p.status] = (projectStatusCounts[p.status] || 0) + 1;
  });

  return NextResponse.json({
    overview: {
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.is_active).length,
      totalProjects: projects.length,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      totalHosting: hosting.length,
      totalDomains: domains.length,
    },
    monthlyRevenue,
    revenueByType,
    recentPayments,
    overduePayments,
    projectStatusCounts,
    hostingRenewals,
    domainRenewals,
    expiredHosting,
    expiredDomains,
  });
}
