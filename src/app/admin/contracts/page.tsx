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
  sign_ip: string | null;
  sign_user_agent: string | null;
  content_hash: string | null;
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
  const [detail, setDetail] = useState<Contract | null>(null);

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
    setCopied("code-" + token);
    setTimeout(() => setCopied(null), 2000);
  };

  const copySignLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/contract/sign`);
    setCopied("link");
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
                      <th className="text-center py-3 px-3 text-[var(--color-gray)] font-medium text-xs">인증 코드</th>
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
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => copyCode(c.sign_token)}
                              className="inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
                            >
                              <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg text-[var(--color-dark)] font-bold tracking-widest">{c.sign_token}</span>
                              <span className="text-xs text-[var(--color-accent)] font-semibold">{copied === "code-" + c.sign_token ? "복사됨!" : "복사"}</span>
                            </button>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => setDetail(c)}
                                className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                              >
                                상세
                              </button>
                              <button
                                onClick={copySignLink}
                                className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                              >
                                {copied === "link" ? "링크 복사됨!" : "서명 링크 복사"}
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

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-[var(--color-dark)]">{detail.contract_number}</h3>
                <p className="text-xs text-[var(--color-gray)] mt-0.5">{detail.client_name}{detail.client_company ? ` · ${detail.client_company}` : ""}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-[var(--color-gray)] hover:text-[var(--color-dark)] cursor-pointer bg-transparent border-none text-xl">×</button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* 요약 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-[var(--color-gray)]">프로젝트</p>
                  <p className="text-sm font-semibold text-[var(--color-dark)] mt-0.5">{detail.project_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-[var(--color-gray)]">계약 금액</p>
                  <p className="text-sm font-bold text-[var(--color-dark)] mt-0.5">{fmtNum(detail.total_amount)}원</p>
                </div>
                {detail.start_date && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-[var(--color-gray)]">기간</p>
                    <p className="text-sm font-medium text-[var(--color-dark)] mt-0.5">{detail.start_date} ~ {detail.end_date || "협의"}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-[var(--color-gray)]">상태</p>
                  <p className="mt-0.5">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${(statusLabel[detail.status] ?? statusLabel.draft).cls}`}>
                      {(statusLabel[detail.status] ?? statusLabel.draft).text}
                    </span>
                  </p>
                </div>
              </div>

              {/* 결제 조건 */}
              {detail.payment_terms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--color-gray)] mb-2">결제 조건</p>
                  <div className="space-y-1.5">
                    {detail.payment_terms.map((pt, i) => (
                      <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-[var(--color-dark-2)]">{pt.label}</span>
                        <span className="font-semibold text-[var(--color-dark)]">{fmtNum(pt.amount)}원 <span className="text-xs text-[var(--color-gray)] font-normal">({pt.due})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 연락처 */}
              {(detail.client_phone || detail.client_email) && (
                <div>
                  <p className="text-xs font-semibold text-[var(--color-gray)] mb-2">고객 연락처</p>
                  <div className="text-sm text-[var(--color-dark-2)] space-y-1">
                    {detail.client_phone && <p>{detail.client_phone}</p>}
                    {detail.client_email && <p>{detail.client_email}</p>}
                  </div>
                </div>
              )}

              {/* 서명 */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-gray)] mb-2">전자 서명</p>
                {detail.status === "signed" && detail.client_signature ? (
                  <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">서명 완료</span>
                      {detail.signed_at && <span className="text-xs text-emerald-600 ml-auto">{new Date(detail.signed_at).toLocaleString("ko-KR")}</span>}
                    </div>
                    <div className="bg-white rounded-lg border border-emerald-100 p-3 flex items-center justify-center">
                      <img src={detail.client_signature} alt="고객 서명" className="h-20 max-w-full" />
                    </div>
                    <p className="text-xs text-emerald-600 mt-2 text-center">{detail.client_name} 님의 전자 서명</p>

                    {/* 서명 증거 */}
                    <div className="mt-3 pt-3 border-t border-emerald-200 space-y-1.5 text-xs text-emerald-700/70">
                      <p className="font-semibold text-emerald-700 text-[0.7rem]">서명 증거 (Legal Evidence)</p>
                      {detail.signed_at && <p>서명 일시: {new Date(detail.signed_at).toLocaleString("ko-KR")}</p>}
                      {detail.sign_ip && <p>서명자 IP: {detail.sign_ip}</p>}
                      {detail.sign_user_agent && <p className="truncate">브라우저: {detail.sign_user_agent}</p>}
                      {detail.content_hash && <p className="font-mono break-all">무결성 해시: {detail.content_hash}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">서명 대기 중</p>
                      <p className="text-xs text-amber-600 mt-0.5">고객에게 인증 코드 <strong className="font-mono">{detail.sign_token}</strong>을 전달해주세요.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF 출력 */}
              {detail.status === "signed" && (
                <button
                  onClick={() => printContractPdf(detail)}
                  className="w-full py-2.5 bg-[var(--color-dark)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none"
                >
                  PDF 출력
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function printContractPdf(c: Contract) {
  const fmtN = (n: number) => n.toLocaleString();
  const signedDate = c.signed_at ? new Date(c.signed_at) : new Date();
  const dateStr = `${signedDate.getFullYear()}년 ${signedDate.getMonth() + 1}월 ${signedDate.getDate()}일`;

  const paymentRows = (c.payment_terms || []).map((pt: PaymentTerm) =>
    `<tr><td class="l b">${pt.label}</td><td class="r b">${fmtN(pt.amount)}원</td><td class="l">${pt.due}</td></tr>`
  ).join("");

  const specRows = (c.specs || []).map((s: Spec) =>
    `<tr><td class="lbl">${s.label}</td><td class="l">${s.value}</td></tr>`
  ).join("");

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8" /><title>계약서 - ${c.contract_number}</title>
<style>
@page { size: A4; margin: 15mm 18mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #222; font-size: 10pt; line-height: 1.7; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table { width: 100%; border-collapse: collapse; }
td, th { border: 1px solid #bbb; padding: 5px 8px; font-size: 9pt; }
th { background: #f0ece6; font-weight: 700; text-align: center; }
.l { text-align: left; }
.r { text-align: right; }
.c { text-align: center; }
.b { font-weight: 700; }
.lbl { background: #f0ece6; font-weight: 700; width: 80px; text-align: center; font-size: 8.5pt; }
h2 { font-size: 11pt; margin: 16px 0 6px; }
.top-line { border-top: 3px solid #222; }
.sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 24px; }
.sig-box { text-align: center; }
.sig-box .line { border-bottom: 2px solid #222; min-height: 50px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; margin-bottom: 4px; }
.sig-box p { font-size: 9pt; }
.sig-box img { height: 40px; }
.footer { text-align: center; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 24px; font-size: 7.5pt; color: #999; }
</style></head><body>
<div class="top-line" style="padding-top:6px;display:flex;justify-content:space-between;margin-bottom:4px">
  <span style="font-size:8pt;color:#888">HS WEB · Web Agency</span>
  <span style="font-size:8pt;color:#888">${c.contract_number}</span>
</div>
<div style="text-align:center;margin:28px 0 20px">
  <h1 style="font-size:22pt;letter-spacing:10px;font-weight:900">계 약 서</h1>
  <p style="font-size:8pt;color:#999;letter-spacing:4px;margin-top:2px">CONTRACT</p>
</div>

<p style="margin-bottom:14px;font-size:9.5pt;line-height:1.8">
  <strong>${c.client_name}</strong>${c.client_company ? ` (${c.client_company})` : ""} (이하 "갑"이라 한다)과 <strong>HS WEB</strong> (대표 심현수, 이하 "을"이라 한다)은 아래와 같이 웹사이트 제작에 관한 계약을 체결한다.
</p>

<hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />

<h2>제 1 조 (프로젝트 개요)</h2>
<table style="margin-bottom:14px">
  <tr><td class="lbl">프로젝트명</td><td class="l b">${c.project_name}</td></tr>
  ${c.project_scope ? `<tr><td class="lbl">제작 범위</td><td class="l">${c.project_scope}</td></tr>` : ""}
  ${c.start_date ? `<tr><td class="lbl">제작 기간</td><td class="l">${c.start_date} ~ ${c.end_date || "협의"}</td></tr>` : ""}
  <tr><td class="lbl">계약 금액</td><td class="l b" style="font-size:10pt">${fmtN(c.total_amount)}원 (VAT 포함)</td></tr>
</table>

${paymentRows ? `
<h2>제 2 조 (대금 지급)</h2>
<p style="font-size:9pt;margin-bottom:6px">"갑"은 아래의 일정에 따라 대금을 지급한다.</p>
<table style="margin-bottom:14px">
  <thead><tr><th>구분</th><th>금액</th><th>지급 시기</th></tr></thead>
  <tbody>${paymentRows}</tbody>
</table>` : ""}

${specRows ? `
<h2>제 3 조 (제작 사양)</h2>
<table style="margin-bottom:14px">${specRows}</table>` : ""}

<h2>제 4 조 ~ (일반 조항)</h2>
<div style="font-size:9pt;line-height:1.8;white-space:pre-line;margin-bottom:14px">${c.terms || ""}</div>

<hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />

<p style="text-align:center;font-size:9.5pt;margin-bottom:16px">${dateStr}</p>

<div class="sig-grid">
  <div class="sig-box">
    <p style="font-size:8pt;color:#888;margin-bottom:6px;font-weight:700;letter-spacing:2px">갑 (의뢰인)</p>
    <div class="line">${c.client_signature ? `<img src="${c.client_signature}" alt="서명" />` : ""}</div>
    <p class="b">${c.client_name}</p>
    ${c.client_company ? `<p style="color:#888">${c.client_company}</p>` : ""}
  </div>
  <div class="sig-box">
    <p style="font-size:8pt;color:#888;margin-bottom:6px;font-weight:700;letter-spacing:2px">을 (수급인)</p>
    <div class="line"><span style="font-size:14pt;font-weight:900;font-style:italic">HS WEB</span></div>
    <p class="b">심현수</p>
    <p style="color:#888">HS WEB 대표</p>
  </div>
</div>

<div style="background:#f0ece6;border:1px solid #d4cbbf;padding:10px 14px;margin-top:20px;font-size:7.5pt;color:#6b5d4d;line-height:1.7">
  <p style="font-weight:700;margin-bottom:2px;font-size:8pt;color:#2c2418">전자서명 법적 고지</p>
  <p>본 계약서는 「전자문서 및 전자거래 기본법」 제4조 및 「전자서명법」 제3조에 따라 전자적 형태로 작성되었으며, 전자 서명을 통해 체결되었습니다. 본 전자 계약서는 서면 계약서와 동일한 법적 효력을 가집니다.</p>
</div>

<div style="margin-top:16px;padding:10px 14px;border:1px solid #ddd;font-size:7pt;color:#888;line-height:1.8">
  <p style="font-weight:700;margin-bottom:2px;font-size:7.5pt;color:#555">서명 증거 (Signing Evidence)</p>
  <p>서명 일시: ${c.signed_at ? new Date(c.signed_at).toLocaleString("ko-KR") : "-"}</p>
  <p>서명자 IP: ${c.sign_ip || "-"}</p>
  <p>브라우저: ${c.sign_user_agent || "-"}</p>
  <p>무결성 해시 (SHA-256): ${c.content_hash || "-"}</p>
</div>

<div class="footer">HS WEB | 본 계약서는 전자 서명을 통해 법적 효력을 가집니다.</div>

<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
  win.document.close();
}
