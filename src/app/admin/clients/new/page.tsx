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
        </div>

        <div className="max-w-[800px]">
          {/* Info banner */}
          <div className="flex gap-4 items-start bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 text-sm font-semibold mb-1">간편 등록 프로세스</p>
              <p className="text-blue-600 text-xs leading-relaxed">
                이름만 입력하면 클라이언트가 생성됩니다. 생성 후 상세 페이지에서 <strong>초대 링크</strong>를 만들어 보내면, 클라이언트가 직접 아이디와 비밀번호를 설정할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Steps visualization */}
          <div className="flex items-center gap-0 mb-8 px-2">
            {[
              { num: "1", label: "이름 입력", desc: "지금", active: true },
              { num: "2", label: "초대 링크 발송", desc: "생성 후", active: false },
              { num: "3", label: "계정 등록", desc: "클라이언트가", active: false },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    s.active
                      ? "bg-gradient-to-br from-[var(--color-primary)] to-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${s.active ? "text-[var(--color-dark)]" : "text-gray-400"}`}>{s.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{s.desc}</span>
                </div>
                {i < 2 && (
                  <div className="w-full h-px bg-gray-200 mx-2 mb-8" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
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
                  <label className={labelClass}>
                    클라이언트 이름 <span className="text-red-400">*</span>
                  </label>
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
                    placeholder="프로젝트 개요, 연락처 등 참고할 내용을 남겨주세요"
                    rows={4}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
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
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    클라이언트 생성
                  </>
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
    </div>
  );
}
