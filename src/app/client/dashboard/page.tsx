"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}

interface Hosting {
  id: string;
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

type TabKey = "overview" | "projects" | "hosting" | "domains" | "payments";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "상담중": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "진행중": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "완료": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "유지보수": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

const PAYMENT_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  paid: { label: "완료", bg: "bg-emerald-50", text: "text-emerald-700" },
  pending: { label: "대기", bg: "bg-amber-50", text: "text-amber-700" },
  overdue: { label: "미납", bg: "bg-red-50", text: "text-red-700" },
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
      className="ml-1.5 px-1.5 py-0.5 text-[0.65rem] bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-[var(--color-gray)] cursor-pointer transition-all"
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
    if (isExpired(h.end_date)) alerts.push({ type: "danger", message: `호스팅 "${h.provider}" 만료됨` });
    else if (isExpiringSoon(h.end_date)) {
      const d = daysUntil(h.end_date);
      alerts.push({ type: "warning", message: `호스팅 "${h.provider}" ${d}일 후 만료` });
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

  const tabConfig: { key: TabKey; label: string; icon: string }[] = [
    { key: "overview", label: "개요", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
    { key: "projects", label: "프로젝트", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { key: "hosting", label: "호스팅", icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" },
    { key: "domains", label: "도메인", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" },
    { key: "payments", label: "결제 내역", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
  ];

  // =========================================================================
  // Tab renderers
  // =========================================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">프로젝트</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.projects.length}</p>
          {activeProjects > 0 && <p className="text-[0.75rem] text-blue-600 mt-1">{activeProjects}건 진행중</p>}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">호스팅</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.hosting.length}</p>
          {data.hosting.some((h) => isExpiringSoon(h.end_date)) && <p className="text-[0.75rem] text-orange-500 mt-1">만료 임박 있음</p>}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">도메인</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{data.domains.length}</p>
          {data.domains.some((d) => isExpiringSoon(d.expires_date)) && <p className="text-[0.75rem] text-orange-500 mt-1">만료 임박 있음</p>}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[var(--color-gray)] text-xs font-medium">총 결제액</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">{formatAmount(totalPaid)}</p>
          {totalPending > 0 && <p className="text-[0.75rem] text-amber-600 mt-1">{formatAmount(totalPending)} 미결제</p>}
        </div>
      </div>

      {/* Active projects */}
      {data.projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2">
              <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[var(--color-dark)] truncate">{p.name}</h4>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] text-sm hover:underline truncate block mt-0.5">
                          {p.website_url}
                        </a>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-[0.7rem] font-semibold rounded-full border shrink-0 ml-3 ${sc.bg} ${sc.text} ${sc.border}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tech_stack.split(",").map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[0.7rem] text-[var(--color-gray)]">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent payments */}
      {data.payments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2">
              <svg className="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {data.payments.slice(0, 3).map((p, i) => {
              const st = PAYMENT_STATUS[p.status] || { label: p.status, bg: "bg-gray-50", text: "text-gray-600" };
              return (
                <div key={p.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-lg ${st.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-[0.7rem] font-bold ${st.text}`}>{st.label}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-dark)] truncate">{p.description || p.type}</p>
                      <p className="text-[0.75rem] text-[var(--color-gray)]">{formatShortDate(p.payment_date)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-dark)] shrink-0 ml-3">{formatAmount(p.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hosting & Domain expiry overview */}
      {(data.hosting.length > 0 || data.domains.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.hosting.length > 0 && (
            <div>
              <h3 className="text-[var(--color-dark)] font-bold flex items-center gap-2 mb-4">
                <svg className="w-4.5 h-4.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
                </svg>
                호스팅
              </h3>
              <div className="space-y-3">
                {data.hosting.map((h) => {
                  const days = daysUntil(h.end_date);
                  const expired = isExpired(h.end_date);
                  const soon = isExpiringSoon(h.end_date);
                  return (
                    <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-dark)] text-sm">{h.provider}</span>
                        <div className="flex items-center gap-2">
                          {h.auto_renew && <span className="px-2 py-0.5 text-[0.65rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[0.8rem]">
                        <span className="text-[var(--color-gray)]">{h.plan || "-"} · {formatAmount(h.amount)}/{h.billing_cycle === "monthly" ? "월" : "연"}</span>
                        {h.end_date && (
                          <span className={`font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-gray)]"}`}>
                            {expired ? "만료됨" : days !== null ? `${days}일 남음` : ""}
                          </span>
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
                <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                </svg>
                도메인
              </h3>
              <div className="space-y-3">
                {data.domains.map((d) => {
                  const days = daysUntil(d.expires_date);
                  const expired = isExpired(d.expires_date);
                  const soon = isExpiringSoon(d.expires_date);
                  return (
                    <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-dark)] text-sm">{d.domain_name}</span>
                        {d.auto_renew && <span className="px-2 py-0.5 text-[0.65rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">자동갱신</span>}
                      </div>
                      <div className="flex items-center justify-between text-[0.8rem]">
                        <span className="text-[var(--color-gray)]">{d.registrar || "-"}</span>
                        {d.expires_date && (
                          <span className={`font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-gray)]"}`}>
                            {expired ? "만료됨" : days !== null ? `${days}일 남음` : ""}
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

  const renderProjects = () => (
    <div className="space-y-4">
      {data.projects.length === 0 ? (
        <EmptyState icon="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" message="등록된 프로젝트가 없습니다." />
      ) : (
        data.projects.map((p) => {
          const sc = STATUS_COLORS[p.status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
          return (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-lg text-[var(--color-dark)]">{p.name}</h3>
                    <span className={`px-3 py-1 text-[0.75rem] font-semibold rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] text-sm hover:underline break-all inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {p.website_url}
                    </a>
                  )}
                </div>
              </div>

              {p.tech_stack && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech_stack.split(",").map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[0.75rem] text-blue-700 font-medium">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {p.admin_url && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 페이지</span>
                    <a href={p.admin_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline truncate block text-[0.85rem]">
                      {p.admin_url}
                    </a>
                  </div>
                )}
                {p.admin_id && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 아이디</span>
                    <div className="flex items-center">
                      <span className="text-[var(--color-dark)] text-[0.85rem] font-medium">{p.admin_id}</span>
                      <CopyButton text={p.admin_id} />
                    </div>
                  </div>
                )}
                {p.admin_pw && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">관리자 비밀번호</span>
                    <div className="flex items-center">
                      <span className="text-[var(--color-dark)] text-[0.85rem] font-medium">{p.admin_pw}</span>
                      <CopyButton text={p.admin_pw} />
                    </div>
                  </div>
                )}
                {p.started_at && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">시작일</span>
                    <span className="text-[var(--color-dark)] text-[0.85rem]">{formatDate(p.started_at)}</span>
                  </div>
                )}
                {p.completed_at && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">완료일</span>
                    <span className="text-[var(--color-dark)] text-[0.85rem]">{formatDate(p.completed_at)}</span>
                  </div>
                )}
              </div>

              {p.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed">{p.description}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderHosting = () => (
    <div className="space-y-4">
      {data.hosting.length === 0 ? (
        <EmptyState icon="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" message="등록된 호스팅 정보가 없습니다." />
      ) : (
        data.hosting.map((h) => {
          const days = daysUntil(h.end_date);
          const expired = isExpired(h.end_date);
          const soon = isExpiringSoon(h.end_date);
          return (
            <div key={h.id} className={`bg-white border rounded-2xl p-6 shadow-sm ${expired ? "border-red-200" : soon ? "border-orange-200" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-dark)]">{h.provider}</h3>
                  {h.plan && <p className="text-[var(--color-gray)] text-sm mt-0.5">{h.plan}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {h.auto_renew && (
                    <span className="px-2.5 py-1 text-[0.7rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-semibold">자동갱신</span>
                  )}
                  {expired && <span className="px-2.5 py-1 text-[0.7rem] bg-red-50 text-red-600 rounded-full border border-red-200 font-semibold">만료됨</span>}
                  {!expired && soon && <span className="px-2.5 py-1 text-[0.7rem] bg-orange-50 text-orange-600 rounded-full border border-orange-200 font-semibold">만료 임박</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-[var(--color-gray)] text-xs block mb-1">금액</span>
                  <span className="text-[var(--color-dark)] font-bold text-sm">{formatAmount(h.amount)}</span>
                  <span className="text-[var(--color-gray)] text-xs ml-1">/ {h.billing_cycle === "monthly" ? "월" : "연"}</span>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-[var(--color-gray)] text-xs block mb-1">시작일</span>
                  <span className="text-[var(--color-dark)] text-sm">{formatDate(h.start_date)}</span>
                </div>
                {h.end_date && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">만료일</span>
                    <span className={`text-sm font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>
                      {formatDate(h.end_date)}
                    </span>
                  </div>
                )}
                {days !== null && !expired && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">남은 기간</span>
                    <span className={`text-sm font-bold ${soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>{days}일</span>
                  </div>
                )}
              </div>

              {h.memo && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-[var(--color-gray)]">{h.memo}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderDomains = () => (
    <div className="space-y-4">
      {data.domains.length === 0 ? (
        <EmptyState icon="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" message="등록된 도메인 정보가 없습니다." />
      ) : (
        data.domains.map((d) => {
          const days = daysUntil(d.expires_date);
          const expired = isExpired(d.expires_date);
          const soon = isExpiringSoon(d.expires_date);
          return (
            <div key={d.id} className={`bg-white border rounded-2xl p-6 shadow-sm ${expired ? "border-red-200" : soon ? "border-orange-200" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-dark)]">{d.domain_name}</h3>
                  {d.registrar && <p className="text-[var(--color-gray)] text-sm mt-0.5">{d.registrar}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {d.auto_renew && <span className="px-2.5 py-1 text-[0.7rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-semibold">자동갱신</span>}
                  {expired && <span className="px-2.5 py-1 text-[0.7rem] bg-red-50 text-red-600 rounded-full border border-red-200 font-semibold">만료됨</span>}
                  {!expired && soon && <span className="px-2.5 py-1 text-[0.7rem] bg-orange-50 text-orange-600 rounded-full border border-orange-200 font-semibold">만료 임박</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {d.registered_date && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">등록일</span>
                    <span className="text-[var(--color-dark)] text-sm">{formatDate(d.registered_date)}</span>
                  </div>
                )}
                {d.expires_date && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">만료일</span>
                    <span className={`text-sm font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>
                      {formatDate(d.expires_date)}
                    </span>
                  </div>
                )}
                {days !== null && !expired && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">남은 기간</span>
                    <span className={`text-sm font-bold ${soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>{days}일</span>
                  </div>
                )}
                {d.nameservers && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 sm:col-span-2 lg:col-span-1">
                    <span className="text-[var(--color-gray)] text-xs block mb-1">네임서버</span>
                    <span className="text-[var(--color-dark)] text-sm break-all">{d.nameservers}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderPayments = () => {
    const paid = data.payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const pending = data.payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
    const overdue = data.payments.filter((p) => p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);

    return (
      <div className="space-y-5">
        {data.payments.length === 0 ? (
          <EmptyState icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75" message="등록된 결제 내역이 없습니다." />
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-emerald-600 text-[0.7rem] font-semibold mb-1">결제 완료</p>
                <p className="text-emerald-700 font-bold text-lg">{formatAmount(paid)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-amber-600 text-[0.7rem] font-semibold mb-1">대기</p>
                <p className="text-amber-700 font-bold text-lg">{formatAmount(pending)}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-500 text-[0.7rem] font-semibold mb-1">미납</p>
                <p className="text-red-700 font-bold text-lg">{formatAmount(overdue)}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-[var(--color-gray)] font-medium text-[0.8rem]">날짜</th>
                      <th className="text-left px-5 py-3.5 text-[var(--color-gray)] font-medium text-[0.8rem]">구분</th>
                      <th className="text-left px-5 py-3.5 text-[var(--color-gray)] font-medium text-[0.8rem]">내용</th>
                      <th className="text-right px-5 py-3.5 text-[var(--color-gray)] font-medium text-[0.8rem]">금액</th>
                      <th className="text-center px-5 py-3.5 text-[var(--color-gray)] font-medium text-[0.8rem]">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((p) => {
                      const st = PAYMENT_STATUS[p.status] || { label: p.status, bg: "bg-gray-50", text: "text-gray-600" };
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-[var(--color-dark-2)] whitespace-nowrap">{formatDate(p.payment_date)}</td>
                          <td className="px-5 py-4 text-[var(--color-dark-2)]">{p.type}</td>
                          <td className="px-5 py-4 text-[var(--color-gray)]">{p.description || "-"}</td>
                          <td className="px-5 py-4 text-right font-bold text-[var(--color-dark)]">{formatAmount(p.amount)}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-3 py-1 text-[0.7rem] font-semibold rounded-full ${st.bg} ${st.text}`}>
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "projects": return renderProjects();
      case "hosting": return renderHosting();
      case "domains": return renderDomains();
      case "payments": return renderPayments();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-sm shadow-gray-100/50">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-[var(--color-dark)]">
              HS <span className="gradient-text">WEB</span>
            </h1>
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
        {/* Welcome & Alerts */}
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
                <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="font-medium">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent whitespace-nowrap ${
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
