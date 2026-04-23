"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { value: "responsive-web", label: "반응형 홈페이지", desc: "기본 5~10페이지 구성", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" },
  { value: "ecommerce", label: "쇼핑몰 구축", desc: "결제·재고·회원 관리", icon: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" },
  { value: "landing-page", label: "랜딩페이지", desc: "단일 페이지 · 전환 최적화", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h12a2.25 2.25 0 002.25-2.25V3M3.75 3h16.5M8.25 21h7.5M12 16.5v4.5" },
  { value: "web-app", label: "웹 애플리케이션", desc: "맞춤형 기능 개발", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
  { value: "cms", label: "CMS 시스템", desc: "관리자·콘텐츠 운영", icon: "M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" },
  { value: "marketing", label: "기술 마케팅", desc: "SEO·광고·분석", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { value: "other", label: "기타", desc: "상담 후 결정", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const BUDGETS = ["~ 30만원", "30~100만원", "100~300만원", "300~500만원", "500만원 이상", "상담 후 결정"];
const TIMELINES = ["지금 바로", "1개월 이내", "3개월 이내", "여유 있음", "미정"];

function formatPhone(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const MESSAGE_MAX = 1000;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailValid = useMemo(() => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const phoneValid = useMemo(() => phone.replace(/\D/g, "").length >= 9, [phone]);
  const canSubmit =
    name.trim().length > 0 && phoneValid && category && message.trim().length >= 10 && agree && emailValid;

  const completedCount = [
    name.trim().length > 0,
    phoneValid,
    !!category,
    message.trim().length >= 10,
    agree,
  ].filter(Boolean).length;
  const progress = Math.round((completedCount / 5) * 100);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, category: true, message: true });
    if (!canSubmit) return;

    setError("");
    setSending(true);

    const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label || category;
    const meta: string[] = [];
    if (company) meta.push(`• 회사/상호: ${company}`);
    if (budget) meta.push(`• 예산: ${budget}`);
    if (timeline) meta.push(`• 희망 일정: ${timeline}`);
    if (referenceUrl) meta.push(`• 참고 사이트: ${referenceUrl}`);

    const composedMessage =
      meta.length > 0 ? `${message}\n\n─── 추가 정보 ───\n${meta.join("\n")}` : message;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          type: categoryLabel,
          message: composedMessage,
        }),
      });
      if (!res.ok) throw new Error("요청 실패");
      setSent(true);
    } catch {
      setError("전송 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="text-center py-16 md:py-24 px-6">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--c-main-bg)] text-[var(--c-main)] mb-8">
          <span className="absolute inset-0 rounded-full bg-[var(--c-main-bg)] animate-ping opacity-60" />
          <svg className="relative w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-[26px] md:text-[30px] font-bold tracking-[-0.03em] text-[var(--c-text)] mb-3">
          문의가 접수되었습니다.
        </h3>
        <p className="text-[15px] text-[var(--c-sub)] leading-[1.8] mb-10 max-w-[460px] mx-auto">
          <strong className="text-[var(--c-text)]">{name}</strong>님, 감사합니다.
          <br />
          <strong className="text-[var(--c-text)]">24시간 이내</strong>에 담당자가 회신드립니다.
          <br />
          평일 업무 시간 기준으로는 보통 <strong className="text-[var(--c-text)]">1시간 이내</strong>입니다.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <a href="tel:010-3319-2509" className="p-btn p-btn-lg tnum">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            010-3319-2509
          </a>
          <Link href="/portfolio" className="p-btn p-btn-dark p-btn-lg">
            포트폴리오 보기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Sticky progress */}
      <div className="sticky top-[68px] z-10 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-white/90 backdrop-blur border-b border-[var(--c-line)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-1.5 rounded-full bg-[var(--c-bg-2)] overflow-hidden">
            <div
              className="h-full bg-[var(--c-text)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-[var(--c-sub)] tnum shrink-0 whitespace-nowrap">
            {completedCount} / 5 필수 완료
          </span>
        </div>
      </div>

      {/* STEP 01 — Category */}
      <Step step="01" title="어떤 프로젝트인가요?" desc="가장 가까운 유형을 하나 선택해주세요." required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`group relative flex items-center gap-4 p-5 rounded-[12px] border text-left transition-all ${
                  active
                    ? "border-[var(--c-text)] bg-[var(--c-text)] text-white shadow-sm"
                    : "border-[var(--c-line)] bg-white hover:border-[var(--c-line-3)] hover:bg-[var(--c-bg-1)]"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-[10px] shrink-0 ${
                    active ? "bg-white/10 text-white" : "bg-[var(--c-bg-2)] text-[var(--c-text-2)]"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[15px] font-bold tracking-tight ${active ? "text-white" : "text-[var(--c-text)]"}`}>
                    {c.label}
                  </p>
                  <p className={`text-[12.5px] mt-0.5 ${active ? "text-white/70" : "text-[var(--c-sub)]"}`}>
                    {c.desc}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "bg-white border-white" : "border-[var(--c-line-2)]"
                  }`}
                >
                  {active && (
                    <svg className="w-3 h-3 text-[var(--c-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {touched.category && !category && <ErrorLine>문의 분야를 선택해주세요.</ErrorLine>}
      </Step>

      {/* STEP 02 — Budget & Timeline */}
      <Step step="02" title="예산과 일정을 알려주세요." desc="선택 사항입니다. 알려주시면 더 정확한 견적을 드릴 수 있어요.">
        <div className="space-y-7">
          <ChipRow label="예산 규모" options={BUDGETS} value={budget} onChange={setBudget} />
          <ChipRow label="희망 일정" options={TIMELINES} value={timeline} onChange={setTimeline} />
        </div>
      </Step>

      {/* STEP 03 — Contact */}
      <Step step="03" title="어디로 연락드릴까요?" desc="평일 10:00~19:00 사이에 가장 빠르게 회신됩니다." required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
          <Field label="이름" required error={touched.name && !name.trim() ? "이름을 입력해주세요." : ""}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className="p-input"
              placeholder="홍길동"
              autoComplete="name"
            />
          </Field>
          <Field label="회사/상호" hint="선택">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-input"
              placeholder="회사명이 있다면 입력"
              autoComplete="organization"
            />
          </Field>
          <Field label="연락처" required error={touched.phone && !phoneValid ? "유효한 전화번호를 입력해주세요." : ""}>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              type="tel"
              inputMode="numeric"
              className="p-input tnum"
              placeholder="010-0000-0000"
              autoComplete="tel"
            />
          </Field>
          <Field
            label="이메일"
            hint="선택"
            error={touched.email && !emailValid ? "이메일 형식이 올바르지 않습니다." : ""}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              type="email"
              className="p-input"
              placeholder="name@example.com"
              autoComplete="email"
            />
          </Field>
        </div>
      </Step>

      {/* STEP 04 — Message */}
      <Step
        step="04"
        title="프로젝트를 소개해주세요."
        desc="요구사항, 현재 상황, 참고 사이트 등 자세할수록 좋습니다."
        required
        last
      >
        <div className="space-y-5">
          <Field label="참고 사이트" hint="선택 · URL">
            <input
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              type="url"
              className="p-input"
              placeholder="https://example.com"
            />
          </Field>
          <Field
            label="문의 내용"
            required
            error={touched.message && message.trim().length < 10 ? "최소 10자 이상 입력해주세요." : ""}
          >
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                rows={8}
                className="p-textarea resize-y"
                placeholder={`예시) 인테리어 업체 반응형 홈페이지 제작 의뢰합니다.\n- 페이지: 메인 / 소개 / 포트폴리오 / 문의\n- 참고: https://example.com\n- 일정: 3월 내 오픈 희망`}
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-[var(--c-sub-2)] tnum bg-white/90 backdrop-blur px-2 py-0.5 rounded">
                {message.length.toLocaleString()} / {MESSAGE_MAX.toLocaleString()}
              </div>
            </div>
          </Field>
        </div>
      </Step>

      {/* Agree */}
      <div className="pt-10">
        <label className="flex items-start gap-3 p-5 rounded-[12px] border border-[var(--c-line)] bg-[var(--c-bg-1)] cursor-pointer select-none hover:border-[var(--c-line-3)] transition-colors">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 w-[18px] h-[18px] accent-[var(--c-text)] cursor-pointer shrink-0"
          />
          <span className="flex-1 text-[13.5px] text-[var(--c-text-2)] leading-[1.7]">
            <strong className="text-[var(--c-text)] font-bold">개인정보 수집·이용에 동의합니다</strong>{" "}
            <span className="text-[var(--c-hot)] font-semibold">(필수)</span>
            <br />
            <span className="text-[12.5px] text-[var(--c-sub)]">
              수집 항목: 이름·연락처·이메일 · 이용 목적: 상담 회신 · 보관 기간: 상담 완료 후 3년{" "}
              <Link href="/privacy" className="underline hover:text-[var(--c-text)]">
                자세히
              </Link>
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 p-4 rounded-[10px] border border-[var(--c-hot)] bg-[var(--c-hot-bg)]">
          <svg className="w-4 h-4 text-[var(--c-hot)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-[13px] text-[var(--c-hot)] font-medium leading-[1.5]">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="mt-10 pt-8 border-t border-[var(--c-line)] flex items-center justify-between gap-4 flex-wrap">
        <a
          href="tel:010-3319-2509"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--c-text-2)] hover:text-[var(--c-text)] no-underline tnum"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          바로 전화 · 010-3319-2509
        </a>
        <button
          type="submit"
          disabled={sending || !canSubmit}
          className="inline-flex items-center justify-center gap-2 h-[54px] px-9 rounded-[12px] bg-[var(--c-text)] text-white font-bold text-[15px] border-0 cursor-pointer transition-all hover:bg-black disabled:bg-[var(--c-sub-2)] disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              전송 중...
            </>
          ) : (
            <>
              문의 보내기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Step({
  step,
  title,
  desc,
  required,
  last,
  children,
}: {
  step: string;
  title: string;
  desc?: string;
  required?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`pt-10 md:pt-12 ${last ? "" : "pb-10 md:pb-12 border-b border-[var(--c-line)]"}`}>
      <div className="flex items-start gap-4 md:gap-5 mb-6 md:mb-7">
        <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-[var(--c-line-2)] text-[12px] font-black text-[var(--c-sub)] tnum bg-white">
          {step}
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="text-[18px] md:text-[20px] font-bold tracking-[-0.02em] text-[var(--c-text)]">
            {title}
            {required && <span className="text-[var(--c-hot)] ml-1">*</span>}
          </h3>
          {desc && <p className="text-[13.5px] text-[var(--c-sub)] mt-1.5 leading-[1.6]">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[12.5px] font-bold text-[var(--c-text-2)] mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(value === o ? "" : o)}
            className={`inline-flex items-center h-10 px-4 rounded-full border text-[13px] font-semibold transition-all ${
              value === o
                ? "border-[var(--c-text)] bg-[var(--c-text)] text-white"
                : "border-[var(--c-line-2)] bg-white text-[var(--c-text-2)] hover:border-[var(--c-line-3)]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[13px] font-bold text-[var(--c-text)]">
          {label}
          {required && <span className="text-[var(--c-hot)] ml-0.5">*</span>}
        </label>
        {hint && !error && <span className="text-[11.5px] text-[var(--c-sub-2)]">{hint}</span>}
      </div>
      {children}
      {error && <ErrorLine>{error}</ErrorLine>}
    </div>
  );
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1 mt-2 text-[12px] text-[var(--c-hot)] font-semibold">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </p>
  );
}
