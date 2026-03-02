"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Project {
  id: string;
  name: string;
  website_url: string | null;
  tech_stack: string | null;
  admin_url: string | null;
  admin_id: string | null;
  admin_pw: string | null;
  status: string;
  description: string | null;
  started_at: string | null;
  completed_at: string | null;
  unit_price: number | null;
  platform: string | null;
}

interface Hosting {
  id: string;
  project_id: string | null;
  provider: string;
  plan: string | null;
  amount: number;
  billing_cycle: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
  memo: string | null;
}

interface Domain {
  id: string;
  project_id: string | null;
  domain_name: string;
  registrar: string | null;
  registered_date: string | null;
  expires_date: string | null;
  auto_renew: boolean;
  nameservers: string | null;
}

interface Payment {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  payment_date: string;
  status: string;
}

interface ClientInfo {
  id: string;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  memo: string | null;
  created_at: string;
}

interface DashboardData {
  client: ClientInfo;
  projects: Project[];
  hosting: Hosting[];
  domains: Domain[];
  payments: Payment[];
}

type TabKey = "overview" | "projects" | "payments" | "settings";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "상담중": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "진행중": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "완료": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "유지보수": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

const PAYMENT_STATUS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  paid: { label: "완료", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  confirming: { label: "확인 중", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  pending: { label: "대기", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  overdue: { label: "미납", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "2-digit", month: "numeric", day: "numeric" });
}

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString() + "원";
}

function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getNextRenewalDate(endDate: string | null, billingCycle: string): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  if (end > now) return endDate;
  const next = new Date(end);
  while (next <= now) {
    if (billingCycle === "yearly") next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString().split("T")[0];
}

