"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "상담중": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "진행중": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "완료": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "유지보수": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

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
      className="ml-2 px-2 py-1 text-[0.7rem] bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-[var(--color-gray)] cursor-pointer transition-all font-medium"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ClientProjectDetailPage() {
  const params = useParams();
  const pid = params.pid as string;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/client-auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then((data) => {
        setClientName(data.client.name);
        const found = data.projects.find((p: Project) => p.id === pid);
        if (found) {
          setProject(found);
          setHostings((data.hosting || []).filter((h: Hosting) => h.project_id === pid));
          setDomains((data.domains || []).filter((d: Domain) => d.project_id === pid));
        } else {
          setError("프로젝트를 찾을 수 없습니다.");
        }
      })
      .catch(() => setError("데이터를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [pid]);

  const handleLogout = async () => {
    await fetch("/api/client-auth/logout", { method: "POST" });
    router.push("/client");
  };

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[var(--color-light)]">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-sm shadow-gray-100/50">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <Link href="/client/dashboard" className="flex items-center gap-3 no-underline">
              <h1 className="text-lg font-extrabold text-[var(--color-dark)]">
                HS <span className="gradient-text">WEB</span>
              </h1>
            </Link>
          </div>
        </header>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-red-500 mb-4">{error || "프로젝트를 찾을 수 없습니다."}</p>
          <Link href="/client/dashboard" className="text-[var(--color-accent)] font-semibold no-underline hover:underline">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[project.status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-sm shadow-gray-100/50">
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
                {clientName.charAt(0)}
              </div>
              <span className="text-sm text-[var(--color-dark)] font-medium">{clientName}</span>
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
        {/* Back link */}
        <Link
          href="/client/dashboard"
          className="text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors flex items-center gap-1.5 text-sm mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          대시보드로 돌아가기
        </Link>

        {/* Project header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-dark)]">{project.name}</h2>
                <span className={`px-3 py-1 text-[0.75rem] font-semibold rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {project.status}
                </span>
                {project.platform && (
                  <span className="px-3 py-1 text-[0.75rem] font-medium rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                    {project.platform}
                  </span>
                )}
              </div>
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1.5 text-sm"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {project.website_url}
                </a>
              )}
            </div>
          </div>

          {project.description && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[var(--color-gray)] text-sm leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {project.tech_stack && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sm:col-span-2 lg:col-span-3">
              <h3 className="text-[var(--color-gray)] text-xs font-medium mb-3">기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.split(",").map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[0.8rem] text-blue-700 font-medium">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.unit_price != null && project.unit_price > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[var(--color-gray)] text-xs font-medium mb-2">작업 단가</h3>
              <p className="text-[var(--color-dark)] font-semibold">{Number(project.unit_price).toLocaleString()}원</p>
            </div>
          )}

          {project.started_at && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[var(--color-gray)] text-xs font-medium mb-2">시작일</h3>
              <p className="text-[var(--color-dark)] font-semibold">{formatDate(project.started_at)}</p>
            </div>
          )}

          {project.completed_at && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[var(--color-gray)] text-xs font-medium mb-2">완료일</h3>
              <p className="text-[var(--color-dark)] font-semibold">{formatDate(project.completed_at)}</p>
            </div>
          )}

          {project.started_at && project.completed_at && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[var(--color-gray)] text-xs font-medium mb-2">소요 기간</h3>
              <p className="text-[var(--color-dark)] font-semibold">
                {Math.ceil((new Date(project.completed_at).getTime() - new Date(project.started_at).getTime()) / (1000 * 60 * 60 * 24))}일
              </p>
            </div>
          )}
        </div>

        {/* Admin access */}
        {(project.admin_url || project.admin_id || project.admin_pw) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[var(--color-dark)] font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              관리자 접속 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.admin_url && (
                <div className="bg-gray-50 rounded-xl px-5 py-4">
                  <span className="text-[var(--color-gray)] text-xs block mb-1.5">관리자 페이지</span>
                  <a
                    href={project.admin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] hover:underline text-sm break-all inline-flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    {project.admin_url}
                  </a>
                </div>
              )}
              {project.admin_id && (
                <div className="bg-gray-50 rounded-xl px-5 py-4">
                  <span className="text-[var(--color-gray)] text-xs block mb-1.5">아이디</span>
                  <div className="flex items-center">
                    <span className="text-[var(--color-dark)] font-medium text-sm">{project.admin_id}</span>
                    <CopyButton text={project.admin_id} />
                  </div>
                </div>
              )}
              {project.admin_pw && (
                <div className="bg-gray-50 rounded-xl px-5 py-4">
                  <span className="text-[var(--color-gray)] text-xs block mb-1.5">비밀번호</span>
                  <div className="flex items-center">
                    <span className="text-[var(--color-dark)] font-medium text-sm">{project.admin_pw}</span>
                    <CopyButton text={project.admin_pw} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hosting */}
        {hostings.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="text-[var(--color-dark)] font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
              </svg>
              호스팅
            </h3>
            <div className="space-y-3">
              {hostings.map((h) => {
                const days = daysUntil(h.end_date);
                const expired = isExpired(h.end_date);
                const soon = isExpiringSoon(h.end_date);
                return (
                  <div key={h.id} className={`border rounded-xl p-4 ${expired ? "border-red-200 bg-red-50/30" : soon ? "border-orange-200 bg-orange-50/30" : "border-gray-100 bg-gray-50/50"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-[var(--color-dark)]">{h.provider}</span>
                        {h.plan && <span className="text-[var(--color-gray)] text-sm ml-2">· {h.plan}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {h.auto_renew && <span className="px-2.5 py-1 text-[0.7rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-semibold">자동갱신</span>}
                        {expired && <span className="px-2.5 py-1 text-[0.7rem] bg-red-50 text-red-600 rounded-full border border-red-200 font-semibold">만료됨</span>}
                        {!expired && soon && <span className="px-2.5 py-1 text-[0.7rem] bg-orange-50 text-orange-600 rounded-full border border-orange-200 font-semibold">만료 임박</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-[var(--color-gray)] text-xs block mb-0.5">금액</span>
                        <span className="text-[var(--color-dark)] font-bold text-sm">{formatAmount(h.amount)}</span>
                        <span className="text-[var(--color-gray)] text-xs ml-0.5">/ {h.billing_cycle === "monthly" ? "월" : "연"}</span>
                      </div>
                      <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-[var(--color-gray)] text-xs block mb-0.5">시작일</span>
                        <span className="text-[var(--color-dark)] text-sm">{formatShortDate(h.start_date)}</span>
                      </div>
                      {h.end_date && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">만료일</span>
                          <span className={`text-sm font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>
                            {formatShortDate(h.end_date)}
                          </span>
                        </div>
                      )}
                      {days !== null && !expired && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">남은 기간</span>
                          <span className={`text-sm font-bold ${soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>{days}일</span>
                        </div>
                      )}
                    </div>
                    {h.memo && (
                      <p className="mt-3 text-sm text-[var(--color-gray)] pt-3 border-t border-gray-100">{h.memo}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Domains */}
        {domains.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="text-[var(--color-dark)] font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
              </svg>
              도메인
            </h3>
            <div className="space-y-3">
              {domains.map((d) => {
                const days = daysUntil(d.expires_date);
                const expired = isExpired(d.expires_date);
                const soon = isExpiringSoon(d.expires_date);
                return (
                  <div key={d.id} className={`border rounded-xl p-4 ${expired ? "border-red-200 bg-red-50/30" : soon ? "border-orange-200 bg-orange-50/30" : "border-gray-100 bg-gray-50/50"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-[var(--color-dark)]">{d.domain_name}</span>
                        {d.registrar && <span className="text-[var(--color-gray)] text-sm ml-2">· {d.registrar}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {d.auto_renew && <span className="px-2.5 py-1 text-[0.7rem] bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-semibold">자동갱신</span>}
                        {expired && <span className="px-2.5 py-1 text-[0.7rem] bg-red-50 text-red-600 rounded-full border border-red-200 font-semibold">만료됨</span>}
                        {!expired && soon && <span className="px-2.5 py-1 text-[0.7rem] bg-orange-50 text-orange-600 rounded-full border border-orange-200 font-semibold">만료 임박</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {d.registered_date && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">등록일</span>
                          <span className="text-[var(--color-dark)] text-sm">{formatShortDate(d.registered_date)}</span>
                        </div>
                      )}
                      {d.expires_date && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">만료일</span>
                          <span className={`text-sm font-medium ${expired ? "text-red-600" : soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>
                            {formatShortDate(d.expires_date)}
                          </span>
                        </div>
                      )}
                      {days !== null && !expired && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">남은 기간</span>
                          <span className={`text-sm font-bold ${soon ? "text-orange-500" : "text-[var(--color-dark)]"}`}>{days}일</span>
                        </div>
                      )}
                      {d.nameservers && (
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100 sm:col-span-2 lg:col-span-1">
                          <span className="text-[var(--color-gray)] text-xs block mb-0.5">네임서버</span>
                          <span className="text-[var(--color-dark)] text-sm break-all">{d.nameservers}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
