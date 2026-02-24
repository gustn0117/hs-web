"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

interface DashboardData {
  client: { id: string; name: string; username: string; email: string | null; phone: string | null };
  projects: Project[];
  hosting: Hosting[];
  domains: Domain[];
  payments: Payment[];
}

const STATUS_COLORS: Record<string, string> = {
  "상담중": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "진행중": "bg-blue-100 text-blue-700 border-blue-200",
  "완료": "bg-green-100 text-green-700 border-green-200",
  "유지보수": "bg-purple-100 text-purple-700 border-purple-200",
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  paid: { label: "완료", color: "bg-green-100 text-green-700" },
  pending: { label: "대기", color: "bg-yellow-100 text-yellow-700" },
  overdue: { label: "미납", color: "bg-red-100 text-red-700" },
};

function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

export default function ClientDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center">
        <div className="text-[var(--color-gray)]">로딩 중...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "오류가 발생했습니다."}</p>
          <button onClick={() => router.push("/client")} className="text-[var(--color-primary)] font-semibold">
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const sectionTitle = "text-lg font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2";
  const card = "bg-white border border-gray-100 rounded-xl p-5 shadow-sm";

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[var(--color-dark)]">
              HS <span className="gradient-text">WEB</span>
            </h1>
            <span className="text-[var(--color-gray-light)] text-sm">고객 포털</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-dark-2)] font-medium">
              {data.client.name}님
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 border border-gray-200 text-[var(--color-gray)] text-sm rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-6 py-8 space-y-10">

        {/* 프로젝트 */}
        <section>
          <h2 className={sectionTitle}>
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            프로젝트
          </h2>
          {data.projects.length === 0 ? (
            <p className="text-[var(--color-gray-light)] text-sm">등록된 프로젝트가 없습니다.</p>
          ) : (
            <div className="grid gap-4">
              {data.projects.map((p) => (
                <div key={p.id} className={card}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-[var(--color-dark)]">{p.name}</h3>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] text-sm hover:underline">
                          {p.website_url}
                        </a>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-[0.75rem] font-medium rounded-full border ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {p.tech_stack && (
                      <div>
                        <span className="text-[var(--color-gray-light)] text-xs">기술 스택</span>
                        <p className="text-[var(--color-dark-2)]">{p.tech_stack}</p>
                      </div>
                    )}
                    {p.admin_url && (
                      <div>
                        <span className="text-[var(--color-gray-light)] text-xs">관리자 페이지</span>
                        <a href={p.admin_url} target="_blank" rel="noopener noreferrer" className="block text-[var(--color-primary)] hover:underline truncate">
                          {p.admin_url}
                        </a>
                      </div>
                    )}
                    {p.admin_id && (
                      <div>
                        <span className="text-[var(--color-gray-light)] text-xs">관리자 아이디</span>
                        <p className="text-[var(--color-dark-2)]">{p.admin_id}</p>
                      </div>
                    )}
                    {p.admin_pw && (
                      <div>
                        <span className="text-[var(--color-gray-light)] text-xs">관리자 비밀번호</span>
                        <p className="text-[var(--color-dark-2)]">{p.admin_pw}</p>
                      </div>
                    )}
                  </div>
                  {p.description && (
                    <p className="mt-3 text-sm text-[var(--color-gray)] border-t border-gray-50 pt-3">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 호스팅 */}
        <section>
          <h2 className={sectionTitle}>
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
            </svg>
            호스팅
          </h2>
          {data.hosting.length === 0 ? (
            <p className="text-[var(--color-gray-light)] text-sm">등록된 호스팅 정보가 없습니다.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.hosting.map((h) => (
                <div key={h.id} className={card}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[var(--color-dark)]">{h.provider}</h3>
                    {h.auto_renew && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[0.7rem] rounded-full border border-green-200">자동갱신</span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {h.plan && <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">플랜</span><span className="text-[var(--color-dark-2)]">{h.plan}</span></div>}
                    <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">금액</span><span className="text-[var(--color-dark-2)] font-semibold">{h.amount.toLocaleString()}원 / {h.billing_cycle === "monthly" ? "월" : "연"}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">시작일</span><span className="text-[var(--color-dark-2)]">{h.start_date}</span></div>
                    {h.end_date && (
                      <div className="flex justify-between">
                        <span className="text-[var(--color-gray-light)]">만료일</span>
                        <span className={`font-semibold ${isExpired(h.end_date) ? "text-red-500" : isExpiringSoon(h.end_date) ? "text-orange-500" : "text-[var(--color-dark-2)]"}`}>
                          {h.end_date}
                          {isExpired(h.end_date) && " (만료됨)"}
                          {isExpiringSoon(h.end_date) && " (만료 임박)"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 도메인 */}
        <section>
          <h2 className={sectionTitle}>
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            도메인
          </h2>
          {data.domains.length === 0 ? (
            <p className="text-[var(--color-gray-light)] text-sm">등록된 도메인 정보가 없습니다.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.domains.map((d) => (
                <div key={d.id} className={card}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[var(--color-dark)]">{d.domain_name}</h3>
                    {d.auto_renew && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[0.7rem] rounded-full border border-green-200">자동갱신</span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {d.registrar && <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">등록업체</span><span className="text-[var(--color-dark-2)]">{d.registrar}</span></div>}
                    {d.registered_date && <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">등록일</span><span className="text-[var(--color-dark-2)]">{d.registered_date}</span></div>}
                    {d.expires_date && (
                      <div className="flex justify-between">
                        <span className="text-[var(--color-gray-light)]">만료일</span>
                        <span className={`font-semibold ${isExpired(d.expires_date) ? "text-red-500" : isExpiringSoon(d.expires_date) ? "text-orange-500" : "text-[var(--color-dark-2)]"}`}>
                          {d.expires_date}
                          {isExpired(d.expires_date) && " (만료됨)"}
                          {isExpiringSoon(d.expires_date) && " (만료 임박)"}
                        </span>
                      </div>
                    )}
                    {d.nameservers && <div className="flex justify-between"><span className="text-[var(--color-gray-light)]">네임서버</span><span className="text-[var(--color-dark-2)] text-right">{d.nameservers}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 결제 내역 */}
        <section>
          <h2 className={sectionTitle}>
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            결제 내역
          </h2>
          {data.payments.length === 0 ? (
            <p className="text-[var(--color-gray-light)] text-sm">등록된 결제 내역이 없습니다.</p>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-[var(--color-gray)] font-medium">날짜</th>
                      <th className="text-left px-5 py-3 text-[var(--color-gray)] font-medium">구분</th>
                      <th className="text-left px-5 py-3 text-[var(--color-gray)] font-medium">내용</th>
                      <th className="text-right px-5 py-3 text-[var(--color-gray)] font-medium">금액</th>
                      <th className="text-center px-5 py-3 text-[var(--color-gray)] font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((p) => {
                      const st = PAYMENT_STATUS[p.status] || { label: p.status, color: "bg-gray-100 text-gray-600" };
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-[var(--color-dark-2)]">{p.payment_date}</td>
                          <td className="px-5 py-3.5 text-[var(--color-dark-2)]">{p.type}</td>
                          <td className="px-5 py-3.5 text-[var(--color-gray)]">{p.description || "-"}</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-[var(--color-dark)]">{p.amount.toLocaleString()}원</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`px-2.5 py-1 text-[0.75rem] font-medium rounded-full ${st.color}`}>
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
          )}
        </section>
      </div>
    </div>
  );
}
