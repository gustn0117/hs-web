"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/AdminHeader";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface Client {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  memo: string;
  is_active: boolean;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  website_url: string;
  tech_stack: string;
  admin_url: string;
  admin_id: string;
  admin_pw: string;
  status: string;
  description: string;
  started_at: string;
  completed_at: string;
  unit_price: number;
  platform: string;
}

interface Hosting {
  id: string;
  project_id: string | null;
  provider: string;
  plan: string;
  amount: number;
  billing_cycle: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  memo: string;
}

interface Domain {
  id: string;
  project_id: string | null;
  domain_name: string;
  registrar: string;
  registered_date: string;
  expires_date: string;
  auto_renew: boolean;
  nameservers: string;
  memo: string;
}

interface Payment {
  id: string;
  project_id: string | null;
  payment_date: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  memo: string;
}

type TabKey = "projects" | "payments";

// ---------------------------------------------------------------------------
// Shared style constants
// ---------------------------------------------------------------------------

const inputClass =
  "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-dark)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-gray-400";
const labelClass =
  "block text-[var(--color-dark-2)] text-xs font-medium mb-1.5";
const cardClass =
  "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm";
const btnPrimary =
  "px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed";
const btnSecondary =
  "px-5 py-2.5 bg-gray-100 border border-gray-200 text-[var(--color-gray)] rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-gray-200";
const btnDanger =
  "px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 text-xs rounded-lg cursor-pointer hover:bg-red-100 transition-all";
const btnSmall =
  "px-3 py-1.5 bg-gray-100 border border-gray-200 text-[var(--color-gray)] text-xs rounded-lg cursor-pointer hover:bg-gray-200 hover:text-[var(--color-dark)] transition-all";
const btnMini =
  "px-2.5 py-1 bg-gray-50 border border-gray-200 text-[var(--color-gray)] text-xs rounded-lg cursor-pointer hover:bg-gray-100 transition-all";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clean(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[key] = val === "" ? null : val;
  }
  return result;
}

function getDaysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
}

function getNextRenewalDate(endDate: string, billingCycle: string): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  if (end > now) return endDate;
  const next = new Date(end);
  while (next <= now) {
    if (billingCycle === "yearly") next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString().split("T")[0];
}

function isExpired(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString() + "원";
}

