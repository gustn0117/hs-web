"use client";

import { useEffect, useRef, useState } from "react";
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
];

function DrawCheck({ delay, visible }: { delay: number; visible: boolean }) {
  return (
    <svg className="w-5 h-5 text-[var(--color-primary)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
        strokeDasharray="24"
        strokeDashoffset={visible ? "0" : "24"}
        style={{ transition: `stroke-dashoffset 0.5s ease ${delay}ms` }}
      />
    </svg>
  );
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (entry.target === ref.current) setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
      ref.current.querySelectorAll(".fade-up, .fade-scale").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-32 pb-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`fade-scale bg-white p-9 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                p.popular
                  ? "border-2 border-[var(--color-primary)] lg:scale-105 shadow-xl shadow-emerald-500/10"
                  : "border border-gray-100 hover:-translate-y-2 hover:shadow-xl"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Top gradient bar for popular */}
              {p.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
              )}
              {p.popular && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 mt-4">
                  <span className="shimmer-badge bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white px-5 py-1.5 rounded-full text-[0.8rem] font-semibold shadow-lg shadow-emerald-500/20 relative overflow-hidden inline-block">
                    가장 인기
                  </span>
                </div>
              )}
              <div className={`${p.popular ? "mt-8" : ""}`}>
                <div className="text-sm font-bold text-[var(--color-gray)] uppercase tracking-[1px] mb-2">
                  {p.name}
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className={`text-[2.8rem] font-extrabold leading-none ${p.popular ? "gradient-text" : "text-[var(--color-dark)]"}`}>
                    {p.price}
                  </span>
                  <span className="text-base font-medium text-[var(--color-gray)] mb-1">
                    {p.unit}
                  </span>
                </div>
                <div className="text-[var(--color-gray)] text-sm mb-7 pb-7 border-b border-gray-100">
                  {p.desc}
                </div>
                <ul className="list-none mb-8 space-y-3">
                  {p.features.map((f, fi) => (
                    <li
                      key={f}
                      className="text-[var(--color-dark-2)] text-[0.95rem] flex items-center gap-3"
                    >
                      <DrawCheck delay={fi * 120 + i * 200 + 400} visible={visible} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`btn-ripple block w-full text-center py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 ${
                    p.popular
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02]"
                      : "border border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-emerald-50/50"
                  }`}
                >
                  {p.name === "Enterprise" ? "견적 문의" : "상담 신청"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Common features */}
        <div className="mt-12 fade-up">
          <div className="bg-[var(--color-light)] rounded-2xl p-8 border border-gray-100">
            <h3 className="text-center font-bold text-[var(--color-dark)] mb-5">
              모든 플랜 공통 포함 사항
            </h3>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {commonFeatures.map((f, fi) => (
                <div key={f} className="flex items-center gap-2 text-[var(--color-gray)] text-[0.9rem]">
                  <DrawCheck delay={fi * 150 + 800} visible={visible} />
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
