"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface ExcludedItem {
  id: string;
  project_name: string;
  project_status: string;
  client_id: string;
  client_name: string;
  reason: string;
  excluded_at: string | null;
}

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function HostingExcludedPage() {
  const [items, setItems] = useState<ExcludedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/hosting-excluded")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const restore = async (item: ExcludedItem) => {
    if (!confirm(`"${item.project_name}"을(를) 제외 해제하시겠습니까?\n다시 호스팅 결제 미확인 목록에 표시됩니다.`)) return;
    setRestoring(item.id);
    try {
      const res = await fetch(`/api/clients/${item.client_id}/projects/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hosting_excluded: false,
          hosting_excluded_reason: null,
          hosting_excluded_at: null,
        }),
      });
      if (!res.ok) throw new Error("실패");
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    } catch {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setRestoring(null);
    }
  };

  const filtered = items.filter((i) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      i.client_name.toLowerCase().includes(q) ||
      i.project_name.toLowerCase().includes(q) ||
      i.reason.toLowerCase().includes(q)
    );
  });

  // Group by reason for summary
  const reasonStats: Record<string, number> = {};
  items.forEach((i) => {
    const key = i.reason || "(사유 없음)";
    reasonStats[key] = (reasonStats[key] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/admin/dashboard"
            className="text-sm text-[var(--color-gray)] hover:text-[var(--color-dark)] no-underline"
          >
            ← 대시보드로
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8 mt-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">호스팅 결제 미확인 제외 목록</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">
              호스팅이 필요 없거나 외부 서버를 사용하는 프로젝트입니다.
              {items.length > 0 && (
                <span className="ml-2 text-orange-600 font-medium">총 {items.length}건</span>
              )}
            </p>
          </div>
        </div>

        {/* Reason summary */}
        {items.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-gray)] uppercase tracking-wider mb-3">
              사유별 집계
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reasonStats)
                .sort((a, b) => b[1] - a[1])
                .map(([reason, count]) => (
                  <span
                    key={reason}
                    className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-gray-50 border border-gray-200 text-xs"
                  >
                    <span className="text-[var(--color-dark-2)]">{reason}</span>
                    <span className="font-bold text-[var(--color-dark)] tabular-nums">{count}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Search */}
        {items.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="클라이언트명, 프로젝트명, 사유 검색..."
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-[var(--color-gray)] text-sm mb-2">제외된 프로젝트가 없습니다.</p>
            <p className="text-xs text-[var(--color-gray)]">
              대시보드의 호스팅 결제 미확인 목록에서 프로젝트별로 제외 처리할 수 있습니다.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-gray)] text-sm">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          href={`/admin/clients/${item.client_id}`}
                          className="text-sm font-semibold text-[var(--color-dark)] hover:text-blue-600 no-underline"
                        >
                          {item.client_name}
                        </Link>
                        <span className="text-xs text-[var(--color-gray)]">·</span>
                        <span className="text-sm text-[var(--color-dark-2)]">{item.project_name}</span>
                        {item.project_status && (
                          <span className="text-[10px] bg-gray-100 text-[var(--color-gray)] px-2 py-0.5 rounded-full">
                            {item.project_status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[var(--color-gray)] mt-1.5">
                        <span className="font-semibold text-[var(--color-dark-2)] shrink-0">사유</span>
                        <span className="text-[var(--color-dark-2)] leading-relaxed">{item.reason || "(미입력)"}</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-gray)] mt-1 tabular-nums">
                        제외 처리: {fmtDate(item.excluded_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => restore(item)}
                    disabled={restoring === item.id}
                    className="text-xs text-[var(--color-gray)] hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer bg-transparent shrink-0 disabled:opacity-50"
                  >
                    {restoring === item.id ? "처리 중..." : "제외 해제"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
