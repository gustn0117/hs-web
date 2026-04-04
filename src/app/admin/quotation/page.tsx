"use client";

import { useState, useRef } from "react";
import AdminHeader from "../components/AdminHeader";

interface LineItem {
  name: string;
  method: string;
  unitPrice: number;
}

interface Spec {
  label: string;
  value: string;
}

const DEFAULT_SPECS: Spec[] = [
  { label: "제작 방식", value: "맞춤형 홈페이지 제작 (기획 · 디자인 · 퍼블리싱 작업 포함)" },
  { label: "제작 단가", value: "" },
  { label: "제작 기간", value: "약 1 주 내외 (자료 전달 완료 후 기준)" },
  { label: "제작 범위", value: "메인 페이지 + 내부 페이지" },
  { label: "반응형 여부", value: "PC / 모바일 반응형 적용" },
  { label: "제공 사항", value: "기본 콘텐츠 세팅, 도메인 연결, 초기 운영 세팅 지원" },
  { label: "납품 형태", value: "최종 결과물 온라인 배포 및 운영 가능 상태로 제공" },
];

const DEFAULT_NOTES = [
  "호스팅 및 도메인은 고객 명의로 개설·관리되며, 실비 기준의 단순 대행 서비스입니다.",
  "외부 플랫폼(호스팅사) 장애 및 점검에 따른 문제는 당사 책임 범위에 포함되지 않습니다.",
  "세금계산서 발행 시 공급가액의 10%가 부가세로 추가됩니다.",
];

function genQuoteNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `HSWEB-${y}${m}${day}-${seq}`;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()} 년 ${d.getMonth() + 1} 월 ${d.getDate()} 일`;
}

function fmtNum(n: number) {
  return n.toLocaleString();
}

export default function QuotationPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const [quoteNumber] = useState(genQuoteNumber);
  const [quoteDate, setQuoteDate] = useState(todayStr);
  const [manager, setManager] = useState("HS WEB 담당자");
  const [validity, setValidity] = useState("견적일로부터 30 일");
  const [includeVat, setIncludeVat] = useState(true);

  const [items, setItems] = useState<LineItem[]>([
    { name: "맞춤형 홈페이지 제작", method: "기획·디자인·퍼블리싱", unitPrice: 1000000 },
  ]);

  const [specs, setSpecs] = useState<Spec[]>(DEFAULT_SPECS);
  const [notes, setNotes] = useState(DEFAULT_NOTES.join("\n"));

  const subtotal = items.reduce((s, item) => s + item.unitPrice, 0);
  const vat = includeVat ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + vat;

  // Auto-fill 제작 단가
  const specsWithPrice = specs.map((s) =>
    s.label === "제작 단가"
      ? { ...s, value: `${fmtNum(subtotal)} 원 (호스팅 / 도메인 별도)` }
      : s
  );

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", method: "", unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSpec = (idx: number, value: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, value } : s)));
  };

  const handlePrint = () => {
    const printArea = printRef.current;
    if (!printArea) return;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>견적서 - ${quoteNumber}</title>
<style>
@page { size: A4; margin: 20mm 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Pretendard', 'Noto Sans KR', -apple-system, sans-serif; color: #1a1a1a; font-size: 11pt; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { max-width: 210mm; margin: 0 auto; }
.header-line { border-top: 3px solid #1a1a1a; margin-bottom: 8px; }
.company { font-size: 22pt; font-weight: 900; letter-spacing: -0.5px; }
.company span { font-size: 11pt; font-weight: 400; color: #666; margin-left: 8px; }
.title-wrap { text-align: center; margin: 32px 0 28px; }
.title { font-size: 28pt; font-weight: 900; letter-spacing: 16px; }
.title-sub { font-size: 9pt; color: #999; letter-spacing: 6px; margin-top: 4px; }
.info-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
.info-table td { padding: 8px 14px; font-size: 10pt; border: 1px solid #ddd; }
.info-table .label { background: #f5f5f5; font-weight: 700; width: 100px; text-align: center; letter-spacing: 4px; }
.section-title { font-size: 11pt; font-weight: 800; margin-bottom: 10px; }
.section-title::before { content: '■'; margin-right: 6px; }
.items-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
.items-table th { background: #f5f5f5; padding: 10px 8px; font-size: 9.5pt; font-weight: 700; border: 1px solid #ddd; text-align: center; letter-spacing: 2px; }
.items-table td { padding: 10px 8px; font-size: 10pt; border: 1px solid #ddd; text-align: center; }
.items-table .name { text-align: left; padding-left: 14px; font-weight: 600; }
.items-table .amount { text-align: right; padding-right: 14px; font-weight: 700; }
.items-table .subtotal-row td { border-top: 2px solid #ccc; }
.items-table .vat-row td { }
.items-table .total-row td { background: #1a1a1a; color: #fff; font-weight: 800; font-size: 11pt; border-color: #1a1a1a; }
.items-table .total-row .amount { font-size: 13pt; }
.spec-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
.spec-table td { padding: 8px 14px; font-size: 10pt; border: 1px solid #ddd; }
.spec-table .label { background: #f5f5f5; font-weight: 700; width: 100px; text-align: center; }
.notes-box { border: 1px solid #ddd; padding: 16px 20px; margin-bottom: 40px; font-size: 9.5pt; color: #444; line-height: 1.8; }
.notes-box p::before { content: '·'; margin-right: 6px; }
.divider { border: none; border-top: 2px solid #1a1a1a; margin: 32px 0; }
.supplier { text-align: center; margin-bottom: 32px; }
.supplier h3 { font-size: 14pt; font-weight: 900; letter-spacing: 8px; margin-bottom: 16px; }
.supplier p { font-size: 10pt; color: #333; line-height: 2; }
.supplier p strong { font-weight: 700; margin-right: 4px; }
.footer { text-align: center; border-top: 1px solid #ddd; padding-top: 12px; font-size: 8.5pt; color: #999; }
</style>
</head>
<body>
${printArea.innerHTML}
<script>window.onload=function(){window.print();}<\/script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">견적서 발행</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">내용을 입력하고 PDF로 발행하세요.</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none shadow-sm"
          >
            PDF 발행
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== 입력 폼 ===== */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-gray)] mb-1.5 font-medium">견적번호</label>
                  <input value={quoteNumber} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-[var(--color-dark)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-gray)] mb-1.5 font-medium">견적일자</label>
                  <input value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[var(--color-dark)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-gray)] mb-1.5 font-medium">담당자</label>
                  <input value={manager} onChange={(e) => setManager(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[var(--color-dark)]" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-gray)] mb-1.5 font-medium">유효기간</label>
                  <input value={validity} onChange={(e) => setValidity(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[var(--color-dark)]" />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4 text-sm text-[var(--color-dark)]">
                <input type="checkbox" checked={includeVat} onChange={(e) => setIncludeVat(e.target.checked)} className="rounded" />
                부가세(10%) 포함
              </label>
            </div>

            {/* 견적 항목 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-dark)]">견적 내역</h3>
                <button onClick={addItem} className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none">
                  + 항목 추가
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 relative">
                    {items.length > 1 && (
                      <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-[var(--color-gray)] hover:text-red-500 cursor-pointer bg-transparent border-none text-lg">×</button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs text-[var(--color-gray)] mb-1">항목명</label>
                        <input value={item.name} onChange={(e) => updateItem(idx, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="맞춤형 홈페이지 제작" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-[var(--color-gray)] mb-1">제작 방식</label>
                        <input value={item.method} onChange={(e) => updateItem(idx, "method", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="기획·디자인·퍼블리싱" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-[var(--color-gray)] mb-1">단가</label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.unitPrice ? fmtNum(item.unitPrice) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              updateItem(idx, "unitPrice", Number(raw) || 0);
                            }}
                            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm"
                            placeholder="1,000,000"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gray)]">원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-[var(--color-dark-2)]">
                  <span>소계</span>
                  <span className="font-semibold">{fmtNum(subtotal)}원</span>
                </div>
                {includeVat && (
                  <div className="flex justify-between text-[var(--color-dark-2)] mt-1">
                    <span>부가세 (10%)</span>
                    <span className="font-semibold">{fmtNum(vat)}원</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--color-dark)] font-bold mt-2 text-base">
                  <span>합계</span>
                  <span>{fmtNum(total)}원</span>
                </div>
              </div>
            </div>

            {/* 제작 사양 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">제작 사양</h3>
              <div className="space-y-3">
                {specs.map((spec, idx) => (
                  <div key={idx}>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">{spec.label}</label>
                    {spec.label === "제작 단가" ? (
                      <input
                        value={`${fmtNum(subtotal)} 원 (호스팅 / 도메인 별도)`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-[var(--color-dark)]"
                      />
                    ) : (
                      <input value={spec.value} onChange={(e) => updateSpec(idx, e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder={spec.label} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 비고 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">비고 및 유의사항</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
                placeholder="각 줄이 하나의 항목으로 표시됩니다"
              />
            </div>
          </div>

          {/* ===== 미리보기 ===== */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-4 self-start">
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">미리보기</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="p-6 text-[8px] leading-[1.5] origin-top-left" style={{ fontSize: "8px" }}>
                <div ref={printRef}>
                  <div className="page">
                    {/* Header */}
                    <div className="header-line" style={{ borderTop: "3px solid #1a1a1a", marginBottom: "6px" }} />
                    <div className="company" style={{ fontSize: "16px", fontWeight: 900 }}>
                      HS WEB <span style={{ fontSize: "8px", fontWeight: 400, color: "#666", marginLeft: "6px" }}>Web Agency</span>
                    </div>

                    {/* Title */}
                    <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
                      <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "12px" }}>견 적 서</div>
                      <div style={{ fontSize: "7px", color: "#999", letterSpacing: "4px", marginTop: "2px" }}>QUOTATION</div>
                    </div>

                    {/* Info */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: 700, width: "70px", textAlign: "center", letterSpacing: "3px" }}>견적번호</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd" }}>{quoteNumber}</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: 700, width: "70px", textAlign: "center", letterSpacing: "3px" }}>견적일자</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd" }}>{quoteDate}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: 700, textAlign: "center", letterSpacing: "3px" }}>담 당 자</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd" }}>{manager}</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: 700, textAlign: "center", letterSpacing: "3px" }}>유효기간</td>
                          <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd" }}>{validity}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Items */}
                    <div style={{ fontSize: "8px", fontWeight: 800, marginBottom: "8px" }}>■ 견적 내역</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                      <thead>
                        <tr>
                          <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "20px" }}>No.</th>
                          <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "30%" }}>항 목</th>
                          <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>제작 방식</th>
                          <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>단 가</th>
                          <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>금 액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{idx + 1}</td>
                            <td style={{ padding: "8px 8px", fontSize: "7.5px", border: "1px solid #ddd", fontWeight: 600 }}>{item.name}</td>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{item.method}</td>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right" }}>{fmtNum(item.unitPrice)} 원</td>
                            <td style={{ padding: "8px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700 }}>{fmtNum(item.unitPrice)} 원</td>
                          </tr>
                        ))}
                        {/* Empty rows */}
                        {items.length < 3 && [...Array(3 - items.length)].map((_, i) => (
                          <tr key={`empty-${i}`}>
                            <td style={{ padding: "8px 4px", border: "1px solid #ddd", height: "28px" }}>&nbsp;</td>
                            <td style={{ border: "1px solid #ddd" }}></td>
                            <td style={{ border: "1px solid #ddd" }}></td>
                            <td style={{ border: "1px solid #ddd" }}></td>
                            <td style={{ border: "1px solid #ddd" }}></td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={3} style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700, borderTop: "2px solid #ccc" }}>소 계</td>
                          <td style={{ padding: "6px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", borderTop: "2px solid #ccc" }}>{fmtNum(subtotal)} 원</td>
                          <td style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700, borderTop: "2px solid #ccc" }}>{fmtNum(subtotal)} 원</td>
                        </tr>
                        <tr>
                          <td colSpan={3} style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700 }}>
                            부가세 (세금계산서 발행 시 +10%)
                          </td>
                          <td style={{ padding: "6px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right" }}>{fmtNum(vat)} 원</td>
                          <td style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right" }}>{fmtNum(vat)} 원</td>
                        </tr>
                        <tr>
                          <td colSpan={3} style={{ padding: "8px 8px", fontSize: "8px", background: "#1a1a1a", color: "#fff", fontWeight: 800, textAlign: "center", border: "1px solid #1a1a1a", letterSpacing: "2px" }}>
                            최 종 합 계 (VAT 포함)
                          </td>
                          <td colSpan={2} style={{ padding: "8px 8px", fontSize: "10px", background: "#1a1a1a", color: "#fff", fontWeight: 800, textAlign: "right", border: "1px solid #1a1a1a" }}>
                            {fmtNum(total)} 원
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Specs */}
                    <div style={{ fontSize: "8px", fontWeight: 800, marginBottom: "8px" }}>■ 제작 사양</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                      <tbody>
                        {specsWithPrice.map((spec, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: 700, width: "70px", textAlign: "center" }}>{spec.label}</td>
                            <td style={{ padding: "6px 10px", fontSize: "7.5px", border: "1px solid #ddd" }}>{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Notes */}
                    <div style={{ fontSize: "8px", fontWeight: 800, marginBottom: "8px" }}>■ 비고 및 유의사항</div>
                    <div style={{ border: "1px solid #ddd", padding: "10px 14px", marginBottom: "28px", fontSize: "7px", color: "#444", lineHeight: 1.8 }}>
                      {notes.split("\n").filter(Boolean).map((line, i) => (
                        <p key={i}>· {line}</p>
                      ))}
                    </div>

                    {/* Divider + Supplier */}
                    <hr style={{ border: "none", borderTop: "2px solid #1a1a1a", margin: "20px 0" }} />
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "6px", marginBottom: "12px" }}>공 급 자</div>
                      <p style={{ fontSize: "8px", color: "#333", lineHeight: 2 }}>
                        <strong>상 호 :</strong> HS WEB / HARAM<br />
                        <strong>대 표 :</strong> 심현수<br />
                        <strong>연락처 :</strong> 010-3319-2509
                      </p>
                    </div>
                    <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "16px 0" }} />
                    <div style={{ textAlign: "center", fontSize: "6.5px", color: "#999" }}>
                      HS WEB | 본 견적서는 발행일로부터 30 일간 유효합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
