"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    subtitle: "소규모 비즈니스",
    desc: "깔끔한 홈페이지가 필요한 개인사업자와 스타트업을 위한 패키지",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
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
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605",
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
    icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21",
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
  {
    text: "SSL 보안 인증서",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    text: "Google Analytics 연동",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    text: "반응형 모바일 최적화",
    icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
  {
    text: "크로스 브라우저 테스트",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582",
  },
  {
    text: "소스코드 100% 제공",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
  {
    text: "CDN 성능 최적화",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    text: "웹 표준 & 접근성 준수",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
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
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[3px] mb-4">
            PRICING
          </p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            플랜 안내
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[520px] mx-auto leading-relaxed">
            프로젝트에 맞는 플랜을 선택하시면
            <br className="hidden sm:block" />
            상담을 통해 정확한 견적을 안내드립니다.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`fade-up group rounded-2xl transition-all duration-500 flex flex-col ${
                p.popular
                  ? "bg-[var(--color-dark)] shadow-2xl shadow-blue-900/25 lg:scale-[1.04] relative z-10 ring-1 ring-blue-500/20"
                  : "bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Popular badge & accent */}
              {p.popular && (
                <>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-4 py-1.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full shadow-lg shadow-blue-600/30">
                      가장 인기
                    </span>
                  </div>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-[var(--color-accent)] to-blue-400 rounded-t-2xl" />
                </>
              )}

              <div className="p-8 md:p-9 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      p.popular
                        ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400"
                        : "bg-[var(--color-light)] text-[var(--color-primary)] group-hover:bg-blue-50 group-hover:text-[var(--color-accent)]"
                    } transition-colors duration-300`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={p.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-[1.5px] ${
                        p.popular
                          ? "text-blue-400/70"
                          : "text-[var(--color-gray)]"
                      }`}
                    >
                      {p.name}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        p.popular
                          ? "text-white"
                          : "text-[var(--color-dark)]"
                      }`}
                    >
                      {p.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p
                  className={`text-[0.88rem] leading-relaxed mb-6 ${
                    p.popular
                      ? "text-gray-400"
                      : "text-[var(--color-gray)]"
                  }`}
                >
                  {p.desc}
                </p>

                {/* Pricing area */}
                <div
                  className={`py-4 px-5 rounded-xl mb-6 ${
                    p.popular ? "bg-white/[0.05]" : "bg-[var(--color-light)]"
                  }`}
                >
                  <div
                    className={`text-xs font-medium mb-1 ${
                      p.popular ? "text-gray-500" : "text-[var(--color-gray)]"
                    }`}
                  >
                    견적 안내
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      p.popular ? "text-white" : "text-[var(--color-dark)]"
                    }`}
                  >
                    상담 후 맞춤 견적
                  </div>
                </div>

                {/* Features */}
                <ul className="list-none space-y-3.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={`text-[0.88rem] flex items-start gap-3 ${
                        p.popular
                          ? "text-gray-300"
                          : "text-[var(--color-dark-2)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          p.popular
                            ? "bg-blue-500/15"
                            : "bg-[var(--color-light)] group-hover:bg-blue-50"
                        } transition-colors duration-300`}
                      >
                        <svg
                          className={`w-3 h-3 ${
                            p.popular
                              ? "text-blue-400"
                              : "text-[var(--color-accent)]"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/contact"
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 text-[0.9rem] ${
                    p.popular
                      ? "bg-white text-[var(--color-dark)] hover:bg-gray-100 hover:shadow-lg shadow-md"
                      : "border-2 border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-dark)] hover:bg-[var(--color-dark)] hover:text-white"
                  }`}
                >
                  상담 신청하기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Common features */}
        <div className="mt-16 fade-up" style={{ transitionDelay: "150ms" }}>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <h3 className="font-bold text-[var(--color-dark)] text-lg mb-2">
                모든 플랜 공통 포함
              </h3>
              <p className="text-[var(--color-gray)] text-sm">
                어떤 플랜을 선택하셔도 아래 항목이 기본 포함됩니다.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonFeatures.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2.5 text-[var(--color-dark-2)] text-[0.85rem] py-3 px-4 rounded-xl bg-[var(--color-light)] border border-gray-100/50"
                >
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.icon}
                    />
                  </svg>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust section */}
        <div className="mt-8 fade-up" style={{ transitionDelay: "200ms" }}>
          <div className="bg-[var(--color-dark)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg
                  className="w-7 h-7 text-[var(--color-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-white text-xl font-bold mb-2">
                  계약서 기반의 투명한 진행
                </h3>
                <p className="text-gray-400 text-[0.9rem] leading-relaxed max-w-[480px]">
                  모든 프로젝트는 계약서를 기반으로 진행되며, 소스코드와 디자인
                  원본이 100% 제공됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
