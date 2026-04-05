"use client";

import { useState, useRef } from "react";

interface PaymentTerm { label: string; amount: number; due: string; }
interface LineItem { name: string; method: string; unitPrice: number; }
interface Spec { label: string; value: string; }

interface Contract {
  contract_number: string;
  client_name: string;
  client_company: string;
  project_name: string;
  project_scope: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_terms: PaymentTerm[];
  terms: string;
  items: LineItem[];
  specs: Spec[];
  status: string;
  signed_at: string | null;
  client_signature: string | null;
  sign_token: string;
}

function fmtNum(n: number) { return n.toLocaleString(); }

export default function SignPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<"code" | "contract" | "done">("code");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/contracts/sign?token=${code.trim()}`);
      if (!res.ok) { setError("유효하지 않은 인증 코드입니다."); setLoading(false); return; }
      const data = await res.json();
      setContract(data.contract); setToken(code.trim());
      setStep(data.contract.status === "signed" ? "done" : "contract");
    } catch { setError("오류가 발생했습니다."); }
    setLoading(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!, r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: e.nativeEvent.offsetX * sx, y: e.nativeEvent.offsetY * sy };
  };
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setIsDrawing(true); setHasDrawn(true);
    const ctx = canvasRef.current!.getContext("2d")!, p = getPos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return; e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!, p = getPos(e);
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#0f172a";
    ctx.lineTo(p.x, p.y); ctx.stroke();
  };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => { canvasRef.current!.getContext("2d")!.clearRect(0, 0, 600, 200); setHasDrawn(false); };

  const handleSign = async () => {
    if (!agreed) { alert("계약 내용에 동의해주세요."); return; }
    if (!hasDrawn) { alert("서명을 해주세요."); return; }
    setSigning(true);
    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signature: canvasRef.current!.toDataURL("image/png") }),
      });
      if (res.ok) setStep("done"); else alert("서명 처리 중 오류가 발생했습니다.");
    } catch { alert("네트워크 오류가 발생했습니다."); }
    setSigning(false);
  };

  /* ════════ Step 1: 인증 코드 ════════ */
  if (step === "code") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        {/* bg noise */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="w-full max-w-[420px] relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-[#0f172a] font-black text-base">H</span>
              </div>
              <span className="text-white/90 font-bold text-lg tracking-tight">HS WEB</span>
            </div>
            <h1 className="text-white text-2xl font-bold">전자 계약 시스템</h1>
            <p className="text-white/40 text-sm mt-2">Electronic Contract Signing</p>
          </div>

          <form onSubmit={handleCodeSubmit} className="bg-white/[0.06] backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <p className="text-white/60 text-sm mb-6 text-center">전달받은 <span className="text-amber-300 font-semibold">인증 코드</span>를 입력해주세요.</p>
            <div className="flex justify-center gap-2.5 mb-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    code[i]
                      ? "bg-amber-400/20 border-2 border-amber-400/60 text-white"
                      : i === code.length
                      ? "bg-white/5 border-2 border-amber-400/40"
                      : "bg-white/5 border border-white/10 text-white/20"
                  }`}
                >
                  {code[i] || ""}
                </div>
              ))}
            </div>
            <input
              type="text" inputMode="numeric" maxLength={6} value={code}
              onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
              className="opacity-0 absolute -z-10" autoFocus
            />
            <div
              className="cursor-text -mt-[72px] h-[72px] relative z-10"
              onClick={() => document.querySelector<HTMLInputElement>("input[inputmode='numeric']")?.focus()}
            />
            {error && (
              <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
            )}
            <button
              type="submit" disabled={code.length < 6 || loading}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f172a] rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "확인 중..." : "계약서 열기"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-white/25">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            Secured Connection
          </div>
        </div>
      </div>
    );
  }

  /* ════════ Step 3: 완료 ════════ */
  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">계약 체결 완료</h2>
          <p className="text-gray-500 text-sm">전자 서명이 정상적으로 처리되었습니다.</p>
          {contract?.client_signature && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">전자 서명</p>
              <div className="inline-block border border-gray-100 rounded-xl p-4 bg-gray-50">
                <img src={contract.client_signature} alt="서명" className="h-14" />
              </div>
              <p className="text-xs text-gray-400 mt-3">{contract.contract_number}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ════════ Step 2: 계약서 본문 ════════ */
  if (!contract) return null;

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Dark Header */}
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-[#0f172a] font-black text-xs">H</span>
              </div>
              <span className="text-white/80 font-semibold text-sm">HS WEB</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              서명 대기
            </div>
          </div>
          {/* Title */}
          <div className="py-12 text-center">
            <p className="text-amber-400/80 text-[0.7rem] font-semibold tracking-[0.3em] uppercase mb-3">Web Development Contract</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">웹사이트 제작 계약서</h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="h-px w-12 bg-white/20" />
              <span className="text-white/30 text-xs font-mono">{contract.contract_number}</span>
              <span className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-1">
        <div className="bg-white rounded-t-3xl shadow-sm border border-gray-200/60 border-b-0">
          {/* 계약 당사자 */}
          <div className="p-8 border-b border-gray-100">
            <p className="text-[0.65rem] text-amber-600 font-bold tracking-[0.2em] uppercase mb-5">Article 1 — 계약 당사자</p>
            <div className="grid grid-cols-2 gap-5">
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60">
                <span className="absolute top-3 right-4 text-[0.6rem] text-slate-400 font-semibold tracking-wider uppercase">갑</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{contract.client_name}</p>
                {contract.client_company && <p className="text-sm text-slate-500 mt-0.5">{contract.client_company}</p>}
              </div>
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60">
                <span className="absolute top-3 right-4 text-[0.6rem] text-slate-400 font-semibold tracking-wider uppercase">을</span>
                <p className="text-lg font-bold text-slate-900 mt-1">HS WEB</p>
                <p className="text-sm text-slate-500 mt-0.5">대표 심현수</p>
              </div>
            </div>
          </div>

          {/* 프로젝트 개요 */}
          <div className="p-8 border-b border-gray-100">
            <p className="text-[0.65rem] text-amber-600 font-bold tracking-[0.2em] uppercase mb-5">Article 2 — 프로젝트 개요</p>
            <div className="space-y-0">
              {[
                { l: "프로젝트명", v: contract.project_name },
                ...(contract.project_scope ? [{ l: "제작 범위", v: contract.project_scope }] : []),
                ...(contract.start_date ? [{ l: "제작 기간", v: `${contract.start_date} ~ ${contract.end_date || "협의"}` }] : []),
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-dashed border-gray-100 last:border-0">
                  <span className="text-sm text-slate-500">{r.l}</span>
                  <span className="text-sm font-semibold text-slate-900">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-[#0f172a] rounded-2xl p-5 flex items-center justify-between">
              <span className="text-white/60 text-sm font-medium">계약 금액 (VAT 포함)</span>
              <span className="text-white text-2xl font-bold tracking-tight">{fmtNum(contract.total_amount)}<span className="text-base font-semibold ml-0.5">원</span></span>
            </div>
          </div>

          {/* 결제 조건 */}
          {contract.payment_terms.length > 0 && (
            <div className="p-8 border-b border-gray-100">
              <p className="text-[0.65rem] text-amber-600 font-bold tracking-[0.2em] uppercase mb-5">Article 3 — 결제 조건</p>
              <div className="space-y-3">
                {contract.payment_terms.map((pt, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{pt.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{pt.due}</p>
                    </div>
                    <span className="text-base font-bold text-slate-900 tabular-nums">{fmtNum(pt.amount)}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제작 사양 */}
          {contract.specs.length > 0 && (
            <div className="p-8 border-b border-gray-100">
              <p className="text-[0.65rem] text-amber-600 font-bold tracking-[0.2em] uppercase mb-5">Article 4 — 제작 사양</p>
              <div className="space-y-0">
                {contract.specs.map((s, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-dashed border-gray-100 last:border-0">
                    <span className="text-sm text-slate-500 shrink-0">{s.label}</span>
                    <span className="text-sm font-medium text-slate-900 text-right ml-4">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 계약 조항 */}
          <div className="p-8 border-b border-gray-100">
            <p className="text-[0.65rem] text-amber-600 font-bold tracking-[0.2em] uppercase mb-5">Article 5 — 계약 조항</p>
            <div className="text-[0.85rem] text-slate-600 leading-[1.8] whitespace-pre-line max-h-80 overflow-y-auto pr-2">
              {contract.terms}
            </div>
          </div>
        </div>

        {/* 서명 영역 — 카드 하단에 연결 */}
        <div className="bg-white border border-gray-200/60 border-t-0 rounded-b-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">전자 서명</p>
                <p className="text-white/40 text-xs">Electronic Signature</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* 동의 */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? "bg-[#0f172a] border-[#0f172a]" : "border-slate-300 group-hover:border-slate-400"}`}>
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
              <span className="text-sm text-slate-600 leading-relaxed">
                본인 <strong className="text-slate-900">{contract.client_name}</strong>은(는) 위 계약 내용을 모두 확인하였으며, 이에 동의합니다.
              </span>
            </label>

            {/* 서명 캔버스 */}
            <p className="text-xs text-slate-400 mb-2 font-medium">서명란</p>
            <div className={`border-2 rounded-2xl overflow-hidden transition-all ${hasDrawn ? "border-[#0f172a]/30" : "border-dashed border-slate-200"}`}>
              <canvas
                ref={canvasRef} width={600} height={200}
                className="w-full bg-[#fafaf8] cursor-crosshair touch-none"
                style={{ height: "150px" }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              />
            </div>
            <div className="flex items-center justify-between mt-2 mb-6">
              <p className="text-[0.7rem] text-slate-400">{contract.client_name} 님의 자필 서명</p>
              {hasDrawn && (
                <button onClick={clearCanvas} className="text-xs text-slate-400 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors">
                  다시 서명
                </button>
              )}
            </div>

            {/* 서명 버튼 */}
            <button
              onClick={handleSign} disabled={signing || !agreed || !hasDrawn}
              className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-[0.95rem] hover:bg-[#1e293b] transition-all cursor-pointer border-none disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {signing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  처리 중...
                </span>
              ) : "서명하고 계약 체결"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-10 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            암호화된 전자 계약 · 법적 효력을 가지는 전자 서명
          </div>
          <p className="text-[0.65rem] text-slate-300">Powered by HS WEB Electronic Contract System</p>
        </div>
      </div>
    </div>
  );
}
