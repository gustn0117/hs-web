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
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#111";
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

  /* ═══ Step 1: 인증 코드 ═══ */
  if (step === "code") {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <p className="text-[0.7rem] text-[#8a7e6b] tracking-[0.3em] uppercase font-medium mb-2">HS WEB</p>
            <h1 className="text-xl font-bold text-[#2c2418]">전자 계약 시스템</h1>
          </div>
          <form onSubmit={handleCodeSubmit} className="bg-white rounded-xl p-8 border border-[#e5ddd0] shadow-sm">
            <p className="text-sm text-[#6b5d4d] mb-5 text-center">전달받은 인증 코드를 입력해주세요.</p>
            <input
              type="text" inputMode="numeric" maxLength={6} value={code}
              onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
              placeholder="000000"
              className="w-full px-4 py-3 border border-[#d4cbbf] rounded-lg text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-[#8a7e6b] bg-[#faf8f5] text-[#2c2418]"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
            <button
              type="submit" disabled={code.length < 6 || loading}
              className="w-full mt-5 py-3 bg-[#2c2418] text-white rounded-lg font-semibold text-sm hover:bg-[#3d3226] transition-colors cursor-pointer border-none disabled:opacity-30"
            >
              {loading ? "확인 중..." : "계약서 열기"}
            </button>
          </form>
          <p className="text-center text-[0.65rem] text-[#b0a694] mt-6">Secured Electronic Contract System</p>
        </div>
      </div>
    );
  }

  /* ═══ Step 3: 완료 ═══ */
  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center px-6">
        <div className="bg-white rounded-xl p-10 border border-[#e5ddd0] text-center max-w-md w-full">
          <div className="w-16 h-16 border-2 border-[#2c2418] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#2c2418]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#2c2418] mb-2">계약 체결 완료</h2>
          <p className="text-[#8a7e6b] text-sm">전자 서명이 정상적으로 처리되었습니다.</p>
          {contract?.client_signature && (
            <div className="mt-8 pt-6 border-t border-[#e5ddd0]">
              <p className="text-xs text-[#b0a694] mb-3">전자 서명</p>
              <img src={contract.client_signature} alt="서명" className="h-14 mx-auto" />
              <p className="text-xs text-[#b0a694] mt-4">{contract.contract_number}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══ Step 2: 계약서 본문 ═══ */
  if (!contract) return null;

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="min-h-screen bg-[#f5f3ef] py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-[720px] mx-auto">
        {/* ── 계약서 용지 ── */}
        <div className="bg-white border border-[#d4cbbf] shadow-sm print:border-none print:shadow-none">

          {/* 상단 */}
          <div className="px-12 pt-12 pb-8 border-b-2 border-[#2c2418]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.65rem] text-[#8a7e6b] tracking-[0.2em] uppercase">HS WEB · Web Agency</p>
              </div>
              <div className="text-right">
                <p className="text-[0.65rem] text-[#8a7e6b]">계약번호</p>
                <p className="text-xs font-mono text-[#2c2418]">{contract.contract_number}</p>
              </div>
            </div>
            <div className="text-center mt-8 mb-2">
              <h1 className="text-3xl font-bold text-[#2c2418] tracking-[0.15em]">계 약 서</h1>
              <p className="text-[0.7rem] text-[#8a7e6b] mt-1.5 tracking-[0.2em]">CONTRACT</p>
            </div>
          </div>

          {/* 본문 */}
          <div className="px-12 py-8 text-[0.9rem] text-[#333] leading-[1.9]">

            {/* 전문 */}
            <p className="mb-6">
              <strong className="text-[#2c2418]">{contract.client_name}</strong>
              {contract.client_company && <span> ({contract.client_company})</span>}
              (이하 &ldquo;갑&rdquo;이라 한다)과 <strong className="text-[#2c2418]">HS WEB</strong> (대표 심현수, 이하 &ldquo;을&rdquo;이라 한다)은 아래와 같이 웹사이트 제작에 관한 계약을 체결한다.
            </p>

            <div className="w-full h-px bg-[#e5ddd0] my-6" />

            {/* 제1조 */}
            <h2 className="text-base font-bold text-[#2c2418] mb-3">제 1 조 (프로젝트 개요)</h2>
            <table className="w-full mb-6 text-sm border-collapse">
              <tbody>
                <tr className="border-b border-[#e5ddd0]">
                  <td className="py-2.5 text-[#8a7e6b] w-28">프로젝트명</td>
                  <td className="py-2.5 font-medium text-[#2c2418]">{contract.project_name}</td>
                </tr>
                {contract.project_scope && (
                  <tr className="border-b border-[#e5ddd0]">
                    <td className="py-2.5 text-[#8a7e6b]">제작 범위</td>
                    <td className="py-2.5 font-medium text-[#2c2418]">{contract.project_scope}</td>
                  </tr>
                )}
                {contract.start_date && (
                  <tr className="border-b border-[#e5ddd0]">
                    <td className="py-2.5 text-[#8a7e6b]">제작 기간</td>
                    <td className="py-2.5 font-medium text-[#2c2418]">{contract.start_date} ~ {contract.end_date || "협의"}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2.5 text-[#8a7e6b]">계약 금액</td>
                  <td className="py-2.5 font-bold text-[#2c2418] text-base">{fmtNum(contract.total_amount)}원 (VAT 포함)</td>
                </tr>
              </tbody>
            </table>

            {/* 제2조 결제 조건 */}
            {contract.payment_terms.length > 0 && (
              <>
                <h2 className="text-base font-bold text-[#2c2418] mb-3">제 2 조 (대금 지급)</h2>
                <p className="mb-3">&ldquo;갑&rdquo;은 아래의 일정에 따라 대금을 지급한다.</p>
                <table className="w-full mb-6 text-sm border-collapse border border-[#d4cbbf]">
                  <thead>
                    <tr className="bg-[#f5f3ef]">
                      <th className="py-2 px-3 text-left border border-[#d4cbbf] text-[#8a7e6b] font-semibold text-xs">구분</th>
                      <th className="py-2 px-3 text-right border border-[#d4cbbf] text-[#8a7e6b] font-semibold text-xs">금액</th>
                      <th className="py-2 px-3 text-left border border-[#d4cbbf] text-[#8a7e6b] font-semibold text-xs">지급 시기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.payment_terms.map((pt, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 border border-[#d4cbbf] font-medium text-[#2c2418]">{pt.label}</td>
                        <td className="py-2 px-3 border border-[#d4cbbf] text-right font-bold text-[#2c2418] tabular-nums">{fmtNum(pt.amount)}원</td>
                        <td className="py-2 px-3 border border-[#d4cbbf] text-[#6b5d4d]">{pt.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* 제작 사양 */}
            {contract.specs.length > 0 && (
              <>
                <h2 className="text-base font-bold text-[#2c2418] mb-3">제 3 조 (제작 사양)</h2>
                <table className="w-full mb-6 text-sm border-collapse border border-[#d4cbbf]">
                  <tbody>
                    {contract.specs.map((s, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 border border-[#d4cbbf] bg-[#f5f3ef] text-[#8a7e6b] font-semibold w-28 text-xs">{s.label}</td>
                        <td className="py-2 px-3 border border-[#d4cbbf] text-[#2c2418]">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* 계약 조항 */}
            <h2 className="text-base font-bold text-[#2c2418] mb-3">제 4 조 ~ (일반 조항)</h2>
            <div className="text-[0.85rem] text-[#4a4035] leading-[1.9] whitespace-pre-line mb-6 max-h-80 overflow-y-auto print:max-h-none">
              {contract.terms}
            </div>

            <div className="w-full h-px bg-[#e5ddd0] my-6" />

            {/* 날짜 */}
            <p className="text-center text-sm text-[#6b5d4d] mb-8">
              {dateStr}
            </p>

            {/* 당사자 서명란 */}
            <div className="grid grid-cols-2 gap-8 mb-2">
              <div className="text-center">
                <p className="text-xs text-[#8a7e6b] mb-3 font-semibold tracking-wider">갑 (의뢰인)</p>
                <div className="border-b-2 border-[#2c2418] pb-2 mb-2 min-h-[60px] flex items-end justify-center">
                  {/* 클라이언트 서명이 들어갈 자리 */}
                </div>
                <p className="text-sm font-bold text-[#2c2418]">{contract.client_name}</p>
                {contract.client_company && <p className="text-xs text-[#8a7e6b]">{contract.client_company}</p>}
              </div>
              <div className="text-center">
                <p className="text-xs text-[#8a7e6b] mb-3 font-semibold tracking-wider">을 (수급인)</p>
                <div className="border-b-2 border-[#2c2418] pb-2 mb-2 min-h-[60px] flex items-end justify-center">
                  <p className="text-lg font-bold text-[#2c2418] italic">HS WEB</p>
                </div>
                <p className="text-sm font-bold text-[#2c2418]">심현수</p>
                <p className="text-xs text-[#8a7e6b]">HS WEB 대표</p>
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="px-12 py-4 bg-[#f5f3ef] border-t border-[#e5ddd0] text-center">
            <p className="text-[0.6rem] text-[#b0a694]">HS WEB | 본 계약서는 전자 서명을 통해 법적 효력을 가집니다.</p>
          </div>
        </div>

        {/* ── 서명 영역 (계약서 용지 밖) ── */}
        <div className="mt-6 bg-white border border-[#d4cbbf] rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 bg-[#2c2418]">
            <p className="text-white font-semibold text-sm">전자 서명</p>
            <p className="text-white/50 text-xs mt-0.5">아래에 서명하면 위 계약에 동의하는 것으로 간주됩니다.</p>
          </div>
          <div className="px-8 py-6">
            {/* 동의 */}
            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? "bg-[#2c2418] border-[#2c2418]" : "border-[#c4b9a8] group-hover:border-[#8a7e6b]"}`}>
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
              <span className="text-sm text-[#4a4035] leading-relaxed">
                본인 <strong>{contract.client_name}</strong>은(는) 위 계약 내용을 확인하였으며, 이에 동의합니다.
              </span>
            </label>

            {/* 캔버스 */}
            <p className="text-[0.7rem] text-[#8a7e6b] mb-1.5 font-medium">서명란</p>
            <div className={`border rounded-lg overflow-hidden transition-colors ${hasDrawn ? "border-[#2c2418]" : "border-[#d4cbbf]"}`}>
              <canvas
                ref={canvasRef} width={600} height={200}
                className="w-full cursor-crosshair touch-none"
                style={{ height: "130px", background: "#fdfcfa" }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 mb-5">
              <p className="text-[0.65rem] text-[#b0a694]">{contract.client_name} 자필 서명</p>
              {hasDrawn && (
                <button onClick={clearCanvas} className="text-[0.7rem] text-[#8a7e6b] hover:text-red-600 cursor-pointer bg-transparent border-none transition-colors">
                  다시 서명
                </button>
              )}
            </div>

            <button
              onClick={handleSign} disabled={signing || !agreed || !hasDrawn}
              className="w-full py-3.5 bg-[#2c2418] text-white rounded-lg font-semibold text-sm hover:bg-[#3d3226] transition-colors cursor-pointer border-none disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {signing ? "처리 중..." : "서명 완료"}
            </button>
          </div>
        </div>

        <p className="text-center text-[0.6rem] text-[#b0a694] mt-6 mb-4">HS WEB Electronic Contract System</p>
      </div>
    </div>
  );
}
