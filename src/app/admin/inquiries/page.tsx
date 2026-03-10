"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  type: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((d) => setInquiries(d.inquiries ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/inquiries/${id}`, { method: "PUT" });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: true } : i)));
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = inquiries.filter((i) => {
    if (filter === "unread") return !i.is_read;
    if (filter === "read") return i.is_read;
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">문의 관리</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">
              접수된 문의를 확인하고 관리하세요.
              {unreadCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">미확인 {unreadCount}건</span>
              )}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {([["all", "전체"], ["unread", "미확인"], ["read", "확인완료"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all ${
                filter === key
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white text-[var(--color-gray)] border-gray-200 hover:border-gray-300"
              }`}
            >
              {label}
              {key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-gray)]">
            {filter === "all" ? "접수된 문의가 없습니다." : filter === "unread" ? "미확인 문의가 없습니다." : "확인완료 문의가 없습니다."}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-3">
              {filtered.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelected(inq);
                    if (!inq.is_read) markAsRead(inq.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selected?.id === inq.id
                      ? "border-[var(--color-primary)] bg-blue-50/50 shadow-md"
                      : !inq.is_read
                      ? "border-blue-200 bg-white hover:shadow-md"
                      : "border-gray-200 bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!inq.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                      )}
                      <span className="font-semibold text-[var(--color-dark)] text-sm">{inq.name}</span>
                      {inq.type && (
                        <span className="text-xs bg-gray-100 text-[var(--color-gray)] px-2 py-0.5 rounded-full">
                          {inq.type}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--color-gray)]">
                      {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-gray)] truncate">
                    {inq.message || "내용 없음"}
                  </p>
                  <p className="text-xs text-[var(--color-gray)] mt-1">{inq.phone}</p>
                </div>
              ))}
            </div>

            {/* Detail */}
            {selected ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-[var(--color-dark)]">문의 상세</h3>
                  <div className="flex items-center gap-2">
                    {selected.is_read ? (
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">확인완료</span>
                    ) : (
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">미확인</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[var(--color-gray)] mb-1">이름</p>
                    <p className="text-sm font-medium text-[var(--color-dark)]">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray)] mb-1">연락처</p>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      <a href={`tel:${selected.phone}`} className="text-[var(--color-primary)] no-underline hover:underline">{selected.phone}</a>
                    </p>
                  </div>
                  {selected.email && (
                    <div>
                      <p className="text-xs text-[var(--color-gray)] mb-1">이메일</p>
                      <p className="text-sm font-medium text-[var(--color-dark)]">{selected.email}</p>
                    </div>
                  )}
                  {selected.type && (
                    <div>
                      <p className="text-xs text-[var(--color-gray)] mb-1">문의 유형</p>
                      <p className="text-sm font-medium text-[var(--color-dark)]">{selected.type}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-[var(--color-gray)] mb-1">문의 내용</p>
                    <p className="text-sm text-[var(--color-dark)] whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4">
                      {selected.message || "내용 없음"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray)] mb-1">접수일시</p>
                    <p className="text-sm text-[var(--color-dark)]">
                      {new Date(selected.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex-1 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl text-center no-underline hover:opacity-90 transition-opacity"
                  >
                    전화하기
                  </a>
                  <button
                    onClick={() => deleteInquiry(selected.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center h-64 text-[var(--color-gray)] text-sm">
                문의를 선택하면 상세 내용이 표시됩니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
