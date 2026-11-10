"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { canUseBiometrics, isNativeApp, loginWithBiometrics } from "@/lib/native";

export default function ClientLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [faceIdReady, setFaceIdReady] = useState(false);
  const [inApp, setInApp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 앱으로 열었고 이 기기가 지문·Face ID 를 쓸 수 있을 때만 버튼을 낸다.
    const check = setTimeout(async () => {
      if (!isNativeApp()) return;
      setInApp(true);
      setFaceIdReady(await canUseBiometrics());
    }, 0);
    return () => clearTimeout(check);
  }, []);

  const signIn = async (id: string, pw: string) => {
    const res = await fetch("/api/client-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: id, password: pw }),
    });
    return { ok: res.ok, data: await res.json() };
  };

  const handleBiometric = async () => {
    setError("");
    const saved = await loginWithBiometrics();
    if (!saved) return;

    setLoading(true);
    try {
      const { ok, data } = await signIn(saved.username, saved.password);
      if (!ok) {
        setError(data.error || "저장해 둔 정보로 열지 못했습니다. 비밀번호로 로그인해 주세요.");
        return;
      }
      router.push("/client/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/client-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        return;
      }

      router.push("/client/dashboard");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="no-underline inline-block hover:opacity-80 transition-opacity" aria-label="하온 홈">
            <Image
              src="/brand/haon-logo.png"
              alt="하온 HAON Software Solutions"
              width={751}
              height={240}
              priority
              className="h-[34px] w-auto mx-auto"
            />
          </Link>
          <p className="mt-3 text-[13px] text-[var(--p-sub)]">고객센터</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[var(--p-line)] rounded-2xl p-8 space-y-5"
        >
          {error && (
            <div className="px-4 py-3 bg-[var(--p-bg-sunk)] border border-[var(--p-line)] rounded-lg text-[var(--p-ink-2)] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[var(--color-dark-2)] text-sm font-medium mb-2">
              아이디
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 bg-[var(--p-bg-sunk)] border border-[var(--p-line)] rounded-xl text-[var(--color-dark)] text-[0.95rem] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-[var(--p-faint)]"
            />
          </div>

          <div>
            <label className="block text-[var(--color-dark-2)] text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 bg-[var(--p-bg-sunk)] border border-[var(--p-line)] rounded-xl text-[var(--color-dark)] text-[0.95rem] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-[var(--p-faint)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pressWide w-full py-3 bg-[var(--p-ink)] text-white rounded-xl font-semibold border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {faceIdReady && (
            <button
              type="button"
              onClick={handleBiometric}
              disabled={loading}
              className="pressWide w-full py-3 bg-white border border-[var(--p-line)] text-[var(--color-dark)] rounded-xl font-semibold cursor-pointer transition-colors hover:bg-[var(--p-bg-sunk)] disabled:opacity-50"
            >
              지문 · Face ID로 로그인
            </button>
          )}
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-[var(--color-gray-light)] text-xs">
            계정 정보를 모르시면 관리자에게 문의하세요.
          </p>
          {!inApp && (
            <Link href="/" className="inline-flex items-center gap-1 text-[var(--color-gray)] text-xs no-underline hover:text-[var(--color-dark)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              메인 사이트로 돌아가기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
