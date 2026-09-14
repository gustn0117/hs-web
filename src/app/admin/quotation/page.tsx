"use client";

import { useState, useEffect, useCallback } from "react";
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

interface HostingItem {
  name: string;
  cycle: "월" | "년";
  price: number;
  count: number;
}

interface HostingInfo {
  mode: "separate" | "included";
  items: HostingItem[];
}

// 사이트 도메인·호스팅 안내 페이지의 최저가 기준. 견적서마다 수정한다.
const DEFAULT_HOSTING_ITEMS: HostingItem[] = [
  { name: "호스팅", cycle: "월", price: 7000, count: 12 },
  { name: "도메인 (.com)", cycle: "년", price: 20000, count: 1 },
];

function hostingAmount(h: HostingItem) {
  return h.price * h.count;
}

function hostingUnitLabel(h: HostingItem) {
  return `${h.cycle} ${fmtNum(h.price)}원`;
}

function hostingPeriodLabel(h: HostingItem) {
  return `${h.count}${h.cycle === "월" ? "개월" : "년"}`;
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

interface SavedQuotation {
  id: string;
  quote_number: string;
  quote_date: string;
  manager: string;
  total: number;
  status: string;
  created_at: string;
  items: LineItem[];
  specs: Spec[];
  notes: string;
  validity: string;
  include_vat: boolean;
  subtotal: number;
  vat: number;
  hosting?: HostingInfo | null;
}

export default function QuotationPage() {
  const [tab, setTab] = useState<"new" | "list">("new");
  const [saved, setSaved] = useState<SavedQuotation[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [quoteNumber, setQuoteNumber] = useState(genQuoteNumber);
  const [quoteDate, setQuoteDate] = useState(todayStr);
  const [manager, setManager] = useState("HS WEB 담당자");
  const [validity, setValidity] = useState("견적일로부터 30 일");
  const [includeVat, setIncludeVat] = useState(true);

  const [items, setItems] = useState<LineItem[]>([
    { name: "맞춤형 홈페이지 제작", method: "기획·디자인·퍼블리싱", unitPrice: 1000000 },
  ]);

  const [specs, setSpecs] = useState<Spec[]>(DEFAULT_SPECS);
  const [hostingOn, setHostingOn] = useState(false);
  const [hostingMode, setHostingMode] = useState<HostingInfo["mode"]>("separate");
  const [hostingItems, setHostingItems] = useState<HostingItem[]>(DEFAULT_HOSTING_ITEMS);
  const [notes, setNotes] = useState(DEFAULT_NOTES.join("\n"));

  const fetchList = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/admin/quotations");
      if (res.ok) {
        const data = await res.json();
        setSaved(data.quotations ?? []);
      }
    } catch { /* ignore */ }
    setListLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "list") fetchList();
  }, [tab, fetchList]);

  const resetForm = () => {
    setQuoteNumber(genQuoteNumber());
    setQuoteDate(todayStr());
    setManager("HS WEB 담당자");
    setValidity("견적일로부터 30 일");
    setIncludeVat(true);
    setItems([{ name: "맞춤형 홈페이지 제작", method: "기획·디자인·퍼블리싱", unitPrice: 1000000 }]);
    setSpecs(DEFAULT_SPECS);
    setNotes(DEFAULT_NOTES.join("\n"));
    setHostingOn(false);
    setHostingMode("separate");
    setHostingItems(DEFAULT_HOSTING_ITEMS);
  };

  const loadQuotation = (q: SavedQuotation) => {
    setQuoteNumber(q.quote_number);
    setQuoteDate(q.quote_date);
    setManager(q.manager);
    setValidity(q.validity);
    setIncludeVat(q.include_vat);
    setItems(q.items);
    setSpecs(q.specs);
    setNotes(q.notes);
    setHostingOn(!!q.hosting);
    setHostingMode(q.hosting?.mode ?? "separate");
    setHostingItems(q.hosting?.items?.length ? q.hosting.items : DEFAULT_HOSTING_ITEMS);
    setTab("new");
  };

  const deleteQuotation = async (id: string) => {
    if (!confirm("이 견적서를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/quotations/${id}`, { method: "DELETE" });
    fetchList();
  };

  const hostingSum = hostingItems.reduce((s, h) => s + hostingAmount(h), 0);
  const hostingIncluded = hostingOn && hostingMode === "included" && hostingItems.length > 0;
  const hostingSeparate = hostingOn && hostingMode === "separate" && hostingItems.length > 0;

  // 견적 내역 표에 그릴 행. "합계에 포함"이면 호스팅·도메인 줄이 뒤에 붙는다.
  const tableRows = [
    ...items.map((item) => ({ name: item.name, method: item.method, unitPrice: item.unitPrice, amount: item.unitPrice })),
    ...(hostingIncluded
      ? hostingItems.map((h) => ({
          name: h.name,
          method: `${hostingUnitLabel(h)} × ${hostingPeriodLabel(h)}`,
          unitPrice: h.price,
          amount: hostingAmount(h),
        }))
      : []),
  ];

  const subtotal = tableRows.reduce((s, row) => s + row.amount, 0);
  const vat = includeVat ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + vat;

  const priceSpecValue = `${fmtNum(subtotal)} 원 (호스팅 / 도메인 ${hostingIncluded ? "포함" : "별도"})`;

  // Auto-fill 제작 단가
  const specsWithPrice = specs.map((s) =>
    s.label === "제작 단가"
      ? { ...s, value: priceSpecValue }
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

  const updateHostingItem = <K extends keyof HostingItem>(idx: number, field: K, value: HostingItem[K]) => {
    setHostingItems((prev) => prev.map((h, i) => (i === idx ? { ...h, [field]: value } : h)));
  };

  const addHostingItem = () => {
    setHostingItems((prev) => [...prev, { name: "", cycle: "년", price: 0, count: 1 }]);
  };

  const removeHostingItem = (idx: number) => {
    setHostingItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSpec = (idx: number, value: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, value } : s)));
  };

  const saveToDb = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote_number: quoteNumber,
          quote_date: quoteDate,
          manager,
          validity,
          include_vat: includeVat,
          items,
          specs: specsWithPrice,
          hosting: hostingOn && hostingItems.length > 0 ? { mode: hostingMode, items: hostingItems } : null,
          notes,
          subtotal,
          vat,
          total,
        }),
      });
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handlePrint = () => {
    saveToDb();
    const itemsHtml = tableRows.map((item, idx) => `
      <tr>
        <td class="c">${idx + 1}</td>
        <td class="name">${item.name}</td>
        <td class="c">${item.method}</td>
        <td class="r">${fmtNum(item.unitPrice)} 원</td>
        <td class="r b">${fmtNum(item.amount)} 원</td>
      </tr>`).join("");

    const emptyRows = tableRows.length < 3
      ? [...Array(3 - tableRows.length)].map(() => `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>`).join("")
      : "";

    const specsHtml = specsWithPrice.map((s) => `
      <tr><td class="lbl">${s.label}</td><td>${s.value}</td></tr>`).join("");

    const hostingHtml = hostingSeparate
      ? `
<div class="sec">호스팅·도메인 (실비, 별도)</div>
<table style="margin-bottom:16px">
  <thead>
    <tr>
      <th style="width:28px">No.</th>
      <th style="width:32%">항 목</th>
      <th style="width:22%">단 가</th>
      <th style="width:20%">기 간</th>
      <th style="width:20%">금 액</th>
    </tr>
  </thead>
  <tbody>
    ${hostingItems.map((h, idx) => `
    <tr>
      <td class="c">${idx + 1}</td>
      <td class="name">${h.name}</td>
      <td class="r">${hostingUnitLabel(h)}</td>
      <td class="c">${hostingPeriodLabel(h)}</td>
      <td class="r b">${fmtNum(hostingAmount(h))} 원</td>
    </tr>`).join("")}
    <tr class="sub-row">
      <td colspan="4" class="r b">소 계 (제작비 합계와 별도)</td>
      <td class="r b">${fmtNum(hostingSum)} 원</td>
    </tr>
  </tbody>
</table>`
      : "";

    const notesHtml = notes.split("\n").filter(Boolean).map((l) => `<p>· ${l}</p>`).join("");

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>견적서 - ${quoteNumber}</title>
<style>
@page { size: A4; margin: 12mm 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #1a1a1a; font-size: 10pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table { width: 100%; border-collapse: collapse; }
td, th { border: 1px solid #ccc; padding: 6px 10px; font-size: 9pt; }
th { background: #f5f5f5; font-weight: 700; text-align: center; letter-spacing: 1px; }
.c { text-align: center; }
.r { text-align: right; }
.b { font-weight: 700; }
.lbl { background: #f5f5f5; font-weight: 700; width: 90px; text-align: center; }
.name { text-align: left; font-weight: 600; }
.hdr { border-top: 3px solid #1a1a1a; padding-top: 6px; margin-bottom: 4px; }
.hdr h1 { font-size: 18pt; font-weight: 900; display: inline; }
.hdr span { font-size: 9pt; color: #666; margin-left: 6px; }
.title { text-align: center; margin: 20px 0 16px; }
.title h2 { font-size: 22pt; font-weight: 900; letter-spacing: 12px; }
.title p { font-size: 8pt; color: #999; letter-spacing: 4px; margin-top: 2px; }
.sec { font-size: 10pt; font-weight: 800; margin: 16px 0 6px; }
.sec::before { content: '■ '; }
.total-row td { background: #1a1a1a; color: #fff; font-weight: 800; border-color: #1a1a1a; }
.total-row .r { font-size: 12pt; }
.sub-row td { border-top: 2px solid #aaa; }
.notes { border: 1px solid #ccc; padding: 10px 14px; font-size: 8.5pt; color: #444; line-height: 1.7; margin-bottom: 20px; }
.notes p { margin: 0; }
hr.div { border: none; border-top: 2px solid #1a1a1a; margin: 20px 0 16px; }
.supplier { text-align: center; margin-bottom: 16px; }
.supplier h3 { font-size: 12pt; font-weight: 900; letter-spacing: 6px; margin-bottom: 8px; }
.supplier p { font-size: 9pt; color: #333; line-height: 1.9; }
.footer { text-align: center; border-top: 1px solid #ddd; padding-top: 8px; font-size: 7.5pt; color: #999; }
</style>
</head>
<body>

<div class="hdr"><h1>HS WEB</h1><span>Web Agency</span></div>

<div class="title">
  <h2>견 적 서</h2>
  <p>QUOTATION</p>
</div>

<table style="margin-bottom:16px">
  <tr>
    <td class="lbl">견적번호</td><td>${quoteNumber}</td>
    <td class="lbl">견적일자</td><td>${quoteDate}</td>
  </tr>
  <tr>
    <td class="lbl">담 당 자</td><td>${manager}</td>
    <td class="lbl">유효기간</td><td>${validity}</td>
  </tr>
</table>

<div class="sec">견적 내역</div>
<table style="margin-bottom:16px">
  <thead>
    <tr>
      <th style="width:28px">No.</th>
      <th style="width:32%">항 목</th>
      <th style="width:22%">제작 방식</th>
      <th style="width:20%">단 가</th>
      <th style="width:20%">금 액</th>
    </tr>
  </thead>
  <tbody>
    ${itemsHtml}
    ${emptyRows}
    <tr class="sub-row">
      <td colspan="3" class="r b">소 계</td>
      <td class="r">${fmtNum(subtotal)} 원</td>
      <td class="r b">${fmtNum(subtotal)} 원</td>
    </tr>
    <tr>
      <td colspan="3" class="r b">부가세 (세금계산서 발행 시 +10%)</td>
      <td class="r">${fmtNum(vat)} 원</td>
      <td class="r">${fmtNum(vat)} 원</td>
    </tr>
    <tr class="total-row">
      <td colspan="3" class="c b" style="letter-spacing:2px">최 종 합 계 (VAT 포함)</td>
      <td colspan="2" class="r b">${fmtNum(total)} 원</td>
    </tr>
  </tbody>
</table>

${hostingHtml}

<div class="sec">제작 사양</div>
<table style="margin-bottom:16px">
  ${specsHtml}
</table>

<div class="sec">비고 및 유의사항</div>
<div class="notes">${notesHtml}</div>

<hr class="div" />
<div class="supplier">
  <h3>공 급 자</h3>
  <p>
    <strong>상 호 :</strong> HS WEB / HARAM<br/>
    <strong>대 표 :</strong> 심현수<br/>
    <strong>연락처 :</strong> 010-3319-2509
  </p>
</div>
<div class="footer">HS WEB &nbsp;|&nbsp; 본 견적서는 발행일로부터 30 일간 유효합니다.</div>

<script>window.onload=function(){window.print();}<\/script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)]">견적서</h2>
            <p className="text-[var(--color-gray)] text-sm mt-1">견적서를 작성하고 PDF로 발행하세요.</p>
          </div>
          <div className="flex items-center gap-3">
            {tab === "new" && (
              <button
                onClick={handlePrint}
                disabled={saving}
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-none shadow-sm disabled:opacity-50"
              >
                {saving ? "저장 중..." : "PDF 발행"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 w-fit">
          <button
            onClick={() => setTab("new")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${
              tab === "new" ? "bg-white text-[var(--color-dark)] shadow-sm" : "bg-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)]"
            }`}
          >
            새 견적서
          </button>
          <button
            onClick={() => setTab("list")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${
              tab === "list" ? "bg-white text-[var(--color-dark)] shadow-sm" : "bg-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)]"
            }`}
          >
            발행 내역
          </button>
        </div>

        {tab === "list" ? (
          <div className="bg-white border border-gray-200 shadow-sm">
            {listLoading ? (
              <div className="p-8 text-center text-[var(--color-gray)] text-sm">불러오는 중...</div>
            ) : saved.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-gray)] text-sm">발행된 견적서가 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-[var(--color-gray)] font-medium text-xs">견적번호</th>
                      <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">견적일자</th>
                      <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">항목</th>
                      <th className="text-right py-3 px-3 text-[var(--color-gray)] font-medium text-xs">합계</th>
                      <th className="text-center py-3 px-6 text-[var(--color-gray)] font-medium text-xs">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saved.map((q) => (
                      <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-6 font-medium text-[var(--color-dark)]">{q.quote_number}</td>
                        <td className="py-3 px-3 text-[var(--color-gray)]">{q.quote_date}</td>
                        <td className="py-3 px-3 text-[var(--color-dark-2)]">
                          {(q.items as LineItem[])?.[0]?.name || "-"}
                          {(q.items as LineItem[])?.length > 1 && ` 외 ${(q.items as LineItem[]).length - 1}건`}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[var(--color-dark)] tabular-nums">{fmtNum(q.total)}원</td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => loadQuotation(q)}
                              className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                            >
                              불러오기
                            </button>
                            <button
                              onClick={() => deleteQuotation(q.id)}
                              className="text-xs text-red-500 font-semibold hover:underline cursor-pointer bg-transparent border-none"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== 입력 폼 ===== */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
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
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-dark)]">견적 내역</h3>
                <button onClick={addItem} className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none">
                  + 항목 추가
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 p-4 relative">
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
                {hostingIncluded && (
                  <div className="flex justify-between text-[var(--color-gray)] mb-1">
                    <span>호스팅·도메인 포함</span>
                    <span>+{fmtNum(hostingSum)}원</span>
                  </div>
                )}
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

            {/* 호스팅·도메인 */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] cursor-pointer">
                  <input type="checkbox" checked={hostingOn} onChange={(e) => setHostingOn(e.target.checked)} className="rounded" />
                  호스팅·도메인 포함
                </label>
                {hostingOn && (
                  <button onClick={addHostingItem} className="text-xs text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none">
                    + 항목 추가
                  </button>
                )}
              </div>

              {hostingOn && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {([
                      ["separate", "제작비와 별도 표기"],
                      ["included", "견적 합계에 포함"],
                    ] as const).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setHostingMode(mode)}
                        aria-pressed={hostingMode === mode}
                        className={`px-3 py-2 rounded-lg text-sm border cursor-pointer transition-colors ${
                          hostingMode === mode
                            ? "border-[var(--color-dark)] bg-[var(--color-dark)] text-white font-semibold"
                            : "border-gray-200 bg-white text-[var(--color-dark-2)] hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-gray)] mb-4">
                    {hostingMode === "included"
                      ? "견적 내역에 줄로 들어가 소계·부가세·합계에 합산됩니다. 실비 대행 비용에도 부가세가 붙습니다."
                      : "제작비 합계는 그대로 두고, 견적서에 별도 표로 표시합니다."}
                  </p>

                  {hostingItems.length === 0 ? (
                    <p className="text-sm text-[var(--color-gray)] py-4 text-center">항목이 없습니다. 오른쪽 위 &quot;+ 항목 추가&quot;로 넣어주세요.</p>
                  ) : (
                    <div className="space-y-3">
                      {hostingItems.map((h, idx) => (
                        <div key={idx} className="border border-gray-100 p-4 relative">
                          <button onClick={() => removeHostingItem(idx)} aria-label="항목 삭제" className="absolute top-2 right-2 text-[var(--color-gray)] hover:text-red-500 cursor-pointer bg-transparent border-none text-lg">×</button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs text-[var(--color-gray)] mb-1">항목명</label>
                              <input value={h.name} onChange={(e) => updateHostingItem(idx, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="호스팅" />
                            </div>
                            <div>
                              <label className="block text-xs text-[var(--color-gray)] mb-1">단가</label>
                              <div className="flex gap-1.5">
                                <select
                                  value={h.cycle}
                                  onChange={(e) => updateHostingItem(idx, "cycle", e.target.value as HostingItem["cycle"])}
                                  className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                  aria-label="결제 주기"
                                >
                                  <option value="월">월</option>
                                  <option value="년">년</option>
                                </select>
                                <div className="relative flex-1 min-w-0">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={h.price ? fmtNum(h.price) : ""}
                                    onChange={(e) => updateHostingItem(idx, "price", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                                    className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg text-sm"
                                    placeholder="7,000"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gray)]">원</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-[var(--color-gray)] mb-1">기간</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={h.count ? String(h.count) : ""}
                                  onChange={(e) => updateHostingItem(idx, "count", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                                  className="w-full px-3 py-2 pr-12 border border-gray-200 rounded-lg text-sm"
                                  placeholder="12"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gray)]">{h.cycle === "월" ? "개월" : "년"}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-right text-[var(--color-gray)]">
                            금액 <span className="font-semibold text-[var(--color-dark)]">{fmtNum(hostingAmount(h))}원</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm flex justify-between text-[var(--color-dark)] font-semibold">
                    <span>호스팅·도메인 합계</span>
                    <span>{fmtNum(hostingSum)}원</span>
                  </div>
                </div>
              )}
            </div>

            {/* 제작 사양 */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">제작 사양</h3>
              <div className="space-y-3">
                {specs.map((spec, idx) => (
                  <div key={idx}>
                    <label className="block text-xs text-[var(--color-gray)] mb-1">{spec.label}</label>
                    {spec.label === "제작 단가" ? (
                      <input
                        value={priceSpecValue}
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
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
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
          <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-4 self-start">
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">미리보기</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="p-6 text-[8px] leading-[1.5] origin-top-left" style={{ fontSize: "8px" }}>
                <div>
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
                        {tableRows.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{idx + 1}</td>
                            <td style={{ padding: "8px 8px", fontSize: "7.5px", border: "1px solid #ddd", fontWeight: 600 }}>{item.name}</td>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{item.method}</td>
                            <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right" }}>{fmtNum(item.unitPrice)} 원</td>
                            <td style={{ padding: "8px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700 }}>{fmtNum(item.amount)} 원</td>
                          </tr>
                        ))}
                        {/* Empty rows */}
                        {tableRows.length < 3 && [...Array(3 - tableRows.length)].map((_, i) => (
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

                    {/* Hosting & domain (separate) */}
                    {hostingSeparate && (
                      <>
                        <div style={{ fontSize: "8px", fontWeight: 800, marginBottom: "8px" }}>■ 호스팅·도메인 (실비, 별도)</div>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                          <thead>
                            <tr>
                              <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "20px" }}>No.</th>
                              <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "30%" }}>항 목</th>
                              <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>단 가</th>
                              <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>기 간</th>
                              <th style={{ background: "#f5f5f5", padding: "6px 4px", fontSize: "7px", fontWeight: 700, border: "1px solid #ddd", width: "22%" }}>금 액</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hostingItems.map((h, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", fontWeight: 600 }}>{h.name}</td>
                                <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right" }}>{hostingUnitLabel(h)}</td>
                                <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "center" }}>{hostingPeriodLabel(h)}</td>
                                <td style={{ padding: "8px 4px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700 }}>{fmtNum(hostingAmount(h))} 원</td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={4} style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700, borderTop: "2px solid #ccc" }}>소 계 (제작비 합계와 별도)</td>
                              <td style={{ padding: "6px 8px", fontSize: "7.5px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700, borderTop: "2px solid #ccc" }}>{fmtNum(hostingSum)} 원</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}

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
        )}
      </div>
    </div>
  );
}
