"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface Client {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  memo: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
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
    if (!confirm(`"${name}" 클라이언트를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClients((prev) => prev.filter((client) => client.id !== id));
    }
  };

  const filtered = clients.filter((c) => {
    if (filter === "active" && !c.is_active) return false;
    if (filter === "inactive" && c.is_active) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  const activeCount = clients.filter((c) => c.is_active).length;
  const inactiveCount = clients.length - activeCount;

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)] mb-1">
              클라이언트 관리
            </h2>
            <p className="text-[var(--color-gray)] text-sm">
              총 {clients.length}명
              {clients.length > 0 && (
                <span className="ml-2 text-[var(--color-gray)]">
                  (활성 {activeCount} / 비활성 {inactiveCount})
                </span>
              )}
            </p>
          </div>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold no-underline hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 클라이언트
          </Link>
        </div>

        {/* Search & Filter */}
        {clients.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="이름, 아이디, 이메일, 전화번호로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {([
                ["all", "전체"],
                ["active", "활성"],
                ["inactive", "비활성"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 text-sm rounded-lg cursor-pointer transition-all border-none ${
                    filter === key
                      ? "bg-[var(--color-primary)] text-white font-semibold"
                      : "bg-transparent text-[var(--color-gray)] hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-[var(--color-gray)] mb-4">
              아직 등록된 클라이언트가 없습니다.
            </p>
            <Link
              href="/admin/clients/new"
              className="text-[var(--color-accent)] no-underline font-semibold hover:underline"
            >
              첫 번째 클라이언트를 추가해보세요
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-gray)]">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((client) => (
              <div
                key={client.id}
                onClick={() => router.push(`/admin/clients/${client.id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                        client.is_active
                          ? "bg-gradient-to-br from-[var(--color-primary)] to-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[var(--color-dark)] font-semibold text-[0.95rem] truncate">
                          {client.name}
                        </h3>
                        <span
                          className={`shrink-0 w-2 h-2 rounded-full ${
                            client.is_active ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                          title={client.is_active ? "활성" : "비활성"}
                        />
                      </div>
                      <p className="text-[var(--color-gray)] text-[0.8rem] truncate">
                        @{client.username}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-[0.8rem]">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <span className="text-[var(--color-dark-2)] truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-[0.8rem]">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span className="text-[var(--color-dark-2)]">{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {client.memo && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-[var(--color-gray)] text-[0.8rem] line-clamp-2">
                      {client.memo}
                    </p>
                  )}
                </div>

                <div className="px-5 pb-4 flex items-center justify-between">
                  <span className="text-[var(--color-gray)] text-[0.75rem]">
                    {new Date(client.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, client.id, client.name)}
                    className="text-[0.75rem] text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-1"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
