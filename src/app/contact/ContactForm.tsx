"use client";

import { FormEvent, useState } from "react";

const categoryOptions = [
  { value: "responsive-web", label: "반응형 홈페이지" },
  { value: "ecommerce", label: "쇼핑몰 구축" },
  { value: "landing-page", label: "랜딩페이지" },
  { value: "web-app", label: "웹 애플리케이션" },
  { value: "cms", label: "CMS 시스템" },
  { value: "marketing", label: "기술 마케팅" },
  { value: "other", label: "기타" },
];

const budgetOptions = [
  "~ 30만원",
  "30~100만원",
  "100~300만원",
  "300만원 이상",
  "상담 후 결정",
];

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      category: formData.get("category"),
      budget: formData.get("budget"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("요청 실패");
      setSent(true);
    } catch {
      setError("전송 중 오류가 발생했습니다. 전화로 문의해주세요.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="border border-[var(--color-point)] bg-[var(--color-point-bg)] p-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-point)] text-white mb-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-[15px] font-bold text-[var(--color-text)] mb-1">문의가 접수되었습니다</p>
        <p className="text-[12px] text-[var(--color-text-2)]">24시간 이내 담당자가 회신해드립니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0 text-[13px]">
      {/* Info grid — table-like labels */}
      <div className="border border-[var(--color-border)]">
        <FormRow label="이름" required>
          <input name="name" required className="p-input" placeholder="홍길동" />
        </FormRow>
        <FormRow label="회사/상호">
          <input name="company" className="p-input" placeholder="(선택) 회사명이 있다면 입력" />
        </FormRow>
        <FormRow label="연락처" required>
          <input name="phone" required type="tel" className="p-input tnum" placeholder="010-0000-0000" />
        </FormRow>
        <FormRow label="이메일">
          <input name="email" type="email" className="p-input" placeholder="name@example.com" />
        </FormRow>
        <FormRow label="문의 분야" required>
          <select name="category" required className="p-input" defaultValue="">
            <option value="" disabled>선택하세요</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="예산 규모">
          <select name="budget" className="p-input" defaultValue="">
            <option value="" disabled>선택하세요</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="문의 내용" required fullWidth>
          <textarea
            name="message"
            required
            rows={6}
            className="p-textarea"
            placeholder="프로젝트 요구사항, 참고 사이트, 희망 일정 등을 자유롭게 작성해주세요."
          />
        </FormRow>
      </div>

      {error && (
        <p className="mt-3 px-3 py-2 border border-[var(--color-point)] bg-[var(--color-point-bg)] text-[12px] text-[var(--color-point-dark)]">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
        <p className="text-[11px] text-[var(--color-muted)]">
          전송 시 <a href="/privacy" className="underline hover:text-[var(--color-point)]">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
        </p>
        <div className="flex items-center gap-2">
          <a href="tel:010-3319-2509" className="p-btn tnum no-underline">010-3319-2509</a>
          <button type="submit" disabled={sending} className="p-btn p-btn-point p-btn-lg">
            {sending ? "전송 중..." : "문의 보내기"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormRow({ label, required, fullWidth, children }: { label: string; required?: boolean; fullWidth?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex flex-col md:flex-row border-b border-[var(--color-border)] last:border-b-0 ${
        fullWidth ? "md:items-start" : "md:items-center"
      }`}
    >
      <div
        className={`w-full md:w-[130px] shrink-0 px-4 ${
          fullWidth ? "pt-3 md:pb-0 pb-1" : "py-3"
        } bg-[var(--color-bg-alt)] text-[12px] font-semibold text-[var(--color-text-2)] border-b md:border-b-0 md:border-r border-[var(--color-border)] flex items-center`}
      >
        {label}
        {required && <span className="text-[var(--color-point)] ml-0.5">*</span>}
      </div>
      <div className="flex-1 px-4 py-3">{children}</div>
    </div>
  );
}
