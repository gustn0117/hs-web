"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "로그인에 실패했습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsOn(e.getModifierState("CapsLock"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left visual panel */}
      <aside
        className="relative lg:w-[44%] xl:w-[40%] text-white overflow-hidden flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse at top left, #1e293b 0%, transparent 50%), radial-gradient(ellipse at bottom right, #0a2a5e 0%, transparent 50%), #0f172a",
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Animated glow blobs */}
        <div
          className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #2459b0 0%, transparent 70%)",
            animation: "login-blob-a 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #5b87dc 0%, transparent 70%)",
            animation: "login-blob-b 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-[260px] h-[260px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
            animation: "login-blob-c 26s ease-in-out infinite",
          }}
        />

        {/* Decorative network SVG (top right) */}
        <svg
          className="hidden lg:block absolute top-16 right-10 w-[180px] h-[180px] opacity-30 pointer-events-none"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <defs>
            <radialGradient id="login-pulse" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#5b87dc" stopOpacity="1" />
              <stop offset="100%" stopColor="#5b87dc" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[
            [40, 60], [120, 30], [160, 90], [80, 110], [140, 150], [50, 160],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="2.5" fill="#fff" />
              <circle cx={cx} cy={cy} r="14" fill="url(#login-pulse)">
                <animate attributeName="r" values="2;14;2" dur={`${2.4 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur={`${2.4 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none">
            <line x1="40" y1="60" x2="120" y2="30" />
            <line x1="120" y1="30" x2="160" y2="90" />
            <line x1="80" y1="110" x2="40" y2="60" />
            <line x1="80" y1="110" x2="160" y2="90" />
            <line x1="80" y1="110" x2="140" y2="150" />
            <line x1="50" y1="160" x2="80" y2="110" />
            <line x1="50" y1="160" x2="140" y2="150" />
          </g>
        </svg>

        {/* Top */}
        <div className="relative px-8 lg:px-12 pt-8 lg:pt-10 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-baseline gap-2 no-underline">
            <span className="text-[20px] font-extrabold tracking-[-0.035em] text-white">HS WEB</span>
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">Admin</span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/45 uppercase font-mono">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            v2026.01
          </span>
        </div>

        {/* Center content */}
        <div className="relative flex-1 flex flex-col justify-center px-8 lg:px-12 py-10">
          <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-wider self-start mb-7 backdrop-blur-sm">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            INTERNAL · AUTHORIZED ONLY
          </div>

          <h1 className="text-[40px] lg:text-[56px] font-black tracking-[-0.04em] leading-[1.12] mb-5">
            <span className="block">관리자</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)",
              }}
            >
              콘솔에 오신 걸
            </span>
            <span className="block text-white/40 italic font-bold">환영합니다.</span>
          </h1>
          <p className="text-[14px] lg:text-[15px] text-white/55 leading-[1.7] max-w-[440px]">
            클라이언트, 프로젝트, 결제, 호스팅, 서버까지
            <br />
            <span className="text-white/75">한 곳에서 관리합니다.</span>
          </p>

          {/* System status card */}
          <div className="mt-8 max-w-[440px] rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                System Status
              </p>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                All operational
              </span>
            </div>
            <ul className="list-none m-0 divide-y divide-white/5">
              {[
                { name: "Web Server", note: "Cloudflare · CDN", up: "99.98%" },
                { name: "Database", note: "Supabase · self-hosted", up: "99.95%" },
                { name: "Object Storage", note: "Supabase Storage", up: "99.99%" },
                { name: "Auth Gateway", note: "JWT · session cookies", up: "99.97%" },
              ].map((s) => (
                <li key={s.name} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="relative flex w-1.5 h-1.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-white/90 truncate">{s.name}</p>
                      <p className="text-[10.5px] text-white/40 truncate font-mono">{s.note}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 tabular-nums shrink-0 ml-3">
                    {s.up}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Console-like recent activity */}
          <div className="mt-4 max-w-[440px] rounded-xl bg-[#0a0f1c]/80 border border-white/10 backdrop-blur-md overflow-hidden">
            <div className="px-4 py-2 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] font-mono text-white/45">~ admin@hsweb</span>
            </div>
            <ul className="list-none m-0 px-4 py-2.5 font-mono text-[10.5px] leading-[1.65] space-y-0.5">
              {[
                { t: "[OK]", c: "text-emerald-400", m: "DB backup completed · hs_web" },
                { t: "[INFO]", c: "text-sky-300", m: "1 inquiry received · 24h" },
                { t: "[OK]", c: "text-emerald-400", m: "Cron · auto-renewals checked" },
                { t: "[•]", c: "text-white/40", m: "awaiting authentication..." },
              ].map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`shrink-0 ${line.c}`}>{line.t}</span>
                  <span className="text-white/55 truncate">{line.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative px-8 lg:px-12 pb-8 lg:pb-10 flex items-center justify-between gap-4 text-[10.5px] text-white/40 font-mono">
          <p className="tnum">
            {now
              ? now.toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "---"}
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Uptime <span className="text-emerald-300 font-bold tabular-nums">99.97%</span></span>
            <span className="text-white/20">·</span>
            <span>© HS WEB</span>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-baseline gap-2 no-underline">
              <span className="text-[18px] font-extrabold tracking-[-0.035em] text-slate-900">HS WEB</span>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">Admin</span>
            </Link>
          </div>

          <div className="mb-7">
            <p className="text-[11px] font-black text-slate-400 tracking-[0.18em] uppercase mb-2">
              SIGN IN
            </p>
            <h2 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em]">
              다시 오셨네요.
            </h2>
            <p className="text-[13.5px] text-slate-500 mt-1.5">
              관리자 비밀번호로 콘솔에 접근하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="pw" className="text-[12px] font-bold text-slate-700">
                  비밀번호
                </label>
                {capsOn && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Caps Lock
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  id="pw"
                  ref={inputRef}
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyEvent}
                  onKeyUp={onKeyEvent}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 h-11 bg-white border border-slate-200 rounded-md text-slate-900 text-[14px] focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer bg-transparent border-0 transition-colors"
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-[12.5px] font-medium">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-11 inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-md font-bold text-sm border-0 cursor-pointer transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  인증 중...
                </>
              ) : (
                <>
                  로그인
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-[11.5px] text-slate-500">
            <Link href="/" className="hover:text-slate-900 no-underline inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              사이트 홈
            </Link>
            <span>비밀번호는 분실 시 서버 관리자에게 문의</span>
          </div>
        </div>
      </main>
    </div>
  );
}
