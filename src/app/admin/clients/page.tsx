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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 클라이언트를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClients((prev) => prev.filter((client) => client.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">클라이언트 관리</h2>
            <p className="text-[var(--color-gray-light)] text-sm">
              {clients.length}명의 클라이언트
            </p>
          </div>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold no-underline hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            새 클라이언트
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--color-gray-light)]">
            로딩 중...
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-gray-light)] mb-4">
              아직 등록된 클라이언트가 없습니다.
            </p>
            <Link
              href="/admin/clients/new"
              className="text-[var(--color-primary)] no-underline font-semibold hover:underline"
            >
              첫 번째 클라이언트를 추가해보세요
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-[0.95rem]">
                      {client.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-[0.7rem] font-semibold rounded-full ${
                        client.is_active
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {client.is_active ? "활성" : "비활성"}
                    </span>
                  </div>
                  <div className="text-[var(--color-gray-light)] text-[0.8rem] mb-1">
                    @{client.username}
                  </div>
                  {client.email && (
                    <div className="text-[var(--color-gray-light)] text-[0.8rem] mb-1">
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="text-[var(--color-gray-light)] text-[0.8rem]">
                      {client.phone}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/clients/${client.id}`)
                      }
                      className="flex-1 text-center py-2 bg-white/[0.06] border border-white/10 text-[var(--color-gray-light)] text-sm rounded-lg cursor-pointer hover:bg-white/10 hover:text-white transition-all"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      className="flex-1 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg cursor-pointer hover:bg-red-500/20 transition-all"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
