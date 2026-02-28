"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done">("loading");
  const [clientName, setClientName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        const data = await res.json();
        if (data.valid) {
          setClientName(data.clientName);
          setStatus("valid");
        } else {
          setErrorMsg(data.error || "유효하지 않은 링크입니다.");
          setStatus("invalid");
        }
      } catch {
        setErrorMsg("서버 오류가 발생했습니다.");
        setStatus("invalid");
      }
    }
    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.username.trim()) { setFormError("아이디를 입력해주세요."); return; }
    if (form.username.length < 3) { setFormError("아이디는 3자 이상이어야 합니다."); return; }
    if (!form.password) { setFormError("비밀번호를 입력해주세요."); return; }
    if (form.password.length < 6) { setFormError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (form.password !== form.passwordConfirm) { setFormError("비밀번호가 일치하지 않습니다."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          username: form.username,
          password: form.password,
          email: form.email || undefined,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
      } else {
        setFormError(data.error || "등록에 실패했습니다.");
      }
    } catch {
      setFormError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-dark)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400";
  const labelClass = "block text-[var(--color-dark-2)] text-xs font-medium mb-1.5";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center">
        <svg className="w-7 h-7 animate-spin text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="bg-white shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl px-8 py-10">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-[var(--color-dark)] mb-1.5">유효하지 않은 링크</h1>
            <p className="text-[var(--color-gray)] text-sm mb-3">{errorMsg}</p>
            <p className="text-[var(--color-gray-light)] text-xs">관리자에게 새 초대 링크를 요청해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="bg-white shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl px-8 py-10">
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-[var(--color-dark)] mb-1.5">등록 완료</h1>
            <p className="text-[var(--color-gray)] text-sm mb-6">계정이 성공적으로 등록되었습니다.</p>
            <button
              onClick={() => router.push("/client")}
              className="w-full py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-[var(--color-dark)] mb-1">
            HS <span className="gradient-text">WEB</span>
          </h1>
          <p className="text-[var(--color-gray)] text-sm">
            <span className="font-medium text-[var(--color-dark)]">{clientName}</span>님, 계정을 등록해주세요
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl p-6 space-y-4"
        >
          {formError && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className={labelClass}>아이디 *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="3자 이상"
              className={inputClass}
              autoComplete="username"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>비밀번호 *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="6자 이상"
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelClass}>비밀번호 확인 *</label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) => setForm((p) => ({ ...p, passwordConfirm: e.target.value }))}
                placeholder="다시 입력"
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className={labelClass}>이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>
            <div>
              <label className={labelClass}>전화번호</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className={inputClass}
                autoComplete="tel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "등록 중..." : "등록하기"}
          </button>
        </form>

        <p className="text-center text-[var(--color-gray-light)] text-xs mt-5">
          문의사항은 관리자에게 연락해주세요.
        </p>
      </div>
    </div>
  );
}
