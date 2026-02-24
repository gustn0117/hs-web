"use client";

import { useEffect, useRef, FormEvent, useState } from "react";
import Link from "next/link";

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "이메일",
    value: "contact@hsweb.co.kr",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "전화",
    value: "010-0000-0000",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "주소",
    value: "서울특별시 강남구",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "운영 시간",
    value: "평일 09:00 - 18:00",
  },
];

const quickFaqs = [
  { q: "제작 비용은?", a: "80만원부터 시작" },
  { q: "제작 기간은?", a: "기본 2~3주" },
  { q: "유지보수는?", a: "1~6개월 무상 포함" },
];

function FloatingInput({ label, type = "text", placeholder, required = false }: { label: string; type?: string; placeholder: string; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isActive
            ? "top-1.5 text-[0.7rem] font-semibold text-[var(--color-primary)]"
            : "top-3.5 text-[0.95rem] text-[var(--color-gray-light)]"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={isActive ? placeholder : ""}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className={`input-glow w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl text-[0.95rem] transition-all focus:outline-none bg-white ${isActive ? 'border-[var(--color-primary)]' : ''}`}
      />
    </div>
  );
}

function FloatingSelect({ label, options }: { label: string; options: string[] }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
          isActive
            ? "top-1.5 text-[0.7rem] font-semibold text-[var(--color-primary)]"
            : "top-3.5 text-[0.95rem] text-[var(--color-gray-light)]"
        }`}
      >
        {label}
      </label>
      <select
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className={`input-glow w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl text-[0.95rem] transition-all focus:outline-none bg-white ${isActive ? 'border-[var(--color-primary)]' : ''}`}
      >
        <option value="">{isActive ? "선택해주세요" : ""}</option>
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function FloatingTextarea({ label, placeholder }: { label: string; placeholder: string }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isActive
            ? "top-1.5 text-[0.7rem] font-semibold text-[var(--color-primary)]"
            : "top-3.5 text-[0.95rem] text-[var(--color-gray-light)]"
        }`}
      >
        {label}
      </label>
      <textarea
        placeholder={isActive ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className={`input-glow w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl text-[0.95rem] transition-all focus:outline-none bg-white min-h-[120px] resize-y ${isActive ? 'border-[var(--color-primary)]' : ''}`}
      />
    </div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up, .fade-left, .fade-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert("상담 신청이 완료되었습니다!\n빠른 시일 내에 연락드리겠습니다.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section className="pt-32 pb-24 relative overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/20 to-indigo-50/10 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            CONTACT
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            문의하기
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto mb-4">
            프로젝트에 대해 자유롭게 상담해주세요. 24시간 내 답변드립니다.
          </p>
          {/* Response time badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-[0.82rem] font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            평균 응답 시간: 24시간 이내
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="fade-left">
            <h3 className="text-[1.6rem] font-extrabold mb-4">
              HS WEB에 문의하세요
            </h3>
            <p className="text-[var(--color-gray)] mb-8 leading-relaxed">
              홈페이지 제작, 리뉴얼, 유지보수 등 궁금하신 점이 있으시면 언제든
              연락 주세요. 친절하게 상담해드리겠습니다.
            </p>
            <div className="space-y-4 mb-8">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-emerald-400 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/15 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">{item.label}</h4>
                    <p className="text-[var(--color-gray)] text-[0.9rem]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-[0.9rem] text-[var(--color-dark)]">서울특별시 강남구</div>
                  <div className="text-[var(--color-gray)] text-[0.78rem]">오프라인 미팅 가능 (사전 예약)</div>
                </div>
              </div>
            </div>

            {/* Quick FAQ */}
            <div>
              <h4 className="font-bold text-[0.9rem] text-[var(--color-dark)] mb-3">빠른 FAQ</h4>
              <div className="flex flex-wrap gap-2">
                {quickFaqs.map((faq) => (
                  <Link
                    key={faq.q}
                    href="/#faq"
                    className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 text-[0.8rem] no-underline text-[var(--color-dark-2)] hover:border-[var(--color-primary)]/30 transition-all duration-300"
                  >
                    <span className="font-semibold">{faq.q}</span>
                    <span className="text-[var(--color-primary)] font-medium">{faq.a}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <form
            className="fade-right bg-white p-9 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FloatingInput label="이름" placeholder="홍길동" required />
              <FloatingInput label="연락처" type="tel" placeholder="010-0000-0000" required />
            </div>
            <div className="mb-4">
              <FloatingInput label="이메일" type="email" placeholder="example@email.com" />
            </div>
            <div className="mb-4">
              <FloatingSelect label="문의 유형" options={["홈페이지 제작", "쇼핑몰 구축", "랜딩페이지", "웹 애플리케이션", "유지보수", "기타"]} />
            </div>
            <div className="mb-5">
              <FloatingTextarea label="문의 내용" placeholder="프로젝트에 대해 자유롭게 설명해주세요." />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-ripple w-full py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  전송 중...
                </>
              ) : (
                "상담 신청하기"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
