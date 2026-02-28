"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../../components/AdminHeader";

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", memo: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("이름은 필수 항목입니다.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "클라이언트 생성에 실패했습니다.");
      }

      const data = await res.json();
      router.push(`/admin/clients/${data.client.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "클라이언트 생성에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-dark)] text-[0.95rem] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400";
  const labelClass =
    "block text-[var(--color-dark-2)] text-sm font-medium mb-2";

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/admin/clients"
            className="text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors flex items-center gap-1 text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            클라이언트 목록으로
          </Link>
          <h2 className="text-xl font-bold text-[var(--color-dark)]">새 클라이언트 추가</h2>
          <p className="text-[var(--color-gray)] text-sm mt-1">이름을 입력하고 생성 후 초대 링크를 보내세요.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="max-w-[800px]">
          {error && (
            <div className="px-4 py-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
            <div className="space-y-5">
              <div>
                <label className={labelClass}>클라이언트 이름 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="예: 홍길동, ABC 주식회사"
                  className={inputClass}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClass}>메모</label>
                <textarea
                  value={form.memo}
                  onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))}
                  placeholder="참고할 내용을 남겨주세요"
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  생성 중...
                </>
              ) : (
                "추가하기"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/clients")}
              className="px-8 py-3 bg-gray-100 border border-gray-200 text-[var(--color-gray)] rounded-xl font-semibold cursor-pointer transition-all hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
