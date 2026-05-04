"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  client_name: string;
}

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  "진행중": { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  "상담중": { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  "유지보수": { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  "완료": { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setProjects(data.activeProjects ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statuses = [...new Set(projects.map((p) => p.status))];
  const filtered = projects.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.client_name.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = projects.filter((p) => p.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">프로젝트 관리</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">진행 중인 모든 프로젝트를 확인하세요.</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors">
            &larr; 대시보드
          </Link>
        </div>

        {/* 상태 탭 + 검색 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all ${
                filter === "all" ? "bg-[var(--color-dark)] text-white" : "bg-white text-[var(--color-gray)] border border-gray-200 hover:bg-gray-50"
              }`}
            >
              전체 {projects.length}
            </button>
            {statuses.map((s) => {
              const st = STATUS_STYLES[s] ?? STATUS_STYLES["완료"];
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all border ${
                    filter === s ? `${st.bg} ${st.text} ${st.border}` : "bg-white text-[var(--color-gray)] border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 ${st.dot} rounded-full`} />
                    {s} {counts[s]}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="프로젝트 또는 클라이언트 검색"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full sm:w-64"
          />
        </div>

        {/* 프로젝트 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-[var(--color-gray)]">
              {search ? "검색 결과가 없습니다." : "프로젝트가 없습니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const st = STATUS_STYLES[p.status] ?? STATUS_STYLES["완료"];
              return (
                <Link
                  key={p.id}
                  href={`/admin/clients/${p.client_id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all no-underline group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text} border ${st.border}`}>
                      <span className={`w-1.5 h-1.5 ${st.dot} rounded-full`} />
                      {p.status}
                    </span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <h3 className="text-[0.95rem] font-bold text-[var(--color-dark)] mb-1 truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[var(--color-gray)]">{p.client_name}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
