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
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <AdminHeader />
        <div className="text-center py-20 text-[var(--color-gray)]">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, revenueByType, recentPayments, overduePayments, projectStatusCounts, hostingRenewals, domainRenewals, expiredHosting, expiredDomains } = stats;
  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.amount), 1);
  const alertCount = expiredHosting.length + expiredDomains.length + hostingRenewals.length + domainRenewals.length;

  // Build alert items
  const allAlerts = [
    ...expiredHosting.map((h) => ({ id: h.id, type: "expired" as const, category: "호스팅", label: h.provider, date: h.end_date })),
    ...expiredDomains.map((d) => ({ id: d.id, type: "expired" as const, category: "도메인", label: d.domain_name, date: d.expires_date })),
    ...hostingRenewals.map((h) => ({ id: h.id, type: "upcoming" as const, category: "호스팅", label: h.provider, date: h.end_date })),
    ...domainRenewals.map((d) => ({ id: d.id, type: "upcoming" as const, category: "도메인", label: d.domain_name, date: d.expires_date })),
  ];
  const visibleAlerts = showAllAlerts ? allAlerts : allAlerts.slice(0, 5);

  // Y-axis labels for chart
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round((maxMonthly / ySteps) * (ySteps - i)));

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">대시보드</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">전체 현황을 한 눈에 확인하세요.</p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {alertCount}건의 알림
            </div>
          )}
        </div>

        {/* ===== Overview Cards ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">클라이언트</p>
                <p className="text-[var(--color-dark)] text-2xl font-bold">{overview.totalClients}</p>
              </div>
            </div>
            <p className="text-[var(--color-gray)] text-xs">활성 {overview.activeClients}명</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">총 수익</p>
                <p className="text-[var(--color-dark)] text-2xl font-bold">{fmtShort(overview.totalRevenue)}</p>
              </div>
            </div>
            <p className="text-emerald-600 text-xs font-medium">결제 완료 기준</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">미수금</p>
                <p className="text-[var(--color-dark)] text-2xl font-bold">{fmtShort(overview.pendingAmount)}</p>
              </div>
            </div>
            <p className="text-amber-600 text-xs font-medium">결제 대기</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-gray)] text-xs">미납금</p>
                <p className="text-red-600 text-2xl font-bold">{fmtShort(overview.overdueAmount)}</p>
              </div>
            </div>
            <p className="text-red-500 text-xs font-medium">즉시 처리 필요</p>
          </div>
        </div>

        {/* ===== Overdue Payments ===== */}
        {overduePayments.length > 0 && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              미처리 결제
              <span className="text-xs font-normal text-[var(--color-gray)] ml-1">({overduePayments.length}건)</span>
            </h3>
            <div className="space-y-2">
              {overduePayments.map((p) => {
                const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                const daysLate = p.payment_date ? Math.floor((Date.now() - new Date(p.payment_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <Link
                    key={p.id}
                    href={`/admin/clients/${p.client_id}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50/50 hover:bg-red-50 border border-red-100 transition-colors no-underline"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${si.cls}`}>{si.label}</span>
                      <span className="text-sm font-medium text-[var(--color-dark)] truncate">{p.client_name}</span>
                      <span className="text-xs text-[var(--color-gray)] shrink-0">{p.type}{p.description ? ` · ${p.description}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {daysLate > 0 && <span className="text-xs text-red-500 font-medium">{daysLate}일 경과</span>}
                      <span className="text-sm font-bold text-[var(--color-dark)]">{fmt(p.amount)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== Monthly Revenue Chart ===== */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-[var(--color-dark)] font-semibold mb-6">월별 수익</h3>
          <div className="flex h-52">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-3 py-0 shrink-0">
              {yLabels.map((val, i) => (
                <span key={i} className="text-xs text-[var(--color-gray)] text-right whitespace-nowrap leading-none">
                  {fmtShort(val)}
                </span>
              ))}
            </div>
            {/* Bars */}
            <div className="flex-1 flex items-end gap-3 border-l border-b border-gray-200 pl-3 pb-6 relative">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 relative h-full justify-end">
                  {m.amount > 0 && (
                    <span className="text-[var(--color-dark)] text-xs font-medium whitespace-nowrap">
                      {fmtShort(m.amount)}
                    </span>
                  )}
                  <div
                    className="w-full max-w-[44px] bg-gradient-to-t from-[var(--color-primary)] to-blue-400 rounded-t-lg transition-all"
                    style={{ height: `${Math.max((m.amount / maxMonthly) * 100, m.amount > 0 ? 4 : 0)}%` }}
                  />
                  <span className="text-[var(--color-gray)] text-xs absolute -bottom-5">{fmtMonth(m.month)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ===== Revenue by Type ===== */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4">수익 유형별</h3>
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
                          <span className="text-[var(--color-dark)] font-semibold">{fmt(amount)}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* ===== Project Status ===== */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4">프로젝트 현황</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(projectStatusCounts).map(([status, count]) => {
                const colors: Record<string, string> = {
                  "상담중": "bg-amber-50 border-amber-200 text-amber-700",
                  "진행중": "bg-blue-50 border-blue-200 text-blue-700",
                  "완료": "bg-emerald-50 border-emerald-200 text-emerald-700",
                  "유지보수": "bg-purple-50 border-purple-200 text-purple-700",
                };
                return (
                  <div key={status} className={`border rounded-xl px-4 py-3 ${colors[status] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <p className="text-xs font-medium opacity-80">{status}</p>
                    <p className="text-xl font-bold mt-0.5">{count}건</p>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-[var(--color-gray)]">
              총 {overview.totalProjects}개 프로젝트 · 호스팅 {overview.totalHosting}건 · 도메인 {overview.totalDomains}건
            </div>
          </div>
        </div>

        {/* ===== Alerts: Expiring / Expired ===== */}
        {alertCount > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-[var(--color-dark)] font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              알림
              <span className="text-xs font-normal text-[var(--color-gray)] ml-1">({alertCount}건)</span>
            </h3>
            <div className="space-y-2">
              {visibleAlerts.map((alert) => {
                const isExpired = alert.type === "expired";
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm ${
                      isExpired
                        ? "bg-red-50 border border-red-200"
                        : "bg-orange-50 border border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isExpired ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {isExpired ? "만료됨" : "임박"}
                      </span>
                      <span className={`font-medium ${isExpired ? "text-red-800" : "text-orange-800"}`}>
                        {alert.category}: {alert.label}
                      </span>
                    </div>
                    <span className={`text-xs ${isExpired ? "text-red-600" : "text-orange-600"}`}>
                      {alert.date}{isExpired ? "" : " 만료"}
                    </span>
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
        )}

        {/* ===== Recent Payments ===== */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-semibold">최근 결제 내역</h3>
            <Link href="/admin/clients" className="text-[var(--color-accent)] text-sm no-underline hover:underline font-medium">
              전체 보기
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-[var(--color-gray)] text-sm py-4 text-center">결제 내역이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-[var(--color-gray)] font-medium text-xs">클라이언트</th>
                    <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">유형</th>
                    <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">설명</th>
                    <th className="text-right py-3 px-3 text-[var(--color-gray)] font-medium text-xs">금액</th>
                    <th className="text-center py-3 px-3 text-[var(--color-gray)] font-medium text-xs">상태</th>
                    <th className="text-right py-3 px-6 text-[var(--color-gray)] font-medium text-xs">결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => {
                    const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
