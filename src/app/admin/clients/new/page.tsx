"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../../components/AdminHeader";

interface ClientFormData {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  memo: string;
}

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState<ClientFormData>({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    memo: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      router.push("/admin/clients");
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            클라이언트 목록으로
          </Link>
          <h2 className="text-xl font-bold text-[var(--color-dark)]">새 클라이언트 추가</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate className="max-w-[800px] space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>아이디 *</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                placeholder="로그인에 사용할 아이디"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>비밀번호 *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="비밀번호를 입력하세요"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>이름 *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="클라이언트 이름"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>전화번호</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="010-0000-0000"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>메모</label>
            <textarea
              value={form.memo}
              onChange={(e) =>
                setForm((p) => ({ ...p, memo: e.target.value }))
              }
              placeholder="클라이언트에 대한 메모를 남겨주세요"
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path
                      d="M12 2a10 10 0 019.95 9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  저장 중...
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
