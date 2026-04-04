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

  // Steps: code → contract → done
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
      if (data.contract.status === "signed") {
        setStep("done");
      } else {
        setStep("contract");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  // Canvas drawing
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: e.nativeEvent.offsetX * scaleX, y: e.nativeEvent.offsetY * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSign = async () => {
    if (!agreed) { alert("계약 내용에 동의해주세요."); return; }
    if (!hasDrawn) { alert("서명을 해주세요."); return; }

    setSigning(true);
    const signature = canvasRef.current!.toDataURL("image/png");
    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signature }),
      });
      if (res.ok) setStep("done");
      else alert("서명 처리 중 오류가 발생했습니다.");
    } catch { alert("네트워크 오류가 발생했습니다."); }
    setSigning(false);
  };

  // Step 1: 인증 코드 입력
  if (step === "code") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900">전자 계약</h1>
            <p className="text-gray-500 text-sm mt-2">전달받은 인증 코드를 입력해주세요.</p>
          </div>

          <form onSubmit={handleCodeSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">인증 코드</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
              placeholder="6자리 숫자"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
            <button
              type="submit"
              disabled={code.length < 6 || loading}
              className="w-full mt-5 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "확인 중..." : "확인"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">HS WEB 전자 계약 시스템</p>
        </div>
      </div>
    );
  }

  // Step 3: 완료
  if (step === "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">서명이 완료되었습니다</h2>
          <p className="text-gray-500 text-sm">계약서 서명이 정상적으로 처리되었습니다.<br />감사합니다.</p>
          {contract?.client_signature && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">서명</p>
              <img src={contract.client_signature} alt="서명" className="h-16 mx-auto" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: 계약 내용 확인 + 서명
  if (!contract) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">전자 계약서</h1>
          <p className="text-gray-500 text-sm mt-1">{contract.contract_number}</p>
        </div>

        {/* 계약 당사자 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">계약 당사자</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">갑 (의뢰인)</p>
              <p className="font-semibold text-gray-900">{contract.client_name}</p>
              {contract.client_company && <p className="text-gray-500">{contract.client_company}</p>}
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">을 (수급인)</p>
              <p className="font-semibold text-gray-900">HS WEB</p>
              <p className="text-gray-500">대표: 심현수</p>
            </div>
          </div>
        </div>

        {/* 프로젝트 개요 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">프로젝트 개요</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">프로젝트명</span>
              <span className="font-medium text-gray-900">{contract.project_name}</span>
            </div>
            {contract.project_scope && (
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">제작 범위</span>
                <span className="font-medium text-gray-900">{contract.project_scope}</span>
              </div>
            )}
            {contract.start_date && (
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">기간</span>
                <span className="font-medium text-gray-900">{contract.start_date} ~ {contract.end_date || "협의"}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">계약 금액</span>
              <span className="font-bold text-gray-900 text-base">{fmtNum(contract.total_amount)}원</span>
            </div>
          </div>
        </div>

        {/* 결제 조건 */}
        {contract.payment_terms.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">결제 조건</h3>
            <div className="space-y-2">
              {contract.payment_terms.map((pt, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium text-gray-700">{pt.label}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{fmtNum(pt.amount)}원</span>
                    <span className="text-gray-400 text-xs ml-2">({pt.due})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 제작 사양 */}
        {contract.specs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">제작 사양</h3>
            <div className="space-y-2 text-sm">
              {contract.specs.map((s, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500 shrink-0">{s.label}</span>
                  <span className="font-medium text-gray-900 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 계약 조항 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">계약 조항</h3>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto pr-2">
            {contract.terms}
          </div>
        </div>

        {/* 서명 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">전자 서명</h3>

          <label className="flex items-start gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded"
            />
            <span className="text-sm text-gray-700">
              본인은 위 계약 내용을 확인하였으며, 이에 동의합니다.
            </span>
          </label>

          <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full bg-white cursor-crosshair touch-none"
              style={{ height: "120px" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">위 영역에 서명해주세요</p>
            <button onClick={clearCanvas} className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer bg-transparent border-none">
              서명 지우기
            </button>
          </div>

          <button
            onClick={handleSign}
            disabled={signing || !agreed || !hasDrawn}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {signing ? "서명 처리 중..." : "서명 완료"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">HS WEB 전자 계약 시스템</p>
      </div>
    </div>
  );
}
