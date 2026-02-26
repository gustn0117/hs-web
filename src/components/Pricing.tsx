"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    subtitle: "소규모 비즈니스",
    desc: "깔끔한 홈페이지가 필요한 개인사업자와 스타트업을 위한 패키지",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    features: [
      "반응형 디자인 (5페이지)",
      "기본 SEO 설정",
      "도메인 & 호스팅 가이드",
      "빠른 제작 진행",
      "1개월 무상 유지보수",
    ],
    popular: false,
  },
  {
    name: "Professional",
    subtitle: "성장하는 비즈니스",
    desc: "브랜딩과 기능 모두 잡고 싶은 중소기업을 위한 전문 패키지",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    features: [
      "맞춤형 디자인 (10페이지)",
      "고급 SEO & 성능 최적화",
      "관리자 페이지",
      "빠른 제작 진행",
      "3개월 무상 유지보수",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    subtitle: "대규모 프로젝트",
    desc: "쇼핑몰, 웹앱 등 복잡한 요구사항에 맞춘 풀 커스텀 솔루션",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    features: [
      "풀 커스텀 디자인 & 개발",
      "쇼핑몰 / 웹앱 / API 연동",
      "전담 PM 배정",
      "빠른 제작 진행",
      "6개월 무상 유지보수",
    ],
    popular: false,
  },
];

const commonFeatures = [
  "SSL 보안 인증서",
  "Google Analytics 연동",
  "반응형 모바일 최적화",
  "크로스 브라우저 테스트",
  "소스코드 100% 제공",
  "CDN 성능 최적화",
  "웹 표준 & 접근성 준수",
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);

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
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-32 pb-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PRICING
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            플랜 안내
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[520px] mx-auto leading-relaxed">
            프로젝트에 맞는 플랜을 선택하시면<br className="hidden sm:block" />
            상담을 통해 정확한 견적을 안내드립니다.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`fade-up group rounded-2xl transition-all duration-300 flex flex-col ${
                p.popular
                  ? "bg-[var(--color-dark)] shadow-2xl shadow-gray-900/25 lg:scale-[1.03] relative"
                  : "bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Popular indicator line */}
              {p.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-[var(--color-accent)] to-blue-500 rounded-t-2xl" />
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    p.popular
                      ? "bg-white/10 text-blue-400"
                      : "bg-[var(--color-light)] text-[var(--color-primary)] group-hover:bg-blue-50 group-hover:text-[var(--color-accent)]"
                  } transition-colors duration-300`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-[1.5px] ${p.popular ? "text-gray-500" : "text-[var(--color-gray)]"}`}>
                      {p.name}
                    </div>
                    <div className={`text-[0.95rem] font-semibold ${p.popular ? "text-white" : "text-[var(--color-dark)]"}`}>
                      {p.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-[0.88rem] leading-relaxed mb-6 pb-6 border-b ${
                  p.popular ? "text-gray-400 border-white/10" : "text-[var(--color-gray)] border-gray-100"
                }`}>
                  {p.desc}
                </p>

                {/* Features */}
                <ul className="list-none space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`text-[0.88rem] flex items-start gap-2.5 ${p.popular ? "text-gray-300" : "text-[var(--color-dark-2)]"}`}>
                      <svg className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? "text-blue-400" : "text-[var(--color-accent)]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/contact"
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 text-[0.9rem] ${
                    p.popular
                      ? "bg-white text-[var(--color-dark)] hover:bg-gray-100 hover:shadow-lg"
                      : "border border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-dark)] hover:bg-[var(--color-dark)] hover:text-white"
                  }`}
                >
                  상담 신청하기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Common features */}
        <div className="mt-14 fade-up" style={{ transitionDelay: "100ms" }}>
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-center font-bold text-[var(--color-dark)] text-[0.95rem] mb-5">
              모든 플랜 공통 포함
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-[var(--color-gray)] text-[0.85rem] py-2 px-3 rounded-lg bg-[var(--color-light)]">
                  <svg className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
