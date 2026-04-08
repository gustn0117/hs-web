"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface Stats {
  overview: {
    totalClients: number;
    activeClients: number;
    totalProjects: number;
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
    totalHosting: number;
    totalDomains: number;
  };
  monthlyRevenue: { month: string; amount: number }[];
  revenueByType: Record<string, number>;
  recentPayments: {
    id: string;
    client_name: string;
    amount: number;
    type: string;
    description: string;
    payment_date: string;
    status: string;
  }[];
  overduePayments: {
    id: string;
    client_id: string;
    client_name: string;
    amount: number;
    type: string;
    description: string;
    payment_date: string;
    status: string;
  }[];
  projectStatusCounts: Record<string, number>;
  activeProjects: { id: string; name: string; status: string; client_id: string; client_name: string }[];
  hostingUnconfirmed: { id: string; project_name: string; project_status: string; provider: string; plan: string; amount: number; end_date: string; client_id: string; client_name: string }[];
  hostingRenewals: { id: string; provider: string; plan: string; end_date: string; client_id: string }[];
  domainRenewals: { id: string; domain_name: string; expires_date: string; client_id: string }[];
  expiredHosting: { id: string; provider: string; end_date: string; client_id: string }[];
  expiredDomains: { id: string; domain_name: string; expires_date: string; client_id: string }[];
}

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  confirming: { label: "입금확인중", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  pending: { label: "대기", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  overdue: { label: "미납", cls: "bg-red-50 text-red-700 border border-red-200" },
};

function fmt(n: number) {
  return Number(n).toLocaleString() + "원";
}

function fmtShort(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + "만원";
  return Number(n).toLocaleString() + "원";
}

function fmtMonth(m: string) {
  const [, month] = m.split("-");
  return parseInt(month, 10) + "월";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 h-64 bg-white rounded-2xl border border-gray-100" />
              <div className="h-64 bg-white rounded-2xl border border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="text-center py-20 text-[var(--color-gray)]">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { overview, monthlyRevenue, revenueByType, recentPayments, overduePayments, projectStatusCounts, activeProjects, hostingUnconfirmed, hostingRenewals, domainRenewals, expiredHosting, expiredDomains } = stats;
  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.amount), 1);
  const alertCount = expiredHosting.length + expiredDomains.length + hostingRenewals.length + domainRenewals.length;

  const allAlerts = [
    ...expiredHosting.map((h) => ({ id: h.id, type: "expired" as const, category: "호스팅", label: h.provider, date: h.end_date })),
    ...expiredDomains.map((d) => ({ id: d.id, type: "expired" as const, category: "도메인", label: d.domain_name, date: d.expires_date })),
    ...hostingRenewals.map((h) => ({ id: h.id, type: "upcoming" as const, category: "호스팅", label: h.provider, date: h.end_date })),
    ...domainRenewals.map((d) => ({ id: d.id, type: "upcoming" as const, category: "도메인", label: d.domain_name, date: d.expires_date })),
  ];
  const visibleAlerts = showAllAlerts ? allAlerts : allAlerts.slice(0, 5);

  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round((maxMonthly / ySteps) * (ySteps - i)));

  const statusColors: Record<string, { dot: string; text: string; bar: string }> = {
    "상담중": { dot: "bg-amber-400", text: "text-amber-700", bar: "bg-amber-400" },
    "진행중": { dot: "bg-blue-500", text: "text-blue-700", bar: "bg-blue-500" },
    "완료": { dot: "bg-emerald-500", text: "text-emerald-700", bar: "bg-emerald-500" },
    "유지보수": { dot: "bg-violet-500", text: "text-violet-700", bar: "bg-violet-500" },
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">대시보드</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">전체 현황을 한 눈에 확인하세요.</p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              {alertCount}건 알림
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "클라이언트", value: String(overview.totalClients), sub: `활성 ${overview.activeClients}명`, accent: "blue" },
            { label: "총 수익", value: fmtShort(overview.totalRevenue), sub: "결제 완료 기준", accent: "emerald" },
            { label: "미수금", value: fmtShort(overview.pendingAmount), sub: "결제 대기", accent: "amber" },
            { label: "미납금", value: fmtShort(overview.overdueAmount), sub: overview.overdueAmount > 0 ? "즉시 처리 필요" : "없음", accent: overview.overdueAmount > 0 ? "red" : "gray" },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[var(--color-gray)] text-xs font-medium mb-2">{card.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${card.accent === "red" ? "text-red-600" : "text-[var(--color-dark)]"}`}>
                {card.value}
              </p>
              <p className={`text-xs mt-1.5 font-medium ${
                { blue: "text-blue-600", emerald: "text-emerald-600", amber: "text-amber-600", red: "text-red-500", gray: "text-[var(--color-gray)]" }[card.accent]
              }`}>
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Overdue Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-50/30 border border-red-200 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              미처리 결제 {overduePayments.length}건
            </h3>
            <div className="space-y-2">
              {overduePayments.map((p) => {
                const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                const daysLate = p.payment_date ? Math.floor((Date.now() - new Date(p.payment_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <Link
                    key={p.id}
                    href={`/admin/clients/${p.client_id}`}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-red-100 transition-colors no-underline"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`px-2 py-0.5 text-[0.7rem] font-semibold rounded-full shrink-0 ${si.cls}`}>{si.label}</span>
                      <span className="text-sm font-medium text-[var(--color-dark)] truncate">{p.client_name}</span>
                      <span className="text-xs text-[var(--color-gray)] shrink-0 hidden sm:inline">{p.type}{p.description ? ` · ${p.description}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {daysLate > 0 && <span className="text-xs text-red-500 font-semibold">{daysLate}일 경과</span>}
                      <span className="text-sm font-bold text-[var(--color-dark)]">{fmt(p.amount)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart + Project Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Revenue */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold text-sm mb-6">월별 수익 추이</h3>
            <div className="flex h-52">
              <div className="flex flex-col justify-between pr-3 shrink-0">
                {yLabels.map((val, i) => (
                  <span key={i} className="text-[0.7rem] text-[var(--color-gray)] text-right whitespace-nowrap leading-none">
                    {fmtShort(val)}
                  </span>
                ))}
              </div>
              <div className="flex-1 flex items-end gap-2 border-l border-b border-gray-100 pl-3 pb-6 relative">
                {monthlyRevenue.map((m, idx) => {
                  const isLast = idx === monthlyRevenue.length - 1;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1 relative h-full justify-end group">
                      {m.amount > 0 && (
                        <span className={`text-xs font-semibold whitespace-nowrap transition-opacity ${isLast ? "text-[var(--color-primary)] opacity-100" : "text-[var(--color-dark)] opacity-0 group-hover:opacity-100"}`}>
                          {fmtShort(m.amount)}
                        </span>
                      )}
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                          isLast
                            ? "bg-gradient-to-t from-[var(--color-primary)] to-blue-400 shadow-sm shadow-blue-200"
                            : "bg-gray-200 group-hover:bg-blue-300"
                        }`}
                        style={{ height: `${Math.max((m.amount / maxMonthly) * 100, m.amount > 0 ? 4 : 0)}%` }}
                      />
                      <span className="text-[var(--color-gray)] text-[0.65rem] absolute -bottom-5">{fmtMonth(m.month)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold text-sm mb-5">프로젝트 현황</h3>
            <div className="space-y-4 mb-5">
              {Object.entries(projectStatusCounts).map(([status, count]) => {
                const sc = statusColors[status] ?? { dot: "bg-gray-400", text: "text-gray-700", bar: "bg-gray-400" };
                const total = overview.totalProjects || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${sc.dot} rounded-full`} />
                        <span className={`text-sm ${sc.text} font-medium`}>{status}</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-dark)] tabular-nums">{count}건</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${sc.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between text-center">
              {[
                { n: overview.totalProjects, l: "프로젝트" },
                { n: overview.totalHosting, l: "호스팅" },
                { n: overview.totalDomains, l: "도메인" },
              ].map((item) => (
                <div key={item.l}>
                  <p className="text-lg font-bold text-[var(--color-dark)]">{item.n}</p>
                  <p className="text-[0.7rem] text-[var(--color-gray)]">{item.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Projects Detail */}
        {activeProjects.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[var(--color-dark)] font-semibold text-sm">진행 중인 프로젝트</h3>
              <Link href="/admin/projects" className="text-xs text-[var(--color-accent)] font-semibold no-underline hover:underline">
                전체보기 ({activeProjects.length}) &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
              {activeProjects.slice(0, 9).map((p) => {
                const sc = statusColors[p.status] ?? { dot: "bg-gray-400", text: "text-gray-700", bar: "bg-gray-400" };
                return (
                  <a
                    key={p.id}
                    href={`/admin/clients/${p.client_id}`}
                    className="bg-white p-5 hover:bg-gray-50/50 transition-colors no-underline block"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 ${sc.dot} rounded-full shrink-0`} />
                      <span className={`text-xs font-semibold ${sc.text}`}>{p.status}</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-dark)] mb-1 truncate">{p.name}</p>
                    <p className="text-xs text-[var(--color-gray)]">{p.client_name}</p>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Hosting Unconfirmed */}
        {hostingUnconfirmed && hostingUnconfirmed.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full" />
                <h3 className="text-[var(--color-dark)] font-semibold text-sm">호스팅 결제 미확인</h3>
              </div>
              <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">{hostingUnconfirmed.length}건</span>
            </div>
            <div className="divide-y divide-gray-50">
              {hostingUnconfirmed.map((h) => (
                <a
                  key={h.id}
                  href={`/admin/clients/${h.client_id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors no-underline"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-dark)] truncate">{h.client_name}</p>
                      <p className="text-xs text-[var(--color-gray)] truncate">{h.project_name}{h.provider ? ` · ${h.provider}` : ""}{h.plan ? ` · ${h.plan}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {h.amount > 0 && <span className="text-sm font-semibold text-[var(--color-dark)] tabular-nums">{fmtShort(h.amount)}</span>}
                    {h.end_date && <span className="text-xs text-[var(--color-gray)]">~{h.end_date}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Revenue by Type + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold text-sm mb-4">수익 유형별</h3>
            {Object.keys(revenueByType).length === 0 ? (
              <p className="text-[var(--color-gray)] text-sm py-4 text-center">데이터가 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(revenueByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, amount]) => {
                    const total = Object.values(revenueByType).reduce((s, v) => s + v, 0);
                    const pct = total > 0 ? (amount / total) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-[var(--color-dark-2)] font-medium">{type}</span>
                          <span className="text-[var(--color-dark)] font-semibold tabular-nums">{fmt(amount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {alertCount > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[var(--color-dark)] font-semibold text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                갱신 알림 {alertCount}건
              </h3>
              <div className="space-y-2">
                {visibleAlerts.map((alert) => {
                  const isExpired = alert.type === "expired";
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${
                        isExpired ? "bg-red-50 border border-red-100" : "bg-orange-50 border border-orange-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[0.65rem] font-bold rounded-full ${isExpired ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                          {isExpired ? "만료" : "임박"}
                        </span>
                        <span className={`font-medium ${isExpired ? "text-red-800" : "text-orange-800"}`}>
                          {alert.category}: {alert.label}
                        </span>
                      </div>
                      <span className={`text-xs ${isExpired ? "text-red-500" : "text-orange-500"}`}>{alert.date}</span>
                    </div>
                  );
                })}
              </div>
              {allAlerts.length > 5 && (
                <button
                  onClick={() => setShowAllAlerts(!showAllAlerts)}
                  className="mt-3 w-full text-center py-2 text-sm text-[var(--color-accent)] font-medium hover:bg-gray-50 rounded-lg cursor-pointer border-none bg-transparent transition-colors"
                >
                  {showAllAlerts ? "접기" : `+${allAlerts.length - 5}건 더 보기`}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--color-dark)]">갱신 알림 없음</p>
              <p className="text-xs text-[var(--color-gray)] mt-1">모든 호스팅 · 도메인이 정상입니다.</p>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-semibold text-sm">최근 결제 내역</h3>
            <Link href="/admin/payments" className="text-[var(--color-accent)] text-xs no-underline hover:underline font-semibold">
              전체 보기 &rarr;
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-[var(--color-gray)] text-sm py-4 text-center">결제 내역이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-6 text-[var(--color-gray)] font-medium text-xs">클라이언트</th>
                    <th className="text-left py-2.5 px-3 text-[var(--color-gray)] font-medium text-xs">유형</th>
                    <th className="text-left py-2.5 px-3 text-[var(--color-gray)] font-medium text-xs">설명</th>
                    <th className="text-right py-2.5 px-3 text-[var(--color-gray)] font-medium text-xs">금액</th>
                    <th className="text-center py-2.5 px-3 text-[var(--color-gray)] font-medium text-xs">상태</th>
                    <th className="text-right py-2.5 px-6 text-[var(--color-gray)] font-medium text-xs">결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => {
                    const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-6 text-[var(--color-dark)] font-medium">{p.client_name}</td>
                        <td className="py-3 px-3 text-[var(--color-dark-2)]">{p.type}</td>
                        <td className="py-3 px-3 text-[var(--color-gray)]">{p.description || "-"}</td>
                        <td className="py-3 px-3 text-[var(--color-dark)] font-semibold text-right tabular-nums">{fmt(p.amount)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${si.cls}`}>{si.label}</span>
                        </td>
                        <td className="py-3 px-6 text-[var(--color-gray)] text-right tabular-nums">{p.payment_date || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
