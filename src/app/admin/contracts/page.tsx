"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "../components/AdminHeader";

interface LineItem { name: string; method: string; unitPrice: number; }
interface Spec { label: string; value: string; }
interface PaymentTerm { label: string; amount: number; due: string; }

interface Contract {
  id: string;
  contract_number: string;
  quotation_id: string | null;
  client_name: string;
  client_company: string;
  client_phone: string;
  client_email: string;
  project_name: string;
  project_scope: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_terms: PaymentTerm[];
  terms: string;
  items: LineItem[];
  specs: Spec[];
  sign_token: string;
  client_signature: string | null;
  signed_at: string | null;
  status: string;
  created_at: string;
}

interface Quotation {
  id: string;
  quote_number: string;
  quote_date: string;
  items: LineItem[];
  specs: Spec[];
  total: number;
  subtotal: number;
  include_vat: boolean;
}

const DEFAULT_TERMS = `제 1 조 (목적)
본 계약은 "갑"이 "을"에게 웹사이트 제작을 의뢰하고, "을"이 이를 수행함에 있어 필요한 사항을 정하는 것을 목적으로 합니다.

제 2 조 (제작 범위)
"을"은 본 계약에 명시된 제작 사양에 따라 웹사이트를 제작합니다.

제 3 조 (제작 기간)
제작 기간은 계약 체결일로부터 시작하며, 자료 전달 완료 후 기준으로 산정합니다.

제 4 조 (대금 지급)
"갑"은 본 계약에 명시된 결제 조건에 따라 대금을 지급합니다.

제 5 조 (수정 및 변경)
제작 범위 외 추가 작업 발생 시 별도 협의하며, 추가 비용이 발생할 수 있습니다.

제 6 조 (저작권)
완성된 결과물의 저작권은 잔금 지급 완료 후 "갑"에게 이전됩니다.

제 7 조 (유지보수)
납품 후 1개월간 무상 유지보수를 제공합니다.

제 8 조 (해제 및 해지)
일방이 계약을 해지할 경우, 진행 단계에 따라 비용을 정산합니다.`;