function getRenewalBadge(d: number): { text: string; cls: string } {
  if (d < 0) return { text: `${Math.abs(d)}일 지남`, cls: "bg-red-100 text-red-700 border-red-200" };
  if (d <= 7) return { text: `D-${d}`, cls: "bg-red-100 text-red-700 border-red-200" };
  if (d <= 30) return { text: `D-${d}`, cls: "bg-amber-100 text-amber-700 border-amber-200" };
  return { text: `D-${d}`, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-[var(--color-gray)] cursor-pointer transition-all"
      title="복사"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ClientDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [accountCopied, setAccountCopied] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/client-auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("데이터를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/client-auth/logout", { method: "POST" });
    router.push("/client");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          </div>
          <p className="text-[var(--color-gray)] text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500 mb-2 font-medium">{error || "오류가 발생했습니다."}</p>
          <p className="text-[var(--color-gray)] text-sm mb-6">세션이 만료되었거나 연결에 문제가 있습니다.</p>
          <button
            onClick={() => router.push("/client")}
            className="px-6 py-2.5 bg-[var(--color-dark)] text-white rounded-xl text-sm font-semibold cursor-pointer border-none hover:bg-[var(--color-dark-2)] transition-colors"
          >
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  // Compute alerts
  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  data.hosting.forEach((h) => {
    const renewal = getNextRenewalDate(h.end_date, h.billing_cycle);
    const d = renewal ? daysUntil(renewal) : null;
    if (isExpired(h.end_date) && !h.auto_renew) alerts.push({ type: "danger", message: `호스팅 "${h.provider}" 만료됨` });
    else if (d !== null && d >= 0 && d <= 30) {
      alerts.push({ type: "warning", message: `호스팅 "${h.provider}" ${d}일 후 갱신 예정` });
    }
  });
  data.domains.forEach((d) => {
    if (isExpired(d.expires_date)) alerts.push({ type: "danger", message: `도메인 "${d.domain_name}" 만료됨` });
    else if (isExpiringSoon(d.expires_date)) {
      const days = daysUntil(d.expires_date);
      alerts.push({ type: "warning", message: `도메인 "${d.domain_name}" ${days}일 후 만료` });
    }
  });
  data.payments.forEach((p) => {
    if (p.status === "overdue") alerts.push({ type: "danger", message: `미납 결제: ${p.description || p.type} (${formatAmount(p.amount)})` });
  });

  const totalPaid = data.payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = data.payments.filter((p) => p.status === "pending" || p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);
  const activeProjects = data.projects.filter((p) => p.status === "진행중" || p.status === "상담중").length;
  const hostingPayments = data.payments.filter((p) => p.type === "호스팅");

  const tabConfig: { key: TabKey; label: string; icon: string }[] = [
    { key: "overview", label: "개요", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
    { key: "projects", label: "프로젝트", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { key: "payments", label: "결제 내역", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
    { key: "settings", label: "설정", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  // =========================================================================
  // Tab renderers
  // =========================================================================

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">프로젝트</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.projects.length}</p>
          {activeProjects > 0 && <p className="text-xs text-blue-600 mt-1 font-medium">{activeProjects}건 진행중</p>}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">호스팅</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.hosting.length}</p>
          {data.hosting.some((h) => { const r = getNextRenewalDate(h.end_date, h.billing_cycle); return r && daysUntil(r)! <= 30; }) && (
            <p className="text-xs text-amber-600 mt-1 font-medium">갱신 임박</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">도메인</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.domains.length}</p>
          {data.domains.some((d) => isExpiringSoon(d.expires_date)) && <p className="text-xs text-amber-600 mt-1 font-medium">만료 임박</p>}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">총 결제액</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{formatAmount(totalPaid)}</p>
          {totalPending > 0 && <p className="text-xs text-amber-600 mt-1 font-medium">{formatAmount(totalPending)} 미결제</p>}
        </div>
      </div>

      {/* Active projects */}
      {data.projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
              프로젝트
            </h3>
            {data.projects.length > 2 && (
              <button onClick={() => setActiveTab("projects")} className="text-[var(--color-accent)] text-sm font-medium cursor-pointer bg-transparent border-none hover:underline">
                전체 보기
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.slice(0, 2).map((p) => {
              const sc = STATUS_COLORS[p.status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
              return (
                <Link key={p.id} href={`/client/dashboard/projects/${p.id}`} className="no-underline block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[var(--color-dark)] truncate">{p.name}</h4>
                      {p.website_url && <p className="text-[var(--color-accent)] text-sm truncate mt-0.5">{p.website_url}</p>}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ml-3 ${sc.bg} ${sc.text} ${sc.border}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tech_stack.split(",").map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-[var(--color-gray)]">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Unpaid payment banner */}
      {totalPending > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-900">미결제 {formatAmount(totalPending)}</p>
              <p className="text-xs text-blue-600">우리은행 1002-163-026503 (심현수)</p>
            </div>
          </div>
          <button onClick={() => setActiveTab("payments")} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg border-none cursor-pointer hover:bg-blue-700 transition-colors shrink-0">
            상세 보기
          </button>
        </div>
      )}

      {/* Recent payments */}
      {data.payments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              최근 결제
            </h3>
            {data.payments.length > 3 && (
              <button onClick={() => setActiveTab("payments")} className="text-[var(--color-accent)] text-sm font-medium cursor-pointer bg-transparent border-none hover:underline">
                전체 보기
              </button>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {data.payments.slice(0, 3).map((p, i) => {
              const st = PAYMENT_STATUS[p.status] || { label: p.status, bg: "bg-gray-50", text: "text-gray-600", border: "" };
              return (
                <div key={p.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-lg ${st.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${st.text}`}>{st.label}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-dark)] truncate">{p.description || p.type}</p>
                      <p className="text-xs text-[var(--color-gray)]">{formatShortDate(p.payment_date)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-dark)] shrink-0 ml-3">{formatAmount(p.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hosting & Domain with renewal dates */}
      {(data.hosting.length > 0 || data.domains.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.hosting.length > 0 && (
            <div>
              <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
                </svg>
                호스팅
              </h3>
              <div className="space-y-3">
                {data.hosting.map((h) => {
                  const renewalDate = getNextRenewalDate(h.end_date, h.billing_cycle);
                  const renewalDays = renewalDate ? daysUntil(renewalDate) : null;
                  const badge = renewalDays !== null ? getRenewalBadge(renewalDays) : null;
                  return (
                    <div key={h.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-dark)] text-sm">{h.provider}</span>
                        <div className="flex items-center gap-1.5">
                          {h.auto_renew && <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                          {badge && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>{badge.text}</span>}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--color-gray)] space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{h.plan || "-"} · {formatAmount(h.amount)}/{h.billing_cycle === "monthly" ? "월" : "연"}</span>
                        </div>
                        {renewalDate && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
                            <span className="font-medium text-[var(--color-dark-2)]">다음 갱신: {formatDate(renewalDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.domains.length > 0 && (
            <div>
              <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                </svg>
                도메인
              </h3>
              <div className="space-y-3">
                {data.domains.map((d) => {
                  const days = daysUntil(d.expires_date);
                  const expired = isExpired(d.expires_date);
                  const badge = days !== null ? getRenewalBadge(days) : null;
                  return (
                    <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-dark)] text-sm">{d.domain_name}</span>
                        <div className="flex items-center gap-1.5">
                          {d.auto_renew && <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                          {badge && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>{badge.text}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--color-gray)]">
                        <span>{d.registrar || "-"}</span>
                        {d.expires_date && (
                          <span className={expired ? "text-red-600 font-medium" : ""}>
                            만료: {formatShortDate(d.expires_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderProjects = () => {
    const getProjectHostings = (projectId: string) => data.hosting.filter((h) => h.project_id === projectId);
    const getProjectDomains = (projectId: string) => data.domains.filter((d) => d.project_id === projectId);

    return (
      <div className="space-y-5">
        {data.projects.length === 0 ? (
          <EmptyState icon="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" message="등록된 프로젝트가 없습니다." />
        ) : (
          data.projects.map((p) => {
            const sc = STATUS_COLORS[p.status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
            const projectHostings = getProjectHostings(p.id);
            const projectDomains = getProjectDomains(p.id);

            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Link href={`/client/dashboard/projects/${p.id}`} className="no-underline block mb-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-lg text-[var(--color-dark)]">{p.name}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {p.status}
                        </span>
                        {p.platform && (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                            {p.platform}
                          </span>
                        )}
                      </div>
                      {p.website_url && (
                        <p className="text-[var(--color-accent)] text-sm break-all inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          {p.website_url}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-300 shrink-0 ml-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>

                {p.tech_stack && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech_stack.split(",").map((t, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-medium">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {p.admin_url && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 페이지</span>
                      <a href={p.admin_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline truncate block text-sm">
                        {p.admin_url}
                      </a>
                    </div>
                  )}
                  {p.admin_id && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 아이디</span>
                      <div className="flex items-center">
                        <span className="text-[var(--color-dark)] text-sm font-medium">{p.admin_id}</span>
                        <CopyButton text={p.admin_id} />
                      </div>
                    </div>
                  )}
                  {p.admin_pw && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 비밀번호</span>
                      <div className="flex items-center">
                        <span className="text-[var(--color-dark)] text-sm font-medium">{p.admin_pw}</span>
                        <CopyButton text={p.admin_pw} />
                      </div>
                    </div>
                  )}
                  {p.started_at && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-[var(--color-gray)] text-xs block mb-1">시작일</span>
                      <span className="text-[var(--color-dark)] text-sm">{formatDate(p.started_at)}</span>
                    </div>
                  )}
                  {p.completed_at && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-[var(--color-gray)] text-xs block mb-1">완료일</span>
                      <span className="text-[var(--color-dark)] text-sm">{formatDate(p.completed_at)}</span>
                    </div>
                  )}
                </div>

                {p.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-[var(--color-gray)] leading-relaxed">{p.description}</p>
                  </div>
                )}

                {/* Hosting inline with renewal dates */}
                {projectHostings.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-[var(--color-dark)] flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
                      </svg>
                      호스팅
                    </h4>
                    <div className="space-y-2">
                      {projectHostings.map((h) => {
                        const renewalDate = getNextRenewalDate(h.end_date, h.billing_cycle);
                        const renewalDays = renewalDate ? daysUntil(renewalDate) : null;
                        const badge = renewalDays !== null ? getRenewalBadge(renewalDays) : null;
                        const expired = isExpired(h.end_date) && !h.auto_renew;
                        return (
                          <div key={h.id} className={`border rounded-xl p-3.5 ${expired ? "border-red-200 bg-red-50/30" : badge && renewalDays! <= 30 ? "border-amber-200 bg-amber-50/30" : "border-gray-200 bg-gray-50/50"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[var(--color-dark)] text-sm">{h.provider}</span>
                                {h.plan && <span className="text-[var(--color-gray)] text-xs">· {h.plan}</span>}
                              </div>
                              <div className="flex items-center gap-1.5">
                                {h.auto_renew && <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                                {badge && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>{badge.text}</span>}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-gray)]">
                              <span className="font-medium text-[var(--color-dark)]">{formatAmount(h.amount)}/{h.billing_cycle === "monthly" ? "월" : "연"}</span>
                              <span>시작: {formatShortDate(h.start_date)}</span>
                              {h.end_date && <span>만료: {formatShortDate(h.end_date)}</span>}
                            </div>
                            {renewalDate && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
                                <span className="text-xs font-medium text-[var(--color-dark-2)]">다음 갱신: {formatDate(renewalDate)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Domains inline */}
                {projectDomains.length > 0 && (
                  <div className={`mt-4 ${projectHostings.length === 0 ? "pt-4 border-t border-gray-100" : "pt-3"}`}>
                    <h4 className="text-sm font-bold text-[var(--color-dark)] flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                      </svg>
                      도메인
                    </h4>
                    <div className="space-y-2">
                      {projectDomains.map((d) => {
                        const days = daysUntil(d.expires_date);
                        const expired = isExpired(d.expires_date);
                        const badge = days !== null ? getRenewalBadge(days) : null;
                        return (
                          <div key={d.id} className={`border rounded-xl p-3.5 ${expired ? "border-red-200 bg-red-50/30" : days !== null && days <= 30 ? "border-amber-200 bg-amber-50/30" : "border-gray-200 bg-gray-50/50"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[var(--color-dark)] text-sm">{d.domain_name}</span>
                                {d.registrar && <span className="text-[var(--color-gray)] text-xs">· {d.registrar}</span>}
                              </div>
                              <div className="flex items-center gap-1.5">
                                {d.auto_renew && <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                                {badge && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>{badge.text}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[var(--color-gray)]">
                              {d.registered_date && <span>등록: {formatShortDate(d.registered_date)}</span>}
                              {d.expires_date && <span className={expired ? "text-red-600 font-medium" : ""}>만료: {formatShortDate(d.expires_date)}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const copyAccount = () => {
    navigator.clipboard.writeText("1002163026503");
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleConfirmPayment = async (paymentId: string) => {
    setConfirmingId(paymentId);
    try {
      const res = await fetch("/api/client-auth/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (res.ok) {
        setData((prev) => prev ? {
          ...prev,
          payments: prev.payments.map((p) => p.id === paymentId ? { ...p, status: "confirming" } : p),
        } : prev);
      }
    } catch { /* ignore */ }
    finally { setConfirmingId(null); }
  };

  const renderPayments = () => {
    const paid = data.payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const pending = data.payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
    const overdue = data.payments.filter((p) => p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);
    const confirming = data.payments.filter((p) => p.status === "confirming").reduce((s, p) => s + Number(p.amount), 0);
    const unpaid = pending + overdue;

    const sorted = [...data.payments].sort((a, b) => {
      const order: Record<string, number> = { overdue: 0, pending: 1, confirming: 2, paid: 3 };
      const diff = (order[a.status] ?? 9) - (order[b.status] ?? 9);
      if (diff !== 0) return diff;
      return (b.payment_date || "").localeCompare(a.payment_date || "");
    });

    return (
      <div className="space-y-5">
        {/* Bank account card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-gray)] mb-1">입금 계좌</p>
              <p className="text-sm font-bold text-[var(--color-dark)]">우리은행 1002-163-026503</p>
              <p className="text-xs text-[var(--color-gray)] mt-0.5">예금주: 심현수</p>
            </div>
            <button
              onClick={copyAccount}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all shrink-0 ${
                accountCopied
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-[var(--color-primary)] text-white border-transparent hover:opacity-90"
              }`}
            >
              {accountCopied ? "복사 완료" : "계좌 복사"}
            </button>
          </div>
          {unpaid > 0 && (
            <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
              <p className="text-xs font-medium text-red-700">미결제 금액 {formatAmount(unpaid)}</p>
            </div>
          )}
          {unpaid === 0 && confirming === 0 && data.payments.length > 0 && (
            <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-xs font-medium text-emerald-700">모든 결제가 완료되었습니다</p>
            </div>
          )}
        </div>

        {data.payments.length === 0 ? (
          <EmptyState icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75" message="등록된 결제 내역이 없습니다." />
        ) : (
          <>
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "완료", amount: paid, color: "emerald", active: paid > 0 },
                { label: "확인 중", amount: confirming, color: "blue", active: confirming > 0 },
                { label: "미결제", amount: unpaid, color: "red", active: unpaid > 0 },
              ].map(({ label, amount, color, active }) => (
                <div key={label} className={`rounded-xl p-3 text-center border ${active ? `bg-${color}-50 border-${color}-200` : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-xs font-medium mb-0.5 ${active ? `text-${color}-600` : "text-[var(--color-gray)]"}`}>{label}</p>
                  <p className={`font-bold text-sm sm:text-base ${active ? `text-${color}-700` : "text-[var(--color-gray)]"}`}>{formatAmount(amount)}</p>
                </div>
              ))}
            </div>

            {/* Payment list */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {sorted.map((p) => {
                const st = PAYMENT_STATUS[p.status] || { label: p.status, bg: "bg-gray-50", text: "text-gray-600", border: "" };
                const isUnpaid = p.status === "pending" || p.status === "overdue";
                const isConfirming = p.status === "confirming";
                return (
                  <div key={p.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[var(--color-dark)]">{p.type}</span>
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray)]">
                          <span>{formatShortDate(p.payment_date)}</span>
                          {p.description && <><span className="text-gray-300">|</span><span className="truncate">{p.description}</span></>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-sm font-bold ${p.status === "overdue" ? "text-red-600" : p.status === "pending" ? "text-amber-600" : p.status === "confirming" ? "text-blue-600" : "text-[var(--color-dark)]"}`}>
                          {formatAmount(p.amount)}
                        </span>
                        {isUnpaid && (
                          <button
                            onClick={() => handleConfirmPayment(p.id)}
                            disabled={confirmingId === p.id}
                            className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {confirmingId === p.id ? "처리 중" : "입금 완료"}
                          </button>
                        )}
                        {isConfirming && (
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
                            확인 중
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSettings = () => <SettingsTab username={data.client.username} />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "projects": return renderProjects();
      case "payments": return renderPayments();
      case "settings": return renderSettings();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/client/dashboard" className="no-underline">
              <h1 className="text-lg font-extrabold text-[var(--color-dark)]">
                HS <span className="gradient-text">WEB</span>
              </h1>
            </Link>
            <div className="hidden sm:block w-px h-5 bg-gray-200" />
            <span className="hidden sm:block text-[var(--color-gray)] text-sm">고객 포털</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {data.client.name.charAt(0)}
              </div>
              <span className="text-sm text-[var(--color-dark)] font-medium">{data.client.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 text-[var(--color-gray)] text-sm rounded-xl cursor-pointer hover:bg-gray-100 transition-all font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-dark)] mb-1">
            안녕하세요, {data.client.name}님
          </h2>
          <p className="text-[var(--color-gray)] text-sm">
            홈페이지 관리 현황을 확인하세요.
          </p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2 mb-6">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                  alert.type === "danger"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="font-medium">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[var(--color-accent)] text-[var(--color-dark)]"
                  : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)] hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {renderActiveTab()}

        {/* Footer */}
        <div className="mt-12 pb-8 text-center">
          <p className="text-[var(--color-gray-light)] text-xs">
            문의사항이 있으시면 관리자에게 연락해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

function SettingsTab({ username }: { username: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: "error", text: "현재 비밀번호를 입력해주세요." });
      return;
    }

    const usernameChanged = newUsername.trim() !== username;
    const passwordChanged = newPassword.length > 0;

    if (!usernameChanged && !passwordChanged) {
      setMessage({ type: "error", text: "변경할 항목이 없습니다." });
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    if (passwordChanged && newPassword.length < 4) {
      setMessage({ type: "error", text: "비밀번호는 4자 이상이어야 합니다." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/client-auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          ...(usernameChanged && { newUsername: newUsername.trim() }),
          ...(passwordChanged && { newPassword }),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: result.error || "수정에 실패했습니다." });
      } else {
        setMessage({ type: "success", text: result.message || "정보가 수정되었습니다." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] bg-gray-50 focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 focus:bg-white transition-all placeholder:text-gray-400";
  const labelClass = "block text-xs font-medium text-[var(--color-gray)] mb-1.5 uppercase tracking-wide";

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1">
      {show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )}
    </button>
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[var(--color-dark)] font-bold">@{username}</p>
            <p className="text-[var(--color-gray)] text-xs mt-0.5">계정 정보를 관리할 수 있습니다</p>
          </div>
        </div>
      </div>

      {/* Settings form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {message.type === "success"
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* Current password - verification */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h4 className="text-sm font-semibold text-[var(--color-dark)]">본인 확인</h4>
          </div>
          <div>
            <label className={labelClass}>현재 비밀번호</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                className={`${inputClass} pr-10`}
              />
              <EyeToggle show={showCurrentPw} onToggle={() => setShowCurrentPw(!showCurrentPw)} />
            </div>
          </div>
        </div>

        {/* Change fields */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <h4 className="text-sm font-semibold text-[var(--color-dark)]">변경 정보</h4>
            <span className="text-[var(--color-gray)] text-xs ml-auto">변경할 항목만 수정</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>아이디</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="새 아이디 (3자 이상)"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>새 비밀번호</label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="4자 이상"
                    className={`${inputClass} pr-10`}
                  />
                  <EyeToggle show={showNewPw} onToggle={() => setShowNewPw(!showNewPw)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="다시 입력"
                  disabled={!newPassword}
                  className={`${inputClass} ${
                    confirmPassword && confirmPassword !== newPassword ? "!border-red-300" : ""
                  } disabled:opacity-40`}
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-red-500 text-xs mt-1">불일치</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "저장 중..." : "변경사항 저장"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state helper
// ---------------------------------------------------------------------------

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-[var(--color-gray)] text-sm">{message}</p>
    </div>
  );
}
