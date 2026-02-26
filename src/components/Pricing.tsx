"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "80",
    unit: "만원~",
    desc: "소규모 비즈니스에 적합한 기본 홈페이지 패키지",
    features: [
      "반응형 디자인 (5페이지)",
      "기본 SEO 설정",
      "도메인 & 호스팅 가이드",
      "제작 기간 2~3주",
      "1개월 무상 유지보수",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "200",
    unit: "만원~",
    desc: "성장하는 비즈니스를 위한 전문 홈페이지 패키지",
    features: [
      "맞춤형 디자인 (10페이지)",
      "고급 SEO & 성능 최적화",
      "관리자 페이지",
      "제작 기간 4~6주",
      "3개월 무상 유지보수",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "별도",
    unit: "견적",
    desc: "대규모 프로젝트를 위한 맞춤 솔루션",
    features: [
      "풀 커스텀 디자인 & 개발",
      "쇼핑몰 / 웹앱 / API 연동",
      "전담 PM 배정",
      "제작 기간 협의",
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
    <section className="pt-32 pb-24" ref={ref}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PRICING
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            가격 안내
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            프로젝트 규모와 요구사항에 맞는 합리적인 가격을 제안합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`fade-up rounded-2xl transition-all duration-300 ${
                p.popular
                  ? "bg-[var(--color-dark)] shadow-2xl shadow-gray-900/20 lg:scale-105"
                  : "bg-white border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="p-8">
                {p.popular && (
                  <span className="inline-block bg-white/10 text-white text-[0.72rem] font-semibold px-3 py-1 rounded-full mb-4">
                    가장 인기
                  </span>
                )}
                <div className={`text-sm font-bold uppercase tracking-[1px] mb-2 ${p.popular ? "text-gray-400" : "text-[var(--color-gray)]"}`}>
                  {p.name}
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className={`text-[2.8rem] font-extrabold leading-none ${p.popular ? "text-white" : "text-[var(--color-dark)]"}`}>
                    {p.price}
                  </span>
                  <span className={`text-base font-medium mb-1 ${p.popular ? "text-gray-400" : "text-[var(--color-gray)]"}`}>
                    {p.unit}
                  </span>
                </div>
                <div className={`text-sm mb-6 pb-6 border-b ${p.popular ? "text-gray-400 border-white/10" : "text-[var(--color-gray)] border-gray-100"}`}>
                  {p.desc}
                </div>

                <ul className="list-none mb-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className={`text-[0.9rem] flex items-center gap-2.5 ${p.popular ? "text-gray-200" : "text-[var(--color-dark-2)]"}`}>
                      <svg className={`w-4 h-4 shrink-0 ${p.popular ? "text-blue-400" : "text-[var(--color-accent)]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 text-[0.9rem] ${
                    p.popular
                      ? "bg-white text-[var(--color-dark)] hover:bg-gray-100"
                      : "border border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-dark)] hover:bg-gray-50"
                  }`}
                >
                  {p.name === "Enterprise" ? "견적 문의" : "상담 신청"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Common features */}
        <div className="mt-10 fade-up" style={{ transitionDelay: "100ms" }}>
          <div className="text-center">
            <h3 className="font-bold text-[var(--color-dark)] text-[0.95rem] mb-4">
              모든 플랜 공통 포함
            </h3>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5">
              {commonFeatures.map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-[var(--color-gray)] text-[0.85rem]">
                  <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
