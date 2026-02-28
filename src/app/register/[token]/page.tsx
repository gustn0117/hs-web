"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Animated background particles                                      */
/* ------------------------------------------------------------------ */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.o})`;
        ctx.fill();
      }
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */
function StepIndicator({ current }: { current: number }) {
  const steps = ["계정 정보", "연락처", "완료"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < current
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : i === current
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < current ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-[10px] mt-1.5 font-medium transition-colors ${
              i <= current ? "text-white/80" : "text-white/30"
            }`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 sm:w-16 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${
              i < current ? "bg-emerald-400" : "bg-white/10"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Password strength meter                                            */
/* ------------------------------------------------------------------ */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "매우 약함", color: "bg-red-500", width: "w-1/5" },
    { label: "약함", color: "bg-orange-500", width: "w-2/5" },
    { label: "보통", color: "bg-yellow-500", width: "w-3/5" },
    { label: "강함", color: "bg-blue-500", width: "w-4/5" },
    { label: "매우 강함", color: "bg-emerald-500", width: "w-full" },
  ];
  const level = levels[Math.min(score, 4)];

  return (
    <div className="mt-2">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${level.color} ${level.width}`} />
      </div>
      <p className={`text-[10px] mt-1 ${score <= 1 ? "text-red-400" : score <= 2 ? "text-yellow-500" : "text-emerald-400"}`}>
        {level.label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done">("loading");
  const [clientName, setClientName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

  const goNextStep = () => {
    setFormError("");
    if (step === 0) {
      if (!form.username.trim()) { setFormError("아이디를 입력해주세요."); return; }
      if (form.username.length < 3) { setFormError("아이디는 3자 이상이어야 합니다."); return; }
      if (!form.password) { setFormError("비밀번호를 입력해주세요."); return; }
      if (form.password.length < 6) { setFormError("비밀번호는 6자 이상이어야 합니다."); return; }
      if (form.password !== form.passwordConfirm) { setFormError("비밀번호가 일치하지 않습니다."); return; }
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

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
        setStep(2);
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
    "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[0.95rem] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/10 transition-all placeholder:text-white/30 backdrop-blur-sm";
  const labelClass = "block text-white/60 text-xs font-medium mb-2 tracking-wide uppercase";

  /* Loading ---------------------------------------------------------- */
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-full border-2 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-white/40 text-sm tracking-wide">초대 링크 확인 중...</p>
        </div>
      </div>
    );
  }

  /* Invalid token ---------------------------------------------------- */
  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <FloatingParticles />
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center ring-1 ring-red-500/20">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">링크를 사용할 수 없습니다</h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">{errorMsg}</p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/30 text-xs leading-relaxed">
                초대 링크가 만료되었거나 이미 사용되었을 수 있습니다.<br />
                관리자에게 새 초대 링크를 요청해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Done ------------------------------------------------------------- */
  if (status === "done") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <FloatingParticles />
        <div className="relative z-10 max-w-md w-full">
          <StepIndicator current={2} />
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/10 rounded-full flex items-center justify-center ring-1 ring-emerald-500/20 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping" />
              <svg className="w-10 h-10 text-emerald-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">등록이 완료되었습니다</h1>
            <p className="text-white/50 text-sm mb-8">
              <span className="text-blue-400 font-medium">{form.username}</span> 계정으로 로그인할 수 있습니다.
            </p>
            <button
              onClick={() => router.push("/client")}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Valid - Registration form ---------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
      <FloatingParticles />
      <div className="relative z-10 max-w-md w-full">
        {/* Logo + welcome */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-5 backdrop-blur-sm">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">
              HS
            </div>
            <span className="text-white/50 text-xs font-medium tracking-wider">HS WEB</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            환영합니다, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{clientName}</span>님
          </h1>
          <p className="text-white/40 text-sm">프로젝트 관리를 위한 계정을 등록해주세요</p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {formError && (
            <div className="px-4 py-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-2.5 backdrop-blur-sm">
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {formError}
            </div>
          )}

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>아이디</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="3자 이상 영문, 숫자"
                    className={`${inputClass} pl-11`}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>비밀번호</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="6자 이상"
                    className={`${inputClass} pl-11 pr-11`}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer p-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                      )}
                    </svg>
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>
              <div>
                <label className={labelClass}>비밀번호 확인</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </span>
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={form.passwordConfirm}
                    onChange={(e) => setForm((p) => ({ ...p, passwordConfirm: e.target.value }))}
                    placeholder="비밀번호를 다시 입력"
                    className={`${inputClass} pl-11 pr-11`}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer p-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {showPasswordConfirm ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                      )}
                    </svg>
                  </button>
                </div>
                {form.passwordConfirm && form.password !== form.passwordConfirm && (
                  <p className="text-red-400 text-[10px] mt-1.5">비밀번호가 일치하지 않습니다</p>
                )}
                {form.passwordConfirm && form.password === form.passwordConfirm && form.password.length >= 6 && (
                  <p className="text-emerald-400 text-[10px] mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    일치합니다
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={goNextStep}
                className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                다음 단계
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-2">
                <p className="text-white/30 text-xs text-center">선택 사항입니다. 나중에 입력할 수도 있습니다.</p>
              </div>
              <div>
                <label className={labelClass}>이메일</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    className={`${inputClass} pl-11`}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>전화번호</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="010-0000-0000"
                    className={`${inputClass} pl-11`}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setStep(0); setFormError(""); }}
                  className="px-5 py-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-semibold cursor-pointer transition-all hover:bg-white/10 hover:text-white/70 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  이전
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold border-none cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      등록 중...
                    </>
                  ) : (
                    <>
                      등록 완료
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/15 text-xs mt-6 tracking-wide">
          HS WEB Client Portal
        </p>
      </div>
    </div>
  );
}
