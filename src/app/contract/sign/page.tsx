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

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
        <span className="text-white font-black text-sm">H</span>
      </div>
      <span className="font-bold text-gray-900">HS WEB</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
      <span className="w-1 h-4 bg-blue-600 rounded-full" />
      {children}
    </h3>
  );
}

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
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/sign?token=${code.trim()}`);
      if (!res.ok) { setError("유효하지 않은 인증 코드입니다."); setLoading(false); return; }
      const data = await res.json();
      setContract(data.contract);
      setToken(code.trim());
      setStep(data.contract.status === "signed" ? "done" : "contract");
    } catch { setError("오류가 발생했습니다."); }
    setLoading(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: e.nativeEvent.offsetX * scaleX, y: e.nativeEvent.offsetY * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setIsDrawing(true); setHasDrawn(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return; e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e); ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1a1a1a";
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => {
    const c = canvasRef.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setHasDrawn(false);
  };

  const handleSign = async () => {
    if (!agreed) { alert("계약 내용에 동의해주세요."); return; }
    if (!hasDrawn) { alert("서명을 해주세요."); return; }
    setSigning(true);
    const signature = canvasRef.current!.toDataURL("image/png");
    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signature }),
      });
      if (res.ok) setStep("done");
      else alert("서명 처리 중 오류가 발생했습니다.");
    } catch { alert("네트워크 오류가 발생했습니다."); }
    setSigning(false);
  };

  // ─── Step 1: 인증 코드 ───
  if (step === "code") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">전자 계약</h1>
            <p className="text-gray-400 text-sm mt-2">HS WEB Electronic Contract System</p>
          </div>

          <form onSubmit={handleCodeSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <p className="text-sm text-gray-600 mb-5 text-center">전달받은 <strong>인증 코드</strong>를 입력해주세요.</p>
            <div className="flex justify-center gap-2 mb-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-11 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    code[i]
                      ? "border-blue-500 bg-blue-50/50 text-gray-900"
                      : i === code.length
                      ? "border-blue-400 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {code[i] || ""}
                </div>
              ))}
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
              className="opacity-0 absolute -z-10"
              autoFocus
              onFocus={() => {}}
            />
            {/* Invisible input → visible boxes 클릭 시 포커스 */}
            <div
              className="cursor-text -mt-[72px] h-[72px] relative z-10"
              onClick={() => {
                const inp = document.querySelector<HTMLInputElement>("input[inputmode='numeric']");
                inp?.focus();
              }}
            />
            {error && (
              <div className="flex items-center gap-2 mt-3 text-red-500 text-sm justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={code.length < 6 || loading}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  확인 중...
                </span>
              ) : "계약서 확인"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            암호화된 안전한 연결
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 3: 완료 ───
  if (step === "done") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl shadow-gray-200/50 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">서명 완료</h2>
          <p className="text-gray-500 text-sm leading-relaxed">계약서 서명이 정상적으로 처리되었습니다.<br />감사합니다.</p>

          {contract?.client_signature && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">전자 서명</p>
              <div className="inline-block border border-gray-100 rounded-xl p-3 bg-gray-50">
                <img src={contract.client_signature} alt="서명" className="h-12" />
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400">
            {contract?.contract_number}
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 2: 계약 내용 + 서명 ───
  if (!contract) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            서명 대기 중
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="text-center py-4">
          <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase mb-2">Electronic Contract</p>
          <h1 className="text-3xl font-bold text-gray-900">웹사이트 제작 계약서</h1>
          <p className="text-gray-400 text-sm mt-2 font-mono">{contract.contract_number}</p>
        </div>

        {/* 계약 당사자 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <SectionTitle>계약 당사자</SectionTitle>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider font-semibold mb-2">갑 (의뢰인)</p>
              <p className="font-bold text-gray-900">{contract.client_name}</p>
              {contract.client_company && <p className="text-gray-500 text-sm mt-0.5">{contract.client_company}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider font-semibold mb-2">을 (수급인)</p>
              <p className="font-bold text-gray-900">HS WEB</p>
              <p className="text-gray-500 text-sm mt-0.5">대표: 심현수</p>
            </div>
          </div>
        </div>

        {/* 프로젝트 개요 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <SectionTitle>프로젝트 개요</SectionTitle>
          <div className="space-y-0">
            {[
              { l: "프로젝트명", v: contract.project_name },
              ...(contract.project_scope ? [{ l: "제작 범위", v: contract.project_scope }] : []),
              ...(contract.start_date ? [{ l: "제작 기간", v: `${contract.start_date} ~ ${contract.end_date || "협의"}` }] : []),
            ].map((row, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{row.l}</span>
                <span className="text-sm font-semibold text-gray-900">{row.v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 mt-1 bg-blue-50 rounded-xl px-4 -mx-1">
              <span className="text-sm font-semibold text-blue-700">계약 금액</span>
              <span className="text-xl font-bold text-blue-700">{fmtNum(contract.total_amount)}원</span>
            </div>
          </div>
        </div>

        {/* 결제 조건 */}
        {contract.payment_terms.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <SectionTitle>결제 조건</SectionTitle>
            <div className="space-y-2">
              {contract.payment_terms.map((pt, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{pt.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{fmtNum(pt.amount)}원</span>
                    <span className="text-xs text-gray-400 ml-2">({pt.due})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 제작 사양 */}
        {contract.specs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <SectionTitle>제작 사��</SectionTitle>
            <div className="space-y-0">
              {contract.specs.map((s, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500 shrink-0">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right ml-4">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 계약 조항 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <SectionTitle>계약 조항</SectionTitle>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto pr-2 scrollbar-thin">
            {contract.terms}
          </div>
        </div>

        {/* 서명 영역 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              전자 서명
            </h3>
          </div>
          <div className="p-6">
            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
              <span className="text-sm text-gray-700 leading-relaxed">
                본인은 위 계약 내용을 모두 확인하였으며, 이에 <strong className="text-gray-900">동의</strong>합니다.
              </span>
            </label>

            <div className={`border-2 border-dashed rounded-2xl overflow-hidden mb-3 transition-colors ${hasDrawn ? "border-blue-300 bg-blue-50/20" : "border-gray-200"}`}>
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full bg-white cursor-crosshair touch-none"
                style={{ height: "140px" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                위 영역에 서명해주세요
              </p>
              <button onClick={clearCanvas} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors">
                다시 그리기
              </button>
            </div>

            <button
              onClick={handleSign}
              disabled={signing || !agreed || !hasDrawn}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {signing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  서명 처리 중...
                </span>
              ) : "서명하고 계약 체결하기"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            암호화된 안전한 전자 계약 시스템
          </div>
          <p className="text-xs text-gray-300">Powered by HS WEB</p>
        </div>
      </div>
    </div>
  );
}
