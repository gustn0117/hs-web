"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface ClientProject {
  id: string;
  name: string;
  status: string;
}

interface Client {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  memo: string;
  is_active: boolean;
  created_at: string;
  projects?: ClientProject[];
}

const STATUS_DOT: Record<string, string> = {
  "상담중": "#a16207",
  "진행중": "#0f172a",
  "완료": "#047857",
  "유지보수": "#6d28d9",
};

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) * 0.5;
    const cp2x = p0.x + (p1.x - p0.x) * 0.5;
    d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"recent" | "name" | "projects">("recent");
  const router = useRouter();

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      console.error("클라이언트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm(`"${name}" 클라이언트를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filtered = useMemo(() => {
    const list = clients.filter((c) => {
      if (filter === "active" && !c.is_active) return false;
      if (filter === "inactive" && c.is_active) return false;
      if (search) {
        const q = search.toLowerCase();
        const projectMatch = c.projects?.some((p) => p.name?.toLowerCase().includes(q));
        return (
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.username && c.username.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q)) ||
          projectMatch
        );
      }
      return true;
    });

    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "projects") return [...list].sort((a, b) => (b.projects?.length ?? 0) - (a.projects?.length ?? 0));
    return [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [clients, search, filter, sort]);

  const stats = useMemo(() => {
    const activeCount = clients.filter((c) => c.is_active).length;
    const inactiveCount = clients.length - activeCount;

    // New clients in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newCount = clients.filter((c) => new Date(c.created_at).getTime() >= thirtyDaysAgo).length;

    // Projects aggregate
    const allProjects = clients.flatMap((c) => c.projects ?? []);
    const projectStatusCounts: Record<string, number> = {};
    allProjects.forEach((p) => {
      projectStatusCounts[p.status] = (projectStatusCounts[p.status] || 0) + 1;
    });
    const inProgress = projectStatusCounts["진행중"] ?? 0;

    // Monthly signup trend (last 6 months)
    const now = new Date();
    const monthly: { month: string; label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = clients.filter((c) => {
        if (!c.created_at) return false;
        const cd = new Date(c.created_at);
        return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
      }).length;
      monthly.push({ month: ym, label: `${d.getMonth() + 1}월`, count });
    }

    return {
      activeCount,
      inactiveCount,
      newCount,
      totalProjects: allProjects.length,
      inProgress,
      projectStatusCounts,
      monthly,
    };
  }, [clients]);

  // Sparkline data
  const sparkW = 100;
  const sparkH = 30;
  const sparkMax = Math.max(...stats.monthly.map((m) => m.count), 1);
  const sparkPoints = stats.monthly.map((m, i, arr) => ({
    x: (i / Math.max(arr.length - 1, 1)) * (sparkW - 4) + 2,
    y: sparkH - 2 - (m.count / sparkMax) * (sparkH - 6),
  }));
  const sparkPath = buildSmoothPath(sparkPoints);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-5">
        {/* Header strip */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">클라이언트 관리</h2>
            <p className="text-slate-500 text-sm mt-1">
              총 <span className="font-semibold text-slate-700 tabular-nums">{clients.length}</span>명
              {clients.length > 0 && (
                <>
                  <span className="mx-2 text-slate-300">·</span>
                  활성 <span className="font-semibold text-slate-700 tabular-nums">{stats.activeCount}</span>
                  <span className="mx-2 text-slate-300">/</span>
                  비활성 <span className="font-semibold text-slate-700 tabular-nums">{stats.inactiveCount}</span>
                </>
              )}
            </p>
          </div>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-4 h-9 bg-slate-900 text-white rounded-md text-sm font-semibold no-underline hover:bg-slate-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 클라이언트
          </Link>
        </div>

        {/* KPI summary cards */}
        {!loading && clients.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">활성 클라이언트</p>
              <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">
                {stats.activeCount}
                <span className="text-slate-400 font-medium text-base"> / {clients.length}</span>
              </p>
              <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full"
                  style={{ width: `${clients.length > 0 ? (stats.activeCount / clients.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 relative overflow-hidden">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">최근 30일 신규</p>
              <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">{stats.newCount}</p>
              <p className="text-[11px] text-slate-500 mt-1.5">최근 6개월 가입 추이</p>
              <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="absolute right-3 bottom-3 w-20 h-7 opacity-70" aria-hidden>
                <path d={sparkPath} fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                {sparkPoints.length > 0 && (
                  <circle
                    cx={sparkPoints[sparkPoints.length - 1].x}
                    cy={sparkPoints[sparkPoints.length - 1].y}
                    r="2"
                    fill="#0f172a"
                  />
                )}
              </svg>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">총 프로젝트</p>
              <p className="text-[26px] font-bold text-slate-900 mt-2 tabular-nums">{stats.totalProjects}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                <span>진행 {stats.inProgress}</span>
                <span className="w-px h-3 bg-slate-200" />
                <span>완료 {stats.projectStatusCounts["완료"] ?? 0}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">상태 분포</p>
              <div className="mt-2.5 space-y-1.5">
                {Object.entries(stats.projectStatusCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([status, count]) => {
                    const total = stats.totalProjects || 1;
                    const pct = (count / total) * 100;
                    const color = STATUS_DOT[status] ?? "#64748b";
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            <span className="text-slate-700">{status}</span>
                          </span>
                          <span className="text-slate-900 font-bold tabular-nums">{count}</span>
                        </div>
                        <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(stats.projectStatusCounts).length === 0 && (
                  <p className="text-[11px] text-slate-400">데이터 없음</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter / search bar */}
        {clients.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="이름, 아이디, 이메일, 전화번호, 프로젝트명으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 h-9 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
                  {([
                    ["all", "전체"],
                    ["active", "활성"],
                    ["inactive", "비활성"],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-3 h-8 text-xs rounded transition-colors border-none cursor-pointer ${
                        filter === key
                          ? "bg-white text-slate-900 font-semibold shadow-sm"
                          : "bg-transparent text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-9 px-3 bg-white border border-slate-200 rounded-md text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-slate-400"
                >
                  <option value="recent">최근 등록</option>
                  <option value="name">이름순</option>
                  <option value="projects">프로젝트 많은 순</option>
                </select>

                <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
                  <button
                    onClick={() => setView("grid")}
                    title="카드 뷰"
                    className={`w-8 h-8 inline-flex items-center justify-center rounded transition-colors border-none cursor-pointer ${
                      view === "grid" ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    title="리스트 뷰"
                    className={`w-8 h-8 inline-flex items-center justify-center rounded transition-colors border-none cursor-pointer ${
                      view === "list" ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {(search || filter !== "all") && (
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
                <span className="text-xs text-slate-500">결과 <span className="font-bold text-slate-900 tabular-nums">{filtered.length}</span>건</span>
                {(search || filter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 underline-offset-2 hover:underline cursor-pointer bg-transparent border-none"
                  >
                    초기화
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-20 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-2">아직 등록된 클라이언트가 없습니다</p>
            <Link href="/admin/clients/new" className="text-sm text-slate-900 font-semibold no-underline hover:underline">
              첫 번째 클라이언트 추가 →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <p className="text-sm text-slate-500">검색 결과가 없습니다.</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((client) => (
              <div
                key={client.id}
                onClick={() => router.push(`/admin/clients/${client.id}`)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                        client.is_active ? "bg-slate-900" : "bg-slate-400"
                      }`}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-slate-900 font-bold text-sm truncate">{client.name}</h3>
                        {client.is_active ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-bold shrink-0">활성</span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded font-bold shrink-0">비활성</span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs truncate mt-0.5">@{client.username}</p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, client.id, client.name)}
                      title="삭제"
                      className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-1 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-xs">
                        <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <span className="text-slate-700 truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs">
                        <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span className="text-slate-700">{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {client.projects && client.projects.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {client.projects.slice(0, 4).map((p) => {
                          const color = STATUS_DOT[p.status] ?? "#64748b";
                          return (
                            <span
                              key={p.id}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded bg-slate-50 border border-slate-200 text-slate-700 max-w-[140px]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                              <span className="truncate">{p.name}</span>
                            </span>
                          );
                        })}
                        {client.projects.length > 4 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] text-slate-500">
                            +{client.projects.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {client.memo && (
                    <p className="mt-3 pt-3 border-t border-slate-100 text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {client.memo}
                    </p>
                  )}
                </div>

                <div className="px-5 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 tabular-nums">
                    가입 {new Date(client.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-700 transition-colors">상세 보기 →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-2.5 px-5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">클라이언트</th>
                    <th className="text-left py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">연락처</th>
                    <th className="text-left py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">프로젝트</th>
                    <th className="text-center py-2.5 px-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">상태</th>
                    <th className="text-right py-2.5 px-5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                              client.is_active ? "bg-slate-900" : "bg-slate-400"
                            }`}
                          >
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{client.name}</p>
                            <p className="text-xs text-slate-500 truncate">@{client.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 text-xs">
                        {client.email && <p className="truncate max-w-[200px]">{client.email}</p>}
                        {client.phone && <p className="text-slate-500 tabular-nums">{client.phone}</p>}
                      </td>
                      <td className="py-3 px-3">
                        {client.projects && client.projects.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {client.projects.slice(0, 3).map((p) => {
                              const color = STATUS_DOT[p.status] ?? "#64748b";
                              return (
                                <span
                                  key={p.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded bg-slate-50 border border-slate-200 text-slate-700 max-w-[140px]"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                                  <span className="truncate">{p.name}</span>
                                </span>
                              );
                            })}
                            {client.projects.length > 3 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] text-slate-500">
                                +{client.projects.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {client.is_active ? (
                          <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">활성</span>
                        ) : (
                          <span className="text-[11px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded font-bold">비활성</span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-right text-xs text-slate-500 tabular-nums">
                        {new Date(client.created_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
