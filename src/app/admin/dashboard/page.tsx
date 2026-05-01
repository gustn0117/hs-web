"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";
import DashboardTodos from "./Todos";

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
    client_id: string;
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
  paid: { label: "완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  confirming: { label: "확인중", cls: "bg-slate-50 text-slate-600 border border-slate-200" },
  pending: { label: "대기", cls: "bg-amber-50 text-amber-700 border border-amber-100" },
  overdue: { label: "미납", cls: "bg-red-50 text-red-700 border border-red-100" },
};

function fmt(n: number) {
  return Number(n).toLocaleString() + "원";
}

function fmtShort(n: number) {
  if (n >= 100000000) return (n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1) + "억";
  if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + "만";
  return Number(n).toLocaleString();
}

function fmtMonthShort(m: string) {
  const [, month] = m.split("-");
  return parseInt(month, 10) + "월";
}

// Smooth-curve SVG path generator for line/area charts
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) * 0.5;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) * 0.5;
    const cp2y = p1.y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [excludeTarget, setExcludeTarget] = useState<{
    id: string;
    client_id: string;
    client_name: string;
    project_name: string;
  } | null>(null);
  const [excludeReason, setExcludeReason] = useState("");
  const [excludeSaving, setExcludeSaving] = useState(false);
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);

  const refresh = () => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  };

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const submitExclude = async () => {
    if (!excludeTarget) return;
    if (!excludeReason.trim()) {
      alert("제외 사유를 입력해주세요.");
      return;
    }
    setExcludeSaving(true);
    try {
      const res = await fetch(`/api/clients/${excludeTarget.client_id}/projects/${excludeTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hosting_excluded: true,
          hosting_excluded_reason: excludeReason.trim(),
          hosting_excluded_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("실패");
      setExcludeTarget(null);
      setExcludeReason("");
      refresh();
    } catch {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setExcludeSaving(false);
    }
  };

  const derived = useMemo(() => {
    if (!stats) return null;
    const months = stats.monthlyRevenue;
    const last = months[months.length - 1]?.amount ?? 0;
    const prev = months[months.length - 2]?.amount ?? 0;
    const growthPct = prev > 0 ? ((last - prev) / prev) * 100 : last > 0 ? 100 : 0;
    const max = Math.max(...months.map((m) => m.amount), 1);
    const total = months.reduce((s, m) => s + m.amount, 0);
    return { last, prev, growthPct, max, total };
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-5">
            <div className="h-7 bg-slate-200 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-xl border border-slate-200" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 h-72 bg-white rounded-xl border border-slate-200" />
              <div className="h-72 bg-white rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !derived) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <div className="text-center py-20 text-slate-500">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { overview, monthlyRevenue, revenueByType, recentPayments, overduePayments, projectStatusCounts, activeProjects, hostingUnconfirmed, hostingRenewals, domainRenewals, expiredHosting, expiredDomains } = stats;
  const alertCount = expiredHosting.length + expiredDomains.length + hostingRenewals.length + domainRenewals.length;

  const allAlerts = [
    ...expiredHosting.map((h) => ({ id: h.id, type: "expired" as const, category: "호스팅", label: h.provider, date: h.end_date, client_id: h.client_id })),
    ...expiredDomains.map((d) => ({ id: d.id, type: "expired" as const, category: "도메인", label: d.domain_name, date: d.expires_date, client_id: d.client_id })),
    ...hostingRenewals.map((h) => ({ id: h.id, type: "upcoming" as const, category: "호스팅", label: h.provider, date: h.end_date, client_id: h.client_id })),
    ...domainRenewals.map((d) => ({ id: d.id, type: "upcoming" as const, category: "도메인", label: d.domain_name, date: d.expires_date, client_id: d.client_id })),
  ];

  // ── Line/Area chart points ───────────────────────
  const chartW = 720;
  const chartH = 200;
  const chartPadX = 8;
  const chartPadY = 16;
  const innerW = chartW - chartPadX * 2;
  const innerH = chartH - chartPadY * 2;
  const points = monthlyRevenue.map((m, i) => ({
    x: chartPadX + (i / Math.max(monthlyRevenue.length - 1, 1)) * innerW,
    y: chartPadY + innerH - (m.amount / derived.max) * innerH,
    amount: m.amount,
    label: m.month,
  }));
  const linePath = buildSmoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartPadY + innerH} L ${points[0].x} ${chartPadY + innerH} Z`
      : "";
  const yGrid = 4;
  const yGridLines = Array.from({ length: yGrid + 1 }, (_, i) => chartPadY + (i * innerH) / yGrid);
  const yGridLabels = Array.from({ length: yGrid + 1 }, (_, i) => Math.round((derived.max / yGrid) * (yGrid - i)));

  // ── Donut chart for revenue by type ──────────────
  const totalRevType = Object.values(revenueByType).reduce((s, v) => s + v, 0);
  const donutR = 36;
  const donutCirc = 2 * Math.PI * donutR;
  const donutEntries = Object.entries(revenueByType).sort((a, b) => b[1] - a[1]);
  const donutPalette = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1", "#e2e8f0"];
  let donutOffset = 0;
  const donutSegments = donutEntries.map(([type, amount], i) => {
    const pct = totalRevType > 0 ? amount / totalRevType : 0;
    const segLen = pct * donutCirc;
    const seg = {
      type,
      amount,
      pct,
      color: donutPalette[i % donutPalette.length],
      offset: donutOffset,
      length: segLen,
    };
    donutOffset += segLen;
    return seg;
  });

  // ── Status color (subtle) ────────────────────────
  const statusColors: Record<string, string> = {
    "상담중": "#a16207",
    "진행중": "#0f172a",
    "완료": "#047857",
    "유지보수": "#6d28d9",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-5">
        {/* ── Header strip ───────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">대시보드</h2>
            <p className="text-slate-500 text-sm mt-1">
              {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
              {" · "}
              {alertCount > 0 ? (
                <span className="text-amber-700 font-medium">알림 {alertCount}건</span>
              ) : (
                <span className="text-emerald-700 font-medium">모두 정상</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/payments"
              className="text-xs px-3 h-8 inline-flex items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 no-underline transition-colors"
            >
              결제 관리
            </Link>
            <Link
              href="/admin/clients"
              className="text-xs px-3 h-8 inline-flex items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 no-underline transition-colors"
            >
              클라이언트
            </Link>
            <button
              onClick={refresh}
              className="text-xs px-3 h-8 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              새로고침
            </button>
          </div>
        </div>

        {/* ── KPI cards (4) ─────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total revenue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 relative overflow-hidden">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">총 수익</p>
            <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">{fmtShort(overview.totalRevenue)}원</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                  derived.growthPct >= 0 ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {derived.growthPct >= 0 ? "▲" : "▼"} {Math.abs(derived.growthPct).toFixed(0)}%
              </span>
              <span className="text-[11px] text-slate-500">전월 대비</span>
            </div>
            {/* Mini sparkline */}
            <svg viewBox="0 0 100 30" className="absolute right-3 bottom-3 w-20 h-7 opacity-60" aria-hidden>
              <path
                d={buildSmoothPath(
                  monthlyRevenue.slice(-6).map((m, i, arr) => ({
                    x: (i / Math.max(arr.length - 1, 1)) * 100,
                    y: 30 - (m.amount / Math.max(...arr.map((x) => x.amount), 1)) * 25 - 2,
                  }))
                )}
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">미수금</p>
            <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">{fmtShort(overview.pendingAmount)}원</p>
            <p className="text-[11px] text-slate-500 mt-1.5">결제 대기 중</p>
            {/* Bar mini visual */}
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{
                  width: `${
                    overview.totalRevenue + overview.pendingAmount > 0
                      ? (overview.pendingAmount / (overview.totalRevenue + overview.pendingAmount)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Overdue */}
          <div
            className={`rounded-xl border p-5 ${
              overview.overdueAmount > 0 ? "bg-red-50/40 border-red-200" : "bg-white border-slate-200"
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">미납금</p>
            <p
              className={`text-[26px] font-bold mt-2 tabular-nums ${
                overview.overdueAmount > 0 ? "text-red-600" : "text-slate-900"
              }`}
            >
              {fmtShort(overview.overdueAmount)}원
            </p>
            <p className={`text-[11px] mt-1.5 font-medium ${overview.overdueAmount > 0 ? "text-red-600" : "text-slate-500"}`}>
              {overview.overdueAmount > 0 ? `${overduePayments.length}건 처리 필요` : "미납 없음"}
            </p>
          </div>

          {/* Clients / projects */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">활성 자원</p>
            <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">
              {overview.activeClients}
              <span className="text-slate-400 font-medium text-base"> / {overview.totalClients}</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
              <span>P {overview.totalProjects}</span>
              <span className="w-px h-3 bg-slate-200" />
              <span>H {overview.totalHosting}</span>
              <span className="w-px h-3 bg-slate-200" />
              <span>D {overview.totalDomains}</span>
            </div>
          </div>
        </div>

        {/* ── Checklist (체크리스트 + 메모) ───────── */}
        <DashboardTodos />

        {/* ── Critical alert: overdue payments ────── */}
        {overduePayments.length > 0 && (
          <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                미납 결제 {overduePayments.length}건
              </h3>
              <span className="text-xs text-red-600 font-bold tabular-nums">{fmt(overview.overdueAmount)}</span>
            </div>
            <ul className="divide-y divide-slate-100 list-none">
              {overduePayments.map((p) => {
                const daysLate = p.payment_date ? Math.floor((Date.now() - new Date(p.payment_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <li key={p.id}>
                    <Link
                      href={`/admin/clients/${p.client_id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 no-underline transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                        <span className="text-sm font-semibold text-slate-900 truncate">{p.client_name}</span>
                        <span className="text-xs text-slate-500 truncate hidden sm:inline">
                          {p.type}{p.description ? ` · ${p.description}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        {daysLate > 0 && <span className="text-[11px] text-red-600 font-bold">{daysLate}일 경과</span>}
                        <span className="text-sm font-bold text-slate-900 tabular-nums">{fmt(p.amount)}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── Revenue trend (line/area) ───────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">월별 수익 추이</h3>
              <p className="text-xs text-slate-500 mt-0.5">최근 12개월</p>
            </div>
            <div className="flex items-end gap-5 text-right">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">이번 달</p>
                <p className="text-base font-bold text-slate-900 tabular-nums">{fmt(derived.last)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">12개월 합계</p>
                <p className="text-base font-bold text-slate-900 tabular-nums">{fmt(derived.total)}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${chartW} ${chartH + 28}`} className="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y grid */}
              {yGridLines.map((y, i) => (
                <line key={i} x1={chartPadX} x2={chartW - chartPadX} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === yGridLines.length - 1 ? "0" : "2 4"} />
              ))}

              {/* Y labels (right side) */}
              {yGridLabels.map((v, i) => (
                <text key={i} x={chartW - 4} y={yGridLines[i] - 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {fmtShort(v)}
                </text>
              ))}

              {/* Area fill */}
              {areaPath && <path d={areaPath} fill="url(#rev-area)" />}
              {/* Line */}
              {linePath && <path d={linePath} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Hover targets + dots */}
              {points.map((p, i) => {
                const isHover = hoverMonth === i;
                const isLast = i === points.length - 1;
                return (
                  <g key={i} onMouseEnter={() => setHoverMonth(i)} onMouseLeave={() => setHoverMonth(null)}>
                    <rect x={p.x - 28} y={chartPadY} width="56" height={innerH} fill="transparent" />
                    {(isHover || isLast) && p.amount > 0 && (
                      <line x1={p.x} x2={p.x} y1={chartPadY} y2={chartPadY + innerH} stroke="#0f172a" strokeOpacity={isHover ? "0.3" : "0.15"} strokeWidth="1" strokeDasharray="2 3" />
                    )}
                    {p.amount > 0 && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isLast ? 4 : isHover ? 3.5 : 2.5}
                        fill={isLast ? "#0f172a" : "#fff"}
                        stroke="#0f172a"
                        strokeWidth="1.8"
                      />
                    )}
                    {/* X label */}
                    <text x={p.x} y={chartH + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">
                      {fmtMonthShort(p.label)}
                    </text>
                  </g>
                );
              })}

              {/* Hover tooltip */}
              {hoverMonth !== null && points[hoverMonth] && points[hoverMonth].amount > 0 && (
                <g>
                  <rect
                    x={Math.min(Math.max(points[hoverMonth].x - 50, chartPadX), chartW - 100 - chartPadX)}
                    y={Math.max(points[hoverMonth].y - 38, 4)}
                    width="100"
                    height="32"
                    rx="6"
                    fill="#0f172a"
                  />
                  <text
                    x={Math.min(Math.max(points[hoverMonth].x, chartPadX + 50), chartW - 50 - chartPadX)}
                    y={Math.max(points[hoverMonth].y - 22, 18)}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94a3b8"
                  >
                    {points[hoverMonth].label}
                  </text>
                  <text
                    x={Math.min(Math.max(points[hoverMonth].x, chartPadX + 50), chartW - 50 - chartPadX)}
                    y={Math.max(points[hoverMonth].y - 8, 32)}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {fmt(points[hoverMonth].amount)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* ── Donut + Project status ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-start">
          {/* Donut: revenue by type */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">수익 유형별</h3>
            <p className="text-xs text-slate-500 mb-5">결제 완료 기준</p>

            {totalRevType === 0 ? (
              <p className="text-slate-400 text-sm py-10 text-center">데이터 없음</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <svg viewBox="0 0 100 100" className="w-32 h-32">
                    <circle cx="50" cy="50" r={donutR} fill="none" stroke="#f1f5f9" strokeWidth="14" />
                    {donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r={donutR}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${seg.length} ${donutCirc}`}
                        strokeDashoffset={-seg.offset}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="butt"
                      />
                    ))}
                    <text x="50" y="48" textAnchor="middle" fontSize="9" fill="#94a3b8">합계</text>
                    <text x="50" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                      {fmtShort(totalRevType)}원
                    </text>
                  </svg>
                </div>
                <ul className="flex-1 space-y-2 w-full list-none m-0">
                  {donutSegments.map((seg) => (
                    <li key={seg.type} className="flex items-center gap-2.5 text-sm">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                      <span className="text-slate-700 flex-1 truncate">{seg.type}</span>
                      <span className="text-slate-500 text-xs tabular-nums">{(seg.pct * 100).toFixed(0)}%</span>
                      <span className="text-slate-900 font-semibold tabular-nums w-20 text-right">{fmtShort(seg.amount)}원</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Project status horizontal bars */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">프로젝트 현황</h3>
                <p className="text-xs text-slate-500 mt-0.5">상태별 분포</p>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">총 {overview.totalProjects}건</span>
            </div>
            {Object.keys(projectStatusCounts).length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">데이터 없음</p>
            ) : (
              <ul className="space-y-3 list-none m-0">
                {Object.entries(projectStatusCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => {
                    const total = overview.totalProjects || 1;
                    const pct = (count / total) * 100;
                    const color = statusColors[status] ?? "#64748b";
                    return (
                      <li key={status}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            <span className="text-sm font-medium text-slate-700">{status}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-slate-500 tabular-nums">{pct.toFixed(0)}%</span>
                            <span className="text-sm font-bold text-slate-900 tabular-nums">{count}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}

            {activeProjects.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">활성 프로젝트</h4>
                  <Link href="/admin/clients" className="text-xs text-slate-500 hover:text-slate-900 no-underline">
                    전체 ({activeProjects.length}) →
                  </Link>
                </div>
                <ul className="space-y-1.5 list-none m-0">
                  {activeProjects.slice(0, 4).map((p) => {
                    const color = statusColors[p.status] ?? "#64748b";
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/admin/clients/${p.client_id}`}
                          className="flex items-center justify-between px-2 py-1.5 -mx-2 rounded-md hover:bg-slate-50 no-underline transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                            <span className="text-sm text-slate-900 truncate">{p.name}</span>
                          </div>
                          <span className="text-xs text-slate-500 truncate ml-3 max-w-[120px]">{p.client_name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── 진행 중인 프로젝트 전용 섹션 ──────────── */}
        {(() => {
          const inProgress = activeProjects.filter((p) => p.status === "진행중");
          return (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    <h3 className="text-sm font-semibold text-slate-900">진행 중인 프로젝트</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">현재 status가 진행중인 프로젝트만 표시</p>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  <span className="font-bold text-slate-900">{inProgress.length}</span> / {activeProjects.length}건
                </span>
              </div>
              {inProgress.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">진행 중인 프로젝트가 없습니다</p>
                  <p className="text-xs text-slate-500 mt-0.5">새 프로젝트를 시작하면 여기에 표시됩니다.</p>
                </div>
              ) : (
                <ul className="list-none m-0 divide-y divide-slate-100">
                  {inProgress.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/admin/clients/${p.client_id}`}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors no-underline group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                          <p className="text-xs text-slate-500 truncate">{p.client_name}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">진행중</span>
                          <svg
                            className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })()}

        {/* ── Action items grid: hosting + alerts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Hosting unconfirmed */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">호스팅 결제 미확인</h3>
                <p className="text-xs text-slate-500 mt-0.5">호스팅 결제가 등록되지 않은 진행/완료 프로젝트</p>
              </div>
              <Link href="/admin/hosting-excluded" className="text-xs text-slate-500 hover:text-slate-900 no-underline whitespace-nowrap">
                제외 목록
              </Link>
            </div>
            {hostingUnconfirmed.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 font-medium">모두 확인됨</p>
                <p className="text-xs text-slate-500 mt-0.5">미확인 항목이 없습니다.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 list-none m-0 max-h-[320px] overflow-y-auto">
                {hostingUnconfirmed.map((h) => (
                  <li key={h.id} className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                    <Link href={`/admin/clients/${h.client_id}`} className="flex-1 min-w-0 no-underline">
                      <p className="text-sm font-semibold text-slate-900 truncate">{h.client_name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {h.project_name}
                        {h.provider ? ` · ${h.provider}` : ""}
                        {h.plan ? ` · ${h.plan}` : ""}
                      </p>
                    </Link>
                    <button
                      onClick={() => {
                        setExcludeTarget({ id: h.id, client_id: h.client_id, client_name: h.client_name, project_name: h.project_name });
                        setExcludeReason("");
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-900 hover:bg-white px-2.5 h-7 inline-flex items-center rounded-md border border-slate-200 hover:border-slate-300 cursor-pointer bg-transparent shrink-0 transition-colors"
                    >
                      제외
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Renewal alerts */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">갱신 · 만료 알림</h3>
                <p className="text-xs text-slate-500 mt-0.5">호스팅 · 도메인 만료 일정</p>
              </div>
              {alertCount > 0 && (
                <span className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                  {alertCount}건
                </span>
              )}
            </div>
            {allAlerts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 font-medium">모두 정상</p>
                <p className="text-xs text-slate-500 mt-0.5">만료 임박 항목이 없습니다.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 list-none m-0 max-h-[320px] overflow-y-auto">
                {allAlerts.map((alert) => {
                  const isExpired = alert.type === "expired";
                  return (
                    <li key={`${alert.category}-${alert.id}`}>
                      <Link
                        href={`/admin/clients/${alert.client_id}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors no-underline"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${isExpired ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                            {isExpired ? "만료" : "임박"}
                          </span>
                          <span className="text-xs text-slate-500 shrink-0">{alert.category}</span>
                          <span className="text-sm text-slate-900 truncate font-medium">{alert.label}</span>
                        </div>
                        <span className="text-xs text-slate-500 tabular-nums shrink-0 ml-3">{alert.date || "-"}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ── Recent payments ─────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">최근 결제 내역</h3>
            <Link href="/admin/payments" className="text-xs text-slate-500 hover:text-slate-900 no-underline">
              전체 보기 →
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="px-5 py-10 text-center text-slate-500 text-sm">결제 내역이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-2.5 px-5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">클라이언트</th>
                    <th className="text-left py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">유형</th>
                    <th className="text-left py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">설명</th>
                    <th className="text-right py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">금액</th>
                    <th className="text-center py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">상태</th>
                    <th className="text-right py-2.5 px-5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => {
                    const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-slate-100 text-slate-600 border border-slate-200" };
                    return (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-5">
                          <Link
                            href={`/admin/clients/${p.client_id}`}
                            className="inline-flex items-center gap-1 text-slate-900 font-semibold no-underline hover:text-slate-600 group"
                          >
                            {p.client_name}
                            <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{p.type}</td>
                        <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">{p.description || "-"}</td>
                        <td className="py-3 px-3 text-slate-900 font-bold text-right tabular-nums">{fmt(p.amount)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded ${si.cls}`}>{si.label}</span>
                        </td>
                        <td className="py-3 px-5 text-slate-500 text-right tabular-nums text-xs">{p.payment_date || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Exclude reason modal ───────────────── */}
      {excludeTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => !excludeSaving && setExcludeTarget(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-900 font-bold text-lg mb-1">호스팅 결제 미확인에서 제외</h3>
            <p className="text-xs text-slate-500 mb-4">
              <span className="font-semibold text-slate-700">{excludeTarget.client_name}</span>
              {" · "}
              {excludeTarget.project_name}
            </p>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              제외 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={excludeReason}
              onChange={(e) => setExcludeReason(e.target.value)}
              rows={3}
              placeholder="예) 외부 서버 사용, 호스팅 불필요 프로젝트, 단발성 작업 등"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-y focus:outline-none focus:border-slate-400"
            />
            <div className="grid grid-cols-2 gap-2 mt-2 mb-5">
              {["외부 서버 사용", "호스팅 불필요", "단발성 작업", "고객 직접 운영"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setExcludeReason(preset)}
                  className="text-xs text-slate-500 hover:text-slate-900 py-1.5 rounded border border-slate-200 hover:border-slate-300 bg-transparent cursor-pointer transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setExcludeTarget(null)}
                disabled={excludeSaving}
                className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={submitExclude}
                disabled={excludeSaving}
                className="px-4 py-2 text-sm text-white bg-slate-900 border-0 rounded-lg hover:bg-slate-800 cursor-pointer disabled:opacity-60"
              >
                {excludeSaving ? "처리 중..." : "제외 처리"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
