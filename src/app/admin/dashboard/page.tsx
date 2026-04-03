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

function fmt(n: number): string {
  return Number(n).toLocaleString() + "원";
}

function fmtShort(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + "만원";
  return Number(n).toLocaleString() + "원";
}

function fmtMonth(m: string): string {
  const [, month] = m.split("-");
  return parseInt(month, 10) + "월";
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 lg:pl-60">
      <AdminHeader />
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-7 bg-gray-200 rounded-lg w-32" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-gray-100" />
            <div className="h-72 bg-white rounded-2xl border border-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
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

  if (loading) return <Skeleton />;

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50/50 lg:pl-60">
        <AdminHeader />
        <div className="flex items-center justify-center py-32 text-[var(--color-gray)]">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, revenueByType, recentPayments, overduePayments, projectStatusCounts, hostingRenewals, domainRenewals, expiredHosting, expiredDomains } = stats;
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

  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    "상담중": { bg: "bg-amber-50", text: "text-amber-700", icon: "bg-amber-400" },
    "진행중": { bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-400" },
    "완료": { bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-400" },
    "유지보수": { bg: "bg-violet-50", text: "text-violet-700", icon: "bg-violet-400" },
  };

  const overviewCards = [
    { label: "클라이언트", value: overview.totalClients, sub: `활성 ${overview.activeClients}명`, color: "blue", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> },
    { label: "총 수익", value: fmtShort(overview.totalRevenue), sub: "결제 완료 기준", color: "emerald", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "미수금", value: fmtShort(overview.pendingAmount), sub: "결제 대기", color: "amber", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "미납금", value: fmtShort(overview.overdueAmount), sub: overview.overdueAmount > 0 ? "즉시 처리 필요" : "없음", color: overview.overdueAmount > 0 ? "red" : "gray", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /> },
  ];

  const colorMap: Record<string, { iconBg: string; iconText: string; subText: string }> = {
    blue: { iconBg: "bg-blue-100", iconText: "text-blue-600", subText: "text-blue-600" },
    emerald: { iconBg: "bg-emerald-100", iconText: "text-emerald-600", subText: "text-emerald-600" },
    amber: { iconBg: "bg-amber-100", iconText: "text-amber-600", subText: "text-amber-600" },
    red: { iconBg: "bg-red-100", iconText: "text-red-600", subText: "text-red-600" },
    gray: { iconBg: "bg-gray-100", iconText: "text-gray-500", subText: "text-gray-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 lg:pl-60">
      <AdminHeader />

      <div className="p-6 lg:p-8 max-w-[1400px] pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">대시보드</h2>
            <p className="text-[var(--color-gray)] text-sm mt-0.5">전체 현황을 한 눈에 확인하세요.</p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-semibold">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              {alertCount}건 알림
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {overviewCards.map((card) => {
            const c = colorMap[card.color];
            return (
              <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:shadow-gray-100 transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {card.icon}
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--color-dark)] tracking-tight">{card.value}</p>
                <p className={`text-xs mt-1 font-medium ${c.subText}`}>{card.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
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
                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                      {daysLate > 0 && <span className="text-xs text-red-500 font-semibold">{daysLate}일 경과</span>}
                      <span className="text-sm font-bold text-[var(--color-dark)]">{fmt(p.amount)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Grid: Chart + Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-5">월별 수익</h3>
            <div className="flex h-52">
              <div className="flex flex-col justify-between pr-3 shrink-0">
                {yLabels.map((val, i) => (
                  <span key={i} className="text-[0.7rem] text-[var(--color-gray)] text-right whitespace-nowrap leading-none">
                    {fmtShort(val)}
                  </span>
                ))}
              </div>
              <div className="flex-1 flex items-end gap-2 border-l border-b border-gray-100 pl-3 pb-6 relative">
                {monthlyRevenue.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 relative h-full justify-end">
                    {m.amount > 0 && (
                      <span className="text-[var(--color-dark)] text-[0.65rem] font-semibold whitespace-nowrap">
                        {fmtShort(m.amount)}
                      </span>
                    )}
                    <div
                      className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max((m.amount / maxMonthly) * 100, m.amount > 0 ? 4 : 0)}%` }}
                    />
                    <span className="text-[var(--color-gray)] text-[0.65rem] absolute -bottom-5">{fmtMonth(m.month)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">프로젝트 현황</h3>
            <div className="space-y-3 mb-5">
              {Object.entries(projectStatusCounts).map(([status, count]) => {
                const sc = statusColors[status] ?? { bg: "bg-gray-50", text: "text-gray-700", icon: "bg-gray-400" };
                const total = overview.totalProjects || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${sc.icon} rounded-full`} />
                        <span className={`text-sm font-medium ${sc.text}`}>{status}</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-dark)]">{count}건</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${sc.icon} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-[var(--color-dark)]">{overview.totalProjects}</p>
                <p className="text-[0.7rem] text-[var(--color-gray)]">프로젝트</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-dark)]">{overview.totalHosting}</p>
                <p className="text-[0.7rem] text-[var(--color-gray)]">호스팅</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-dark)]">{overview.totalDomains}</p>
                <p className="text-[0.7rem] text-[var(--color-gray)]">도메인</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Revenue by Type + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Type */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">수익 유형별</h3>
            {Object.keys(revenueByType).length === 0 ? (
              <p className="text-[var(--color-gray)] text-sm py-8 text-center">데이터가 없습니다.</p>
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
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Alerts */}
          {alertCount > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                알림 {alertCount}건
              </h3>
              <div className="space-y-2">
                {visibleAlerts.map((alert) => {
                  const isExpired = alert.type === "expired";
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${
                        isExpired ? "bg-red-50/70 border border-red-100" : "bg-orange-50/70 border border-orange-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[0.65rem] font-bold rounded-full ${
                            isExpired ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {isExpired ? "만료" : "임박"}
                        </span>
                        <span className={`text-sm font-medium ${isExpired ? "text-red-800" : "text-orange-800"}`}>
                          {alert.category}: {alert.label}
                        </span>
                      </div>
                      <span className={`text-xs ${isExpired ? "text-red-500" : "text-orange-500"}`}>
                        {alert.date}
                      </span>
                    </div>
                  );
                })}
              </div>
              {allAlerts.length > 5 && (
                <button
                  onClick={() => setShowAllAlerts(!showAllAlerts)}
                  className="mt-3 w-full text-center py-2 text-xs text-[var(--color-accent)] font-semibold hover:bg-gray-50 rounded-xl cursor-pointer border-none bg-transparent transition-colors"
                >
                  {showAllAlerts ? "접기" : `+${allAlerts.length - 5}건 더 보기`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-dark)]">최근 결제 내역</h3>
            <Link href="/admin/payments" className="text-[var(--color-accent)] text-xs no-underline hover:underline font-semibold">
              전체 보기 &rarr;
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-[var(--color-gray)] text-sm py-8 text-center">결제 내역이 없습니다.</p>
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
                          <span className={`inline-block px-2 py-0.5 text-[0.7rem] font-semibold rounded-full ${si.cls}`}>{si.label}</span>
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