function fmtNum(n: number) { return n.toLocaleString(); }
function todayInput() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ContractsPage() {
  const [tab, setTab] = useState<"new" | "list">("new");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Form
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [startDate, setStartDate] = useState(todayInput);
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState<LineItem[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { label: "계약금 (50%)", amount: 0, due: "계약 체결 시" },
    { label: "잔금 (50%)", amount: 0, due: "납품 완료 시" },
  ]);
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  const fetchContracts = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/admin/contracts");
      if (res.ok) setContracts((await res.json()).contracts ?? []);
    } catch { /* */ }
    setListLoading(false);
  }, []);

  const fetchQuotations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/quotations");
      if (res.ok) setQuotations((await res.json()).quotations ?? []);
    } catch { /* */ }
  }, []);

  useEffect(() => {
    if (tab === "list") fetchContracts();
    else fetchQuotations();
  }, [tab, fetchContracts, fetchQuotations]);

  const loadFromQuotation = (qid: string) => {
    const q = quotations.find((x) => x.id === qid);
    if (!q) return;
    setSelectedQuotation(qid);
    setItems(q.items);
    setSpecs(q.specs);
    setTotalAmount(q.total);
    setProjectName(q.items[0]?.name || "웹사이트 제작");
    const half = Math.round(q.total / 2);
    setPaymentTerms([
      { label: "계약금 (50%)", amount: half, due: "계약 체결 시" },
      { label: "잔금 (50%)", amount: q.total - half, due: "납품 완료 시" },
    ]);
  };

  const handleCreate = async () => {
    if (!clientName || !projectName) {
      alert("고객명과 프로젝트명은 필수입니다.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotation_id: selectedQuotation || null,
          client_name: clientName,
          client_company: clientCompany,
          client_phone: clientPhone,
          client_email: clientEmail,
          project_name: projectName,
          project_scope: projectScope,
          start_date: startDate,
          end_date: endDate,
          total_amount: totalAmount,
          payment_terms: paymentTerms,
          terms,
          items,
          specs,
        }),
      });
      if (res.ok) {
        alert("계약서가 생성되었습니다.");
        setTab("list");
        fetchContracts();
      }
    } catch { /* */ }
    setSaving(false);
  };

  const deleteContract = async (id: string) => {
    if (!confirm("이 계약서를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/contracts/${id}`, { method: "DELETE" });
    fetchContracts();
  };

  const copyCode = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };


  const statusLabel: Record<string, { text: string; cls: string }> = {
    draft: { text: "임시", cls: "bg-gray-100 text-gray-600" },
    pending: { text: "서명 대기", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    signed: { text: "서명 완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  };

  const updatePaymentTerm = (idx: number, field: keyof PaymentTerm, value: string | number) => {
    setPaymentTerms((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">전자 계약</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">견적서 기반으로 계약서를 생성하고 전자 서명을 받으세요.</p>
          </div>
          {tab === "new" && (
            <button
              onClick={handleCreate}
              disabled={saving}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none shadow-sm disabled:opacity-50"
            >
              {saving ? "생성 중..." : "계약서 생성"}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { key: "new" as const, label: "새 계약서" },
            { key: "list" as const, label: "계약 내역" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${
                tab === t.key ? "bg-white text-[var(--color-dark)] shadow-sm" : "bg-transparent text-[var(--color-gray)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "list" ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            {listLoading ? (
              <div className="p-8 text-center text-[var(--color-gray)] text-sm">불러오는 중...</div>
            ) : contracts.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-gray)] text-sm">생성된 계약서가 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-[var(--color-gray)] font-medium text-xs">계약번호</th>
                      <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">고객</th>
                      <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">프로젝트</th>
                      <th className="text-right py-3 px-3 text-[var(--color-gray)] font-medium text-xs">금액</th>
                      <th className="text-center py-3 px-3 text-[var(--color-gray)] font-medium text-xs">상태</th>
                      <th className="text-center py-3 px-6 text-[var(--color-gray)] font-medium text-xs">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c) => {
                      const st = statusLabel[c.status] ?? statusLabel.draft;
                      return (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-6 font-medium text-[var(--color-dark)]">{c.contract_number}</td>
                          <td className="py-3 px-3 text-[var(--color-dark-2)]">{c.client_name}{c.client_company ? ` (${c.client_company})` : ""}</td>
                          <td className="py-3 px-3 text-[var(--color-dark-2)]">{c.project_name}</td>
                          <td className="py-3 px-3 text-right font-semibold text-[var(--color-dark)] tabular-nums">{fmtNum(c.total_amount)}원</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${st.cls}`}>{st.text}</span>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => copyCode(c.sign_token)}
                                className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer bg-transparent border-none text-[var(--color-accent)] hover:underline"
                              >
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[var(--color-dark)]">{c.sign_token}</span>
                                {copied === c.sign_token ? "복사됨!" : "복사"}
                              </button>
                              <button
                                onClick={() => deleteContract(c.id)}
                                className="text-xs text-red-500 font-semibold hover:underline cursor-pointer bg-transparent border-none"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 견적서 불러오기 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">견적서 불러오기</h3>
              <select
                value={selectedQuotation}
                onChange={(e) => loadFromQuotation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">견적서를 선택하세요 (선택사항)</option>
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quote_number} — {q.items[0]?.name || "항목 없음"} ({fmtNum(q.total)}원)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 고객 정보 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">고객 정보 (갑)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">고객명 *</label>
                    <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="홍길동" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">회사/상호</label>
                    <input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="(주)예시" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">연락처</label>
                    <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="010-0000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">이메일</label>
                    <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="email@example.com" />
                  </div>
                </div>
              </div>

              {/* 프로젝트 정보 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">프로젝트 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">프로젝트명 *</label>
                    <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="맞춤형 홈페이지 제작" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">제작 범위</label>
                    <input value={projectScope} onChange={(e) => setProjectScope(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="메인 + 내부 페이지 5P" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-gray)] mb-1">시작일</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-gray)] mb-1">완료 예정일</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">계약 금액</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={totalAmount ? fmtNum(totalAmount) : ""}
                        onChange={(e) => setTotalAmount(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm"
                        placeholder="1,000,000"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gray)]">원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 조건 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-dark)]">결제 조건</h3>
                <button
                  onClick={() => setPaymentTerms((prev) => [...prev, { label: "", amount: 0, due: "" }])}
                  className="text-xs text-[var(--color-accent)] font-semibold cursor-pointer bg-transparent border-none"
                >
                  + 추가
                </button>
              </div>
              <div className="space-y-3">
                {paymentTerms.map((pt, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-[var(--color-gray)] mb-1">항목</label>
                      <input value={pt.label} onChange={(e) => updatePaymentTerm(idx, "label", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="계약금" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-gray)] mb-1">금액</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={pt.amount ? fmtNum(pt.amount) : ""}
                          onChange={(e) => updatePaymentTerm(idx, "amount", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                          className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gray)]">원</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--color-gray)] mb-1">시기</label>
                        <input value={pt.due} onChange={(e) => updatePaymentTerm(idx, "due", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="계약 체결 시" />
                      </div>
                      {paymentTerms.length > 1 && (
                        <button
                          onClick={() => setPaymentTerms((prev) => prev.filter((_, i) => i !== idx))}
                          className="self-end pb-2 text-red-400 hover:text-red-600 cursor-pointer bg-transparent border-none text-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 계약 조항 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">계약 조항</h3>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y font-mono leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