function getRenewalBadge(daysUntil: number): { text: string; cls: string } {
  if (daysUntil < 0) return { text: `${Math.abs(daysUntil)}일 지남`, cls: "bg-red-100 text-red-700 border-red-200" };
  if (daysUntil <= 7) return { text: `D-${daysUntil}`, cls: "bg-red-100 text-red-700 border-red-200" };
  if (daysUntil <= 30) return { text: `D-${daysUntil}`, cls: "bg-amber-100 text-amber-700 border-amber-200" };
  return { text: `D-${daysUntil}`, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  "상담중": "bg-amber-50 text-amber-700 border border-amber-200",
  "진행중": "bg-blue-50 text-blue-700 border border-blue-200",
  "완료": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "유지보수": "bg-purple-50 text-purple-700 border border-purple-200",
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  paid: { label: "완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending: { label: "대기", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  overdue: { label: "미납", cls: "bg-red-50 text-red-700 border border-red-200" },
};

// ---------------------------------------------------------------------------
// Default form data factories
// ---------------------------------------------------------------------------

const defaultProjectForm = (): Omit<Project, "id"> => ({
  name: "", website_url: "", tech_stack: "", admin_url: "", admin_id: "", admin_pw: "",
  status: "상담중", description: "", started_at: "", completed_at: "", unit_price: 0, platform: "",
});

const defaultHostingForm = (): Omit<Hosting, "id"> => ({
  project_id: null, provider: "", plan: "", amount: 0, billing_cycle: "monthly",
  start_date: "", end_date: "", auto_renew: false, memo: "",
});

const defaultDomainForm = (): Omit<Domain, "id"> => ({
  project_id: null, domain_name: "", registrar: "", registered_date: "", expires_date: "",
  auto_renew: false, nameservers: "", memo: "",
});

const defaultPaymentForm = (): Omit<Payment, "id"> => ({
  project_id: null, payment_date: "", type: "제작비", description: "", amount: 0, status: "pending", memo: "",
});

// ===========================================================================
// Toast component
// ===========================================================================

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
        type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
      style={{ animation: "slideInRight 0.3s ease" }}
    >
      {type === "success" ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 bg-transparent border-none text-white cursor-pointer text-base">✕</button>
    </div>
  );
}

// ===========================================================================
// Custom Select component
// ===========================================================================

interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputClass} text-left flex items-center justify-between gap-2 cursor-pointer`}
      >
        <span className={`flex items-center gap-2 ${!selected ? "text-gray-400" : ""}`}>
          {selected?.color && (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selected.color}`} />
          )}
          {selected?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--color-gray)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-[fadeSlideDown_0.15s_ease]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 cursor-pointer transition-colors border-none ${
                opt.value === value
                  ? "bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-medium"
                  : "bg-white text-[var(--color-dark)] hover:bg-gray-50"
              }`}
            >
              {opt.color && <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.color}`} />}
              {opt.label}
              {opt.value === value && (
                <svg className="w-4 h-4 ml-auto text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Custom DatePicker component
// ===========================================================================

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS_KR = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function DatePicker({ value, onChange, placeholder = "날짜 선택" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setShowYearPicker(false); } };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && parsed) { setViewYear(parsed.getFullYear()); setViewMonth(parsed.getMonth()); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonth = () => { if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); } else setViewMonth((m) => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); } else setViewMonth((m) => m + 1); };

  const selectDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
    setShowYearPicker(false);
  };

  const clearDate = (e: React.MouseEvent) => { e.stopPropagation(); onChange(""); setOpen(false); };
  const isToday = (day: number) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  const isSelected = (day: number) => parsed && viewYear === parsed.getFullYear() && viewMonth === parsed.getMonth() && day === parsed.getDate();
  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen(!open); setShowYearPicker(false); }} className={`${inputClass} text-left flex items-center justify-between gap-2 cursor-pointer`}>
        <span className={`flex items-center gap-2 ${!value ? "text-gray-400" : ""}`}>
          <svg className="w-4 h-4 text-[var(--color-gray)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          {parsed ? formatDate(value) : placeholder}
        </span>
        {value && <span onClick={clearDate} className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"><svg className="w-3.5 h-3.5 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></span>}
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[300px] animate-[fadeSlideDown_0.15s_ease]">
          {showYearPicker ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={() => setShowYearPicker(false)} className="text-[var(--color-gray)] hover:text-[var(--color-dark)] bg-transparent border-none cursor-pointer p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                <span className="text-sm font-semibold text-[var(--color-dark)]">연도 선택</span>
                <div className="w-6" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-h-[220px] overflow-y-auto">
                {years.map((y) => (
                  <button key={y} type="button" onClick={() => { setViewYear(y); setShowYearPicker(false); }} className={`py-2 rounded-lg text-sm cursor-pointer border-none transition-colors ${y === viewYear ? "bg-[var(--color-primary)] text-white font-semibold" : y === today.getFullYear() ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-100" : "bg-transparent text-[var(--color-dark)] hover:bg-gray-100"}`}>{y}</button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-[var(--color-gray)] hover:text-[var(--color-dark)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                <button type="button" onClick={() => setShowYearPicker(true)} className="text-sm font-bold text-[var(--color-dark)] bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">{viewYear}년 {MONTHS_KR[viewMonth]}</button>
                <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-[var(--color-gray)] hover:text-[var(--color-dark)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
              </div>
              <div className="grid grid-cols-7 mb-1">{WEEKDAYS.map((d, i) => (<div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-[var(--color-gray)]"}`}>{d}</div>))}</div>
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dow = (firstDow + day - 1) % 7;
                  return (<button key={day} type="button" onClick={() => selectDate(day)} className={`py-1.5 text-sm rounded-lg cursor-pointer border-none transition-all ${isSelected(day) ? "bg-[var(--color-primary)] text-white font-bold" : isToday(day) ? "bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100" : dow === 0 ? "bg-transparent text-red-400 hover:bg-red-50" : dow === 6 ? "bg-transparent text-blue-400 hover:bg-blue-50" : "bg-transparent text-[var(--color-dark)] hover:bg-gray-100"}`}>{day}</button>);
                })}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); selectDate(today.getDate()); }} className="text-xs text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline font-medium">오늘</button>
                {value && <button type="button" onClick={clearDate} className="text-xs text-[var(--color-gray)] bg-transparent border-none cursor-pointer hover:underline">초기화</button>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// AmountInput - comma-formatted number input
// ===========================================================================

function AmountInput({ value, onChange, placeholder }: { value: number; onChange: (v: number) => void; placeholder?: string }) {
  const displayValue = value ? Number(value).toLocaleString() : "";
  return (
    <input
      className={inputClass}
      inputMode="numeric"
      placeholder={placeholder || "0"}
      value={displayValue}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        onChange(raw ? parseInt(raw, 10) : 0);
      }}
    />
  );
}

// ===========================================================================
// FormCard
// ===========================================================================

function FormCard({ title, onSave, onCancel, saving, children }: { title: string; onSave: () => void; onCancel: () => void; saving?: boolean; children: React.ReactNode }) {
  return (
    <div className={`${cardClass} mb-6 border-[var(--color-primary)]/20`}>
      <h4 className="text-[var(--color-dark)] font-semibold mb-4">{title}</h4>
      {children}
      <div className="flex gap-3 mt-5">
        <button onClick={onSave} disabled={saving} className={btnPrimary}>{saving ? "저장 중..." : "저장"}</button>
        <button onClick={onCancel} className={btnSecondary}>취소</button>
      </div>
    </div>
  );
}

// ===========================================================================
// Select option configs
// ===========================================================================

const projectStatusOptions: SelectOption[] = [
  { value: "상담중", label: "상담중", color: "bg-amber-400" },
  { value: "진행중", label: "진행중", color: "bg-blue-400" },
  { value: "완료", label: "완료", color: "bg-emerald-400" },
  { value: "유지보수", label: "유지보수", color: "bg-purple-400" },
];

const billingCycleOptions: SelectOption[] = [
  { value: "monthly", label: "월간" },
  { value: "yearly", label: "연간" },
];

const paymentTypeOptions: SelectOption[] = [
  { value: "제작비", label: "제작비" },
  { value: "호스팅", label: "호스팅" },
  { value: "도메인", label: "도메인" },
  { value: "유지보수", label: "유지보수" },
  { value: "기타", label: "기타" },
];

const paymentStatusOptions: SelectOption[] = [
  { value: "paid", label: "완료", color: "bg-emerald-400" },
  { value: "pending", label: "대기", color: "bg-amber-400" },
  { value: "overdue", label: "미납", color: "bg-red-400" },
];

const platformOptions: SelectOption[] = [
  { value: "", label: "선택 안함" },
  { value: "크몽", label: "크몽" },
  { value: "숨고", label: "숨고" },
  { value: "프리모아", label: "프리모아" },
  { value: "위시켓", label: "위시켓" },
  { value: "직접 의뢰", label: "직접 의뢰" },
  { value: "소개", label: "소개" },
  { value: "기타", label: "기타" },
];

// ===========================================================================
// Main component
// ===========================================================================

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type });

  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(false);
  const [clientSaving, setClientSaving] = useState(false);
  const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", memo: "", is_active: true, password: "" });

  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteExpires, setInviteExpires] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(defaultProjectForm());
  const [projectSaving, setProjectSaving] = useState(false);

  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [hostingFormProjectId, setHostingFormProjectId] = useState<string | null>(null);
  const [editingHostingId, setEditingHostingId] = useState<string | null>(null);
  const [hostingForm, setHostingForm] = useState(defaultHostingForm());
  const [hostingSaving, setHostingSaving] = useState(false);

  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainFormProjectId, setDomainFormProjectId] = useState<string | null>(null);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [domainForm, setDomainForm] = useState(defaultDomainForm());
  const [domainSaving, setDomainSaving] = useState(false);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm());
  const [paymentSaving, setPaymentSaving] = useState(false);

  // =========================================================================
  // API helper
  // =========================================================================

  async function api(url: string, method: string, body?: unknown): Promise<{ ok: boolean; data?: Record<string, unknown>; error?: string }> {
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "요청에 실패했습니다." };
      return { ok: true, data };
    } catch {
      return { ok: false, error: "네트워크 오류가 발생했습니다." };
    }
  }

  // =========================================================================
  // Data fetching
  // =========================================================================

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) return;
      const data = await res.json();
      setClient(data.client ?? data);
    } catch { /* ignore */ } finally { setClientLoading(false); }
  }, [clientId]);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try { const r = await fetch(`/api/clients/${clientId}/projects`); const d = await r.json(); setProjects(d.projects ?? []); }
    catch { /* ignore */ } finally { setProjectsLoading(false); }
  }, [clientId]);

  const fetchHostings = useCallback(async () => {
    try { const r = await fetch(`/api/clients/${clientId}/hosting`); const d = await r.json(); setHostings(d.hosting ?? []); }
    catch { /* ignore */ }
  }, [clientId]);

  const fetchDomains = useCallback(async () => {
    try { const r = await fetch(`/api/clients/${clientId}/domains`); const d = await r.json(); setDomains(d.domains ?? []); }
    catch { /* ignore */ }
  }, [clientId]);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try { const r = await fetch(`/api/clients/${clientId}/payments`); const d = await r.json(); setPayments(d.payments ?? []); }
    catch { /* ignore */ } finally { setPaymentsLoading(false); }
  }, [clientId]);

  useEffect(() => { fetchClient(); }, [fetchClient]);
  useEffect(() => {
    // Always fetch payments & projects (payments need project names for display)
    fetchPayments();
    fetchProjects();
    if (activeTab === "projects") { fetchHostings(); fetchDomains(); }
  }, [activeTab, fetchProjects, fetchHostings, fetchDomains, fetchPayments]);

  // =========================================================================
  // Client CRUD
  // =========================================================================

  const generateInvite = async () => {
    setInviteLoading(true);
    const r = await api("/api/invitations", "POST", { client_id: clientId });
    setInviteLoading(false);
    if (r.ok) {
      setInviteUrl(r.data!.url as string);
      setInviteExpires(r.data!.expires_at as string);
      showToast("초대 링크가 생성되었습니다.");
    } else {
      showToast(r.error!, "error");
    }
  };

  const copyInviteUrl = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
      showToast("링크가 복사되었습니다.");
    } catch {
      showToast("복사에 실패했습니다.", "error");
    }
  };

  const startEditClient = () => {
    if (!client) return;
    setClientForm({ name: client.name || "", email: client.email || "", phone: client.phone || "", memo: client.memo || "", is_active: client.is_active, password: "" });
    setEditingClient(true);
  };

  const saveClient = async () => {
    if (!clientForm.name.trim()) { showToast("이름은 필수 항목입니다.", "error"); return; }
    setClientSaving(true);
    const body: Record<string, unknown> = { name: clientForm.name, email: clientForm.email, phone: clientForm.phone, memo: clientForm.memo, is_active: clientForm.is_active };
    if (clientForm.password) body.password = clientForm.password;
    const r = await api(`/api/clients/${clientId}`, "PUT", clean(body));
    setClientSaving(false);
    if (r.ok) { setClient((r.data!.client ?? r.data) as Client); setEditingClient(false); showToast("클라이언트 정보가 저장되었습니다."); }
    else showToast(r.error!, "error");
  };

  // =========================================================================
  // Generic CRUD helpers
  // =========================================================================

  const saveEntity = async <T,>(
    entityName: string, urlBase: string, editingId: string | null, formData: Record<string, unknown>,
    setList: React.Dispatch<React.SetStateAction<T[]>>, responseKey: string,
    setSaving: (b: boolean) => void, onDone: () => void, setEditId: (id: string | null) => void,
  ) => {
    setSaving(true);
    const cleaned = clean(formData);
    if (editingId) {
      const r = await api(`${urlBase}/${editingId}`, "PUT", cleaned);
      setSaving(false);
      if (r.ok) {
        const updated = (r.data![responseKey] ?? r.data) as T;
        setList((prev) => prev.map((item) => (item as { id: string }).id === editingId ? updated : item));
        showToast(`${entityName}이(가) 수정되었습니다.`);
      } else { showToast(r.error!, "error"); return; }
    } else {
      const r = await api(urlBase, "POST", cleaned);
      setSaving(false);
      if (r.ok) {
        setList((prev) => [...prev, (r.data![responseKey] ?? r.data) as T]);
        showToast(`${entityName}이(가) 추가되었습니다.`);
      } else { showToast(r.error!, "error"); return; }
    }
    onDone();
    setEditId(null);
  };

  const deleteEntity = async <T,>(entityName: string, url: string, id: string, setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (!confirm(`이 ${entityName}을(를) 삭제하시겠습니까?`)) return;
    const r = await api(url, "DELETE");
    if (r.ok) { setList((prev) => prev.filter((item) => (item as { id: string }).id !== id)); showToast(`${entityName}이(가) 삭제되었습니다.`); }
    else showToast(r.error!, "error");
  };

  // =========================================================================
  // Projects CRUD
  // =========================================================================
  const openProjectAdd = () => { setProjectForm(defaultProjectForm()); setEditingProjectId(null); setShowProjectForm(true); };
  const openProjectEdit = (p: Project) => {
    setProjectForm({ name: p.name||"", website_url: p.website_url||"", tech_stack: p.tech_stack||"", admin_url: p.admin_url||"", admin_id: p.admin_id||"", admin_pw: p.admin_pw||"", status: p.status||"상담중", description: p.description||"", started_at: p.started_at??"", completed_at: p.completed_at??"", unit_price: p.unit_price||0, platform: p.platform||"" });
    setEditingProjectId(p.id); setShowProjectForm(true);
  };
  const saveProject = async () => {
    if (!projectForm.name.trim()) { showToast("프로젝트명은 필수입니다.", "error"); return; }
    await saveEntity<Project>("프로젝트", `/api/clients/${clientId}/projects`, editingProjectId, projectForm as unknown as Record<string, unknown>, setProjects, "project", setProjectSaving, () => setShowProjectForm(false), setEditingProjectId);
  };
  const deleteProject = (id: string) => deleteEntity<Project>("프로젝트", `/api/clients/${clientId}/projects/${id}`, id, setProjects);

  // =========================================================================
  // Hosting CRUD (per-project)
  // =========================================================================
  const openHostingAdd = (projectId: string) => {
    setHostingForm({ ...defaultHostingForm(), project_id: projectId });
    setEditingHostingId(null);
    setHostingFormProjectId(projectId);
  };
  const openHostingEdit = (projectId: string, h: Hosting) => {
    setHostingForm({ project_id: projectId, provider: h.provider||"", plan: h.plan||"", amount: h.amount, billing_cycle: h.billing_cycle||"monthly", start_date: h.start_date??"", end_date: h.end_date??"", auto_renew: h.auto_renew, memo: h.memo||"" });
    setEditingHostingId(h.id);
    setHostingFormProjectId(projectId);
  };
  const saveHosting = async () => {
    if (!hostingForm.provider.trim()) { showToast("호스팅 업체명은 필수입니다.", "error"); return; }
    await saveEntity<Hosting>("호스팅", `/api/clients/${clientId}/hosting`, editingHostingId, hostingForm as unknown as Record<string, unknown>, setHostings, "hosting", setHostingSaving, () => setHostingFormProjectId(null), setEditingHostingId);
  };
  const deleteHosting = (id: string) => deleteEntity<Hosting>("호스팅", `/api/clients/${clientId}/hosting/${id}`, id, setHostings);

  // =========================================================================
  // Domains CRUD (per-project)
  // =========================================================================
  const openDomainAdd = (projectId: string) => {
    setDomainForm({ ...defaultDomainForm(), project_id: projectId });
    setEditingDomainId(null);
    setDomainFormProjectId(projectId);
  };
  const openDomainEdit = (projectId: string, d: Domain) => {
    setDomainForm({ project_id: projectId, domain_name: d.domain_name||"", registrar: d.registrar||"", registered_date: d.registered_date??"", expires_date: d.expires_date??"", auto_renew: d.auto_renew, nameservers: d.nameservers||"", memo: d.memo||"" });
    setEditingDomainId(d.id);
    setDomainFormProjectId(projectId);
  };
  const saveDomain = async () => {
    if (!domainForm.domain_name.trim()) { showToast("도메인명은 필수입니다.", "error"); return; }
    await saveEntity<Domain>("도메인", `/api/clients/${clientId}/domains`, editingDomainId, domainForm as unknown as Record<string, unknown>, setDomains, "domain", setDomainSaving, () => setDomainFormProjectId(null), setEditingDomainId);
  };
  const deleteDomain = (id: string) => deleteEntity<Domain>("도메인", `/api/clients/${clientId}/domains/${id}`, id, setDomains);

  // =========================================================================
  // Payments CRUD
  // =========================================================================
  const openPaymentAdd = () => { setPaymentForm(defaultPaymentForm()); setEditingPaymentId(null); setShowPaymentForm(true); };
  const openPaymentEdit = (p: Payment) => {
    setPaymentForm({ project_id: p.project_id ?? null, payment_date: p.payment_date??"", type: p.type||"제작비", description: p.description||"", amount: p.amount, status: p.status||"pending", memo: p.memo||"" });
    setEditingPaymentId(p.id); setShowPaymentForm(true);
  };
  const savePayment = async () => {
    if (!paymentForm.amount || paymentForm.amount <= 0) { showToast("금액을 입력하세요.", "error"); return; }
    await saveEntity<Payment>("결제 내역", `/api/clients/${clientId}/payments`, editingPaymentId, paymentForm as unknown as Record<string, unknown>, setPayments, "payment", setPaymentSaving, () => setShowPaymentForm(false), setEditingPaymentId);
  };
  const deletePayment = (id: string) => deleteEntity<Payment>("결제 내역", `/api/clients/${clientId}/payments/${id}`, id, setPayments);

  // =========================================================================
  // Hosting-payment linkage helper
  // =========================================================================
  const hostingPayments = payments.filter((p) => p.type === "호스팅");

  // Helper: suggest next hosting payment date for a specific project
  // Uses same day-of-month from last hosting payment (e.g. 2/25 → 3/25)
  const suggestHostingDate = (projectId: string | null): string => {
    // Find last hosting payment for this project
    const projectHostingPayments = hostingPayments
      .filter((p) => projectId ? p.project_id === projectId : true)
      .sort((a, b) => (b.payment_date || "").localeCompare(a.payment_date || ""));

    if (projectHostingPayments.length > 0 && projectHostingPayments[0].payment_date) {
      const last = new Date(projectHostingPayments[0].payment_date + "T00:00:00");
      last.setMonth(last.getMonth() + 1);
      const mm = String(last.getMonth() + 1).padStart(2, "0");
      const dd = String(last.getDate()).padStart(2, "0");
      return `${last.getFullYear()}-${mm}-${dd}`;
    }

    // Fallback: check hosting start_date for this project
    const projectHostings = hostings.filter((h) => projectId ? h.project_id === projectId : true);
    if (projectHostings.length > 0 && projectHostings[0].start_date) {
      const start = new Date(projectHostings[0].start_date + "T00:00:00");
      // Suggest next month from start date with same day
      const now = new Date();
      const next = new Date(start);
      while (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
      const mm = String(next.getMonth() + 1).padStart(2, "0");
      const dd = String(next.getDate()).padStart(2, "0");
      return `${next.getFullYear()}-${mm}-${dd}`;
    }

    // Final fallback: today
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${mm}-${dd}`;
  };

  // When payment type changes, auto-suggest date for hosting
  const handlePaymentTypeChange = (type: string) => {
    setPaymentForm((prev) => {
      const updates: Partial<Omit<Payment, "id">> = { type };
      if (type === "호스팅") {
        updates.payment_date = suggestHostingDate(prev.project_id);
      }
      return { ...prev, ...updates };
    });
  };

  // When project changes, re-suggest date if type is already hosting
  const handlePaymentProjectChange = (projectId: string | null) => {
    setPaymentForm((prev) => {
      const updates: Partial<Omit<Payment, "id">> = { project_id: projectId };
      if (prev.type === "호스팅") {
        updates.payment_date = suggestHostingDate(projectId);
      }
      return { ...prev, ...updates };
    });
  };

  // =========================================================================
  // Inline hosting form
  // =========================================================================
  const renderHostingForm = () => (
    <div className="bg-blue-50/50 rounded-xl p-4 mb-3 border border-blue-100">
      <h5 className="text-[var(--color-dark)] text-sm font-semibold mb-3">{editingHostingId ? "호스팅 수정" : "호스팅 추가"}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={labelClass}>호스팅 업체 *</label><input className={inputClass} placeholder="카페24, AWS, ..." value={hostingForm.provider} onChange={(e) => setHostingForm((p) => ({ ...p, provider: e.target.value }))} /></div>
        <div><label className={labelClass}>플랜</label><input className={inputClass} placeholder="Basic, Pro, ..." value={hostingForm.plan} onChange={(e) => setHostingForm((p) => ({ ...p, plan: e.target.value }))} /></div>
        <div><label className={labelClass}>금액 (원)</label><AmountInput value={hostingForm.amount} onChange={(v) => setHostingForm((p) => ({ ...p, amount: v }))} /></div>
        <div><label className={labelClass}>결제 주기</label><CustomSelect options={billingCycleOptions} value={hostingForm.billing_cycle} onChange={(v) => setHostingForm((p) => ({ ...p, billing_cycle: v }))} /></div>
        <div><label className={labelClass}>시작일</label><DatePicker value={hostingForm.start_date} onChange={(v) => setHostingForm((p) => ({ ...p, start_date: v }))} placeholder="시작일 선택" /></div>
        <div><label className={labelClass}>만료일</label><DatePicker value={hostingForm.end_date} onChange={(v) => setHostingForm((p) => ({ ...p, end_date: v }))} placeholder="만료일 선택" /></div>
      </div>
      <div className="mt-3"><label className={labelClass}>메모</label><textarea className={`${inputClass} resize-y`} rows={2} placeholder="호스팅 관련 메모" value={hostingForm.memo} onChange={(e) => setHostingForm((p) => ({ ...p, memo: e.target.value }))} /></div>
      <label className="flex items-center gap-2 cursor-pointer mt-3"><input type="checkbox" checked={hostingForm.auto_renew} onChange={(e) => setHostingForm((p) => ({ ...p, auto_renew: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" /><span className="text-[var(--color-dark-2)] text-sm">자동 갱신</span></label>
      <div className="flex gap-2 mt-4">
        <button onClick={saveHosting} disabled={hostingSaving} className={btnPrimary}>{hostingSaving ? "저장 중..." : "저장"}</button>
        <button onClick={() => setHostingFormProjectId(null)} className={btnSecondary}>취소</button>
      </div>
    </div>
  );

  // =========================================================================
  // Inline domain form
  // =========================================================================
  const renderDomainForm = () => (
    <div className="bg-emerald-50/50 rounded-xl p-4 mb-3 border border-emerald-100">
      <h5 className="text-[var(--color-dark)] text-sm font-semibold mb-3">{editingDomainId ? "도메인 수정" : "도메인 추가"}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={labelClass}>도메인명 *</label><input className={inputClass} placeholder="example.com" value={domainForm.domain_name} onChange={(e) => setDomainForm((p) => ({ ...p, domain_name: e.target.value }))} /></div>
        <div><label className={labelClass}>등록기관</label><input className={inputClass} placeholder="가비아, 후이즈, ..." value={domainForm.registrar} onChange={(e) => setDomainForm((p) => ({ ...p, registrar: e.target.value }))} /></div>
        <div><label className={labelClass}>등록일</label><DatePicker value={domainForm.registered_date} onChange={(v) => setDomainForm((p) => ({ ...p, registered_date: v }))} placeholder="등록일 선택" /></div>
        <div><label className={labelClass}>만료일</label><DatePicker value={domainForm.expires_date} onChange={(v) => setDomainForm((p) => ({ ...p, expires_date: v }))} placeholder="만료일 선택" /></div>
        <div className="sm:col-span-2"><label className={labelClass}>네임서버</label><input className={inputClass} placeholder="ns1.example.com, ns2.example.com" value={domainForm.nameservers} onChange={(e) => setDomainForm((p) => ({ ...p, nameservers: e.target.value }))} /></div>
      </div>
      <div className="mt-3"><label className={labelClass}>메모</label><textarea className={`${inputClass} resize-y`} rows={2} placeholder="도메인 관련 메모" value={domainForm.memo} onChange={(e) => setDomainForm((p) => ({ ...p, memo: e.target.value }))} /></div>
      <label className="flex items-center gap-2 cursor-pointer mt-3"><input type="checkbox" checked={domainForm.auto_renew} onChange={(e) => setDomainForm((p) => ({ ...p, auto_renew: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" /><span className="text-[var(--color-dark-2)] text-sm">자동 갱신</span></label>
      <div className="flex gap-2 mt-4">
        <button onClick={saveDomain} disabled={domainSaving} className={btnPrimary}>{domainSaving ? "저장 중..." : "저장"}</button>
        <button onClick={() => setDomainFormProjectId(null)} className={btnSecondary}>취소</button>
      </div>
    </div>
  );

  // =========================================================================
  // Project card with inline hosting/domains
  // =========================================================================
  const renderProjectCard = (p: Project) => {
    const pHostings = hostings.filter((h) => h.project_id === p.id);
    const pDomains = domains.filter((d) => d.project_id === p.id);
    const pHostingPayments = payments.filter((pay) => pay.type === "호스팅" && pay.project_id === p.id);

    return (
      <div key={p.id} className={cardClass}>
        {/* Project header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h4 className="text-[var(--color-dark)] font-bold text-base">{p.name}</h4>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${PROJECT_STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>{p.status}</span>
              {p.platform && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 whitespace-nowrap">{p.platform}</span>}
            </div>
            {p.website_url && (
              <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] text-sm no-underline hover:underline break-all inline-flex items-center gap-1">
                {p.website_url}
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </a>
            )}
          </div>
          <div className="flex gap-1.5 ml-3 shrink-0">
            <button onClick={() => openProjectEdit(p)} className={btnSmall}>수정</button>
            <button onClick={() => deleteProject(p.id)} className={btnDanger}>삭제</button>
          </div>
        </div>

        {/* Project info grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {p.tech_stack && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">기술 스택</span>
              <span className="text-[var(--color-dark-2)] text-sm">{p.tech_stack}</span>
            </div>
          )}
          {p.unit_price > 0 && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">작업 단가</span>
              <span className="text-[var(--color-dark)] text-sm font-semibold">{formatAmount(p.unit_price)}</span>
            </div>
          )}
          {p.admin_url && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">관리자 URL</span>
              <a href={p.admin_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline text-sm truncate block">{p.admin_url}</a>
            </div>
          )}
          {p.admin_id && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">관리자 ID / PW</span>
              <span className="text-[var(--color-dark-2)] text-sm">{p.admin_id}{p.admin_pw ? ` / ${p.admin_pw}` : ""}</span>
            </div>
          )}
          {p.started_at && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">시작일</span>
              <span className="text-[var(--color-dark-2)] text-sm">{formatDate(p.started_at)}</span>
            </div>
          )}
          {p.completed_at && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[var(--color-gray)] text-xs block mb-0.5">완료일</span>
              <span className="text-[var(--color-dark-2)] text-sm">{formatDate(p.completed_at)}</span>
            </div>
          )}
        </div>
        {p.description && <p className="mt-4 pt-4 border-t border-gray-100 text-[var(--color-gray)] text-sm leading-relaxed">{p.description}</p>}

        {/* ── Hosting section ── */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[var(--color-dark)] text-sm font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg>
              호스팅
              <span className="text-[var(--color-gray)] font-normal text-xs">{pHostings.length}건</span>
            </h5>
            <button onClick={() => openHostingAdd(p.id)} className={btnMini}>+ 추가</button>
          </div>
          {hostingFormProjectId === p.id && renderHostingForm()}
          {pHostings.length === 0 && hostingFormProjectId !== p.id && (
            <p className="text-[var(--color-gray)] text-xs py-2">등록된 호스팅이 없습니다.</p>
          )}
          {pHostings.map((h) => {
            const renewalDate = getNextRenewalDate(h.end_date, h.billing_cycle);
            const daysUntil = renewalDate ? getDaysUntil(renewalDate) : null;
            const badge = daysUntil !== null ? getRenewalBadge(daysUntil) : null;

            return (
              <div key={h.id} className="bg-gray-50 rounded-xl px-4 py-3.5 mb-2 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Provider + Plan + Badges */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--color-dark)]">{h.provider}</span>
                      {h.plan && <span className="text-[var(--color-gray)] text-sm">· {h.plan}</span>}
                      {h.auto_renew && <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">자동갱신</span>}
                    </div>
                    {/* Amount + Dates */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-gray)] mb-1.5">
                      <span className="font-medium text-[var(--color-dark-2)]">{formatAmount(h.amount)} / {h.billing_cycle === "monthly" ? "월" : "년"}</span>
                      {h.start_date && <span>시작: {formatDateShort(h.start_date)}</span>}
                      {h.end_date && <span>만료: {formatDateShort(h.end_date)}</span>}
                    </div>
                    {/* Renewal date with badge */}
                    {renewalDate && badge && (
                      <div className="flex items-center gap-2 mt-1">
                        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
                        <span className="text-xs font-medium text-[var(--color-dark-2)]">
                          다음 갱신: {formatDate(renewalDate)}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </div>
                    )}
                    {/* Related hosting payments */}
                    {pHostingPayments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200/60">
                        <span className="text-xs text-[var(--color-gray)] font-medium">최근 결제:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pHostingPayments.slice(0, 3).map((hp) => {
                            const si = PAYMENT_STATUS_MAP[hp.status];
                            return (
                              <span key={hp.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-xs">
                                <span className="text-[var(--color-dark-2)]">{hp.payment_date ? formatDateShort(hp.payment_date) : "-"}</span>
                                <span className="text-[var(--color-dark)] font-medium">{formatAmount(hp.amount)}</span>
                                {si && <span className={`px-1 py-0 text-xs rounded ${si.cls}`}>{si.label}</span>}
                              </span>
                            );
                          })}
                          {pHostingPayments.length > 3 && (
                            <span className="text-xs text-[var(--color-gray)]">+{pHostingPayments.length - 3}건</span>
                          )}
                        </div>
                      </div>
                    )}
                    {h.memo && <p className="text-xs text-[var(--color-gray)] mt-1.5 italic">{h.memo}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openHostingEdit(p.id, h)} className={btnMini}>수정</button>
                    <button onClick={() => deleteHosting(h.id)} className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-400 text-xs rounded-lg cursor-pointer hover:bg-red-100 transition-all">삭제</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Domain section ── */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[var(--color-dark)] text-sm font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" /></svg>
              도메인
              <span className="text-[var(--color-gray)] font-normal text-xs">{pDomains.length}건</span>
            </h5>
            <button onClick={() => openDomainAdd(p.id)} className={btnMini}>+ 추가</button>
          </div>
          {domainFormProjectId === p.id && renderDomainForm()}
          {pDomains.length === 0 && domainFormProjectId !== p.id && (
            <p className="text-[var(--color-gray)] text-xs py-2">등록된 도메인이 없습니다.</p>
          )}
          {pDomains.map((d) => {
            const daysUntil = d.expires_date ? getDaysUntil(d.expires_date) : null;
            const badge = daysUntil !== null ? getRenewalBadge(daysUntil) : null;

            return (
              <div key={d.id} className="bg-gray-50 rounded-xl px-4 py-3.5 mb-2 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--color-dark)]">{d.domain_name}</span>
                      {d.registrar && <span className="text-[var(--color-gray)] text-sm">· {d.registrar}</span>}
                      {d.auto_renew && <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">자동갱신</span>}
                      {badge && (
                        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full border ${badge.cls}`}>
                          {badge.text}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-gray)]">
                      {d.registered_date && <span>등록: {formatDateShort(d.registered_date)}</span>}
                      {d.expires_date && (
                        <span className={isExpired(d.expires_date) ? "text-red-500 font-medium" : ""}>
                          만료: {formatDateShort(d.expires_date)}
                          {isExpired(d.expires_date) && " (만료됨)"}
                        </span>
                      )}
                      {d.nameservers && <span>NS: {d.nameservers}</span>}
                    </div>
                    {d.memo && <p className="text-xs text-[var(--color-gray)] mt-1.5 italic">{d.memo}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openDomainEdit(p.id, d)} className={btnMini}>수정</button>
                    <button onClick={() => deleteDomain(d.id)} className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-400 text-xs rounded-lg cursor-pointer hover:bg-red-100 transition-all">삭제</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // =========================================================================
  // Tab renderers
  // =========================================================================

  const renderProjectsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[var(--color-dark)] font-bold text-lg">프로젝트 <span className="text-[var(--color-gray)] font-normal text-sm ml-1">{projects.length}건</span></h3>
        <button onClick={openProjectAdd} className={btnPrimary}>+ 추가</button>
      </div>
      {showProjectForm && (
        <FormCard title={editingProjectId ? "프로젝트 수정" : "새 프로젝트"} onSave={saveProject} onCancel={() => { setShowProjectForm(false); setEditingProjectId(null); }} saving={projectSaving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>프로젝트명 *</label><input className={inputClass} placeholder="프로젝트명" value={projectForm.name} onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))} /></div>
            <div><label className={labelClass}>상태</label><CustomSelect options={projectStatusOptions} value={projectForm.status} onChange={(v) => setProjectForm((p) => ({ ...p, status: v }))} /></div>
            <div><label className={labelClass}>웹사이트 URL</label><input className={inputClass} placeholder="https://example.com" value={projectForm.website_url} onChange={(e) => setProjectForm((p) => ({ ...p, website_url: e.target.value }))} /></div>
            <div><label className={labelClass}>기술 스택</label><input className={inputClass} placeholder="Next.js, React, ..." value={projectForm.tech_stack} onChange={(e) => setProjectForm((p) => ({ ...p, tech_stack: e.target.value }))} /></div>
            <div><label className={labelClass}>관리자 URL</label><input className={inputClass} placeholder="https://example.com/admin" value={projectForm.admin_url} onChange={(e) => setProjectForm((p) => ({ ...p, admin_url: e.target.value }))} /></div>
            <div><label className={labelClass}>관리자 ID</label><input className={inputClass} placeholder="admin ID" value={projectForm.admin_id} onChange={(e) => setProjectForm((p) => ({ ...p, admin_id: e.target.value }))} /></div>
            <div><label className={labelClass}>관리자 PW</label><input className={inputClass} placeholder="admin PW" value={projectForm.admin_pw} onChange={(e) => setProjectForm((p) => ({ ...p, admin_pw: e.target.value }))} /></div>
            <div><label className={labelClass}>작업 단가 (원)</label><AmountInput value={projectForm.unit_price} onChange={(v) => setProjectForm((p) => ({ ...p, unit_price: v }))} /></div>
            <div><label className={labelClass}>수주 플랫폼</label><CustomSelect options={platformOptions} value={projectForm.platform} onChange={(v) => setProjectForm((p) => ({ ...p, platform: v }))} placeholder="플랫폼 선택" /></div>
            <div><label className={labelClass}>시작일</label><DatePicker value={projectForm.started_at} onChange={(v) => setProjectForm((p) => ({ ...p, started_at: v }))} placeholder="시작일 선택" /></div>
            <div><label className={labelClass}>완료일</label><DatePicker value={projectForm.completed_at} onChange={(v) => setProjectForm((p) => ({ ...p, completed_at: v }))} placeholder="완료일 선택" /></div>
          </div>
          <div><label className={labelClass}>설명</label><textarea className={`${inputClass} resize-y`} rows={3} placeholder="프로젝트에 대한 설명" value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} /></div>
        </FormCard>
      )}
      {projectsLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className={`${cardClass} animate-pulse`}>
              <div className="flex items-center gap-3 mb-4"><div className="h-5 bg-gray-200 rounded w-40" /><div className="h-5 bg-gray-100 rounded-full w-16" /></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><div className="h-12 bg-gray-50 rounded-lg" /><div className="h-12 bg-gray-50 rounded-lg" /><div className="h-12 bg-gray-50 rounded-lg" /></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
          <p className="text-[var(--color-gray)] text-sm">등록된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-5">{projects.map(renderProjectCard)}</div>
      )}
    </div>
  );

  const renderPaymentsTab = () => {
    const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
    const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[var(--color-dark)] font-bold text-lg">결제 내역 <span className="text-[var(--color-gray)] font-normal text-sm ml-1">{payments.length}건</span></h3>
          <button onClick={openPaymentAdd} className={btnPrimary}>+ 추가</button>
        </div>

        {/* Summary cards */}
        {payments.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 text-center">
              <p className="text-emerald-600 text-xs font-medium mb-1">완료</p>
              <p className="text-emerald-700 font-bold">{formatAmount(totalPaid)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-center">
              <p className="text-amber-600 text-xs font-medium mb-1">대기</p>
              <p className="text-amber-700 font-bold">{formatAmount(totalPending)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-center">
              <p className="text-red-500 text-xs font-medium mb-1">미납</p>
              <p className="text-red-700 font-bold">{formatAmount(totalOverdue)}</p>
            </div>
          </div>
        )}

        {showPaymentForm && (
          <FormCard title={editingPaymentId ? "결제 수정" : "새 결제"} onSave={savePayment} onCancel={() => { setShowPaymentForm(false); setEditingPaymentId(null); }} saving={paymentSaving}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>프로젝트</label>
                <CustomSelect
                  options={[{ value: "", label: "프로젝트 미지정" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
                  value={paymentForm.project_id || ""}
                  onChange={(v) => handlePaymentProjectChange(v || null)}
                  placeholder="프로젝트 선택"
                />
              </div>
              <div><label className={labelClass}>유형</label><CustomSelect options={paymentTypeOptions} value={paymentForm.type} onChange={handlePaymentTypeChange} /></div>
              <div><label className={labelClass}>금액 (원) *</label><AmountInput value={paymentForm.amount} onChange={(v) => setPaymentForm((p) => ({ ...p, amount: v }))} /></div>
              <div>
                <label className={labelClass}>결제일{paymentForm.type === "호스팅" && paymentForm.payment_date && <span className="text-[var(--color-accent)] ml-1">(자동추천)</span>}</label>
                <DatePicker value={paymentForm.payment_date} onChange={(v) => setPaymentForm((p) => ({ ...p, payment_date: v }))} placeholder="결제일 선택" />
              </div>
              <div><label className={labelClass}>상태</label><CustomSelect options={paymentStatusOptions} value={paymentForm.status} onChange={(v) => setPaymentForm((p) => ({ ...p, status: v }))} /></div>
              <div><label className={labelClass}>설명</label><input className={inputClass} placeholder="결제 설명" value={paymentForm.description} onChange={(e) => setPaymentForm((p) => ({ ...p, description: e.target.value }))} /></div>
            </div>
            <div><label className={labelClass}>메모</label><textarea className={`${inputClass} resize-y`} rows={2} placeholder="결제 관련 메모" value={paymentForm.memo} onChange={(e) => setPaymentForm((p) => ({ ...p, memo: e.target.value }))} /></div>
          </FormCard>
        )}

        {paymentsLoading ? (
          <div className={`${cardClass} animate-pulse`}>
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}</div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
            <p className="text-[var(--color-gray)] text-sm">등록된 결제 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">결제일</th>
                    <th className="text-left py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">프로젝트</th>
                    <th className="text-left py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">유형</th>
                    <th className="text-left py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">설명</th>
                    <th className="text-right py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">금액</th>
                    <th className="text-center py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">상태</th>
                    <th className="text-right py-3.5 px-4 text-[var(--color-gray)] font-medium text-xs uppercase tracking-wide">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const si = PAYMENT_STATUS_MAP[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                    const linkedProject = p.project_id ? projects.find((pr) => pr.id === p.project_id) : null;
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 text-[var(--color-dark-2)]">{p.payment_date ? formatDateShort(p.payment_date) : "-"}</td>
                        <td className="py-3.5 px-4">
                          {linkedProject ? (
                            <span className="text-[var(--color-dark-2)] text-sm">{linkedProject.name}</span>
                          ) : (
                            <span className="text-[var(--color-gray)] text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[var(--color-dark-2)]">{p.type}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--color-gray)]">{p.description || "-"}</td>
                        <td className="py-3.5 px-4 text-[var(--color-dark)] font-semibold text-right">{formatAmount(p.amount)}</td>
                        <td className="py-3.5 px-4 text-center"><span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${si.cls}`}>{si.label}</span></td>
                        <td className="py-3.5 px-4 text-right"><div className="flex gap-1.5 justify-end"><button onClick={() => openPaymentEdit(p)} className={btnSmall}>수정</button><button onClick={() => deletePayment(p.id)} className={btnDanger}>삭제</button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // Tab config
  // =========================================================================
  const tabConfig: { key: TabKey; label: string; count: number; icon: string }[] = [
    { key: "projects", label: "프로젝트", count: projects.length, icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { key: "payments", label: "결제", count: payments.length, icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "projects": return renderProjectsTab();
      case "payments": return renderPaymentsTab();
    }
  };

  // =========================================================================
  // Main render
  // =========================================================================

  if (clientLoading) return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
          <div className={cardClass}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div><div className="h-5 bg-gray-200 rounded w-40 mb-2" /><div className="h-3 bg-gray-100 rounded w-24" /></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-gray-50 rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      <div className="text-center py-20">
        <p className="text-[var(--color-gray)] mb-4">클라이언트를 찾을 수 없습니다.</p>
        <Link href="/admin/clients" className="text-[var(--color-accent)] no-underline font-semibold hover:underline">목록으로 돌아가기</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Back link */}
        <Link href="/admin/clients" className="text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors flex items-center gap-1.5 text-sm mb-6 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          클라이언트 목록
        </Link>

        {/* Client info card */}
        <div className={`${cardClass} mb-8`}>
          {editingClient ? (
            <div>
              <h3 className="text-[var(--color-dark)] font-bold text-lg mb-5">클라이언트 정보 수정</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>이름 *</label><input className={inputClass} value={clientForm.name} onChange={(e) => setClientForm((p) => ({ ...p, name: e.target.value }))} /></div>
                <div><label className={labelClass}>이메일</label><input type="text" className={inputClass} value={clientForm.email} onChange={(e) => setClientForm((p) => ({ ...p, email: e.target.value }))} /></div>
                <div><label className={labelClass}>전화번호</label><input type="text" className={inputClass} value={clientForm.phone} onChange={(e) => setClientForm((p) => ({ ...p, phone: e.target.value }))} /></div>
                <div><label className={labelClass}>비밀번호 (변경 시에만)</label><input type="password" className={inputClass} placeholder="변경할 비밀번호 입력" value={clientForm.password} onChange={(e) => setClientForm((p) => ({ ...p, password: e.target.value }))} /></div>
              </div>
              <div className="mb-4"><label className={labelClass}>메모</label><textarea className={`${inputClass} resize-y`} rows={3} value={clientForm.memo} onChange={(e) => setClientForm((p) => ({ ...p, memo: e.target.value }))} /></div>
              <div className="flex items-center gap-4 mb-5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={clientForm.is_active} onChange={(e) => setClientForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" /><span className="text-[var(--color-dark-2)] text-sm">활성 계정</span></label></div>
              <div className="flex gap-3"><button onClick={saveClient} disabled={clientSaving} className={btnPrimary}>{clientSaving ? "저장 중..." : "저장"}</button><button onClick={() => setEditingClient(false)} className={btnSecondary}>취소</button></div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 ${client.is_active ? "bg-gradient-to-br from-[var(--color-primary)] to-blue-600" : "bg-gray-400"}`}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="text-xl font-bold text-[var(--color-dark)]">{client.name}</h2>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${client.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {client.is_active ? "활성" : "비활성"}
                      </span>
                      {client.username ? (
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-200">등록 완료</span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-200">미등록</span>
                      )}
                    </div>
                    {client.username ? (
                      <p className="text-[var(--color-gray)] text-sm">@{client.username}</p>
                    ) : (
                      <p className="text-[var(--color-gray)] text-sm">초대 링크를 보내 계정 등록을 안내하세요</p>
                    )}
                  </div>
                </div>
                <button onClick={startEditClient} className={btnSmall}>수정</button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {client.email && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-[var(--color-gray)] text-xs block mb-0.5">이메일</span>
                    <span className="text-[var(--color-dark)] text-sm">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-[var(--color-gray)] text-xs block mb-0.5">전화번호</span>
                    <span className="text-[var(--color-dark)] text-sm">{client.phone}</span>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <span className="text-[var(--color-gray)] text-xs block mb-0.5">등록일</span>
                  <span className="text-[var(--color-dark)] text-sm">{formatDate(client.created_at)}</span>
                </div>
                {client.username && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-[var(--color-gray)] text-xs block mb-0.5">아이디</span>
                    <span className="text-[var(--color-dark)] text-sm">{client.username}</span>
                  </div>
                )}
              </div>
              {client.memo && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[var(--color-gray)] text-xs block mb-1.5">메모</span>
                  <p className="text-[var(--color-dark-2)] text-sm whitespace-pre-wrap bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">{client.memo}</p>
                </div>
              )}
              {/* Invitation link section - only for unregistered clients */}
              {!client.username && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {inviteUrl ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                        </svg>
                        <span className="text-blue-700 text-sm font-semibold">초대 링크</span>
                        {inviteExpires && (
                          <span className="text-blue-500 text-xs ml-auto">만료: {formatDate(inviteExpires)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={inviteUrl}
                          className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-[var(--color-dark)] select-all focus:outline-none"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          onClick={copyInviteUrl}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold border-none cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          {inviteCopied ? (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              복사됨
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                              복사
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={generateInvite}
                      disabled={inviteLoading}
                      className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {inviteLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          생성 중...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                          </svg>
                          초대 링크 생성
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[var(--color-primary)] text-[var(--color-dark)]"
                  : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)] hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === tab.key ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-[var(--color-gray)]"
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {renderActiveTab()}
      </div>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
