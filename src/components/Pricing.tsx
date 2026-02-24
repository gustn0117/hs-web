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
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PRICING
          </p>
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
              className={`fade-up bg-white p-9 rounded-2xl transition-all duration-300 relative ${
                p.popular
                  ? "border-2 border-[var(--color-primary)] lg:scale-105 shadow-lg"
                  : "border border-gray-100 hover:-translate-y-1 hover:shadow-lg"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-[0.8rem] font-semibold">
                  인기
                </div>
              )}
              <div className="text-sm font-semibold text-[var(--color-gray)] mb-2">
                {p.name}
              </div>
              <div className="text-[2.5rem] font-extrabold text-[var(--color-dark)] mb-1">
                {p.price}
                <span className="text-base font-medium text-[var(--color-gray)]">
                  {p.unit}
                </span>
              </div>
              <div className="text-[var(--color-gray)] text-sm mb-7 pb-7 border-b border-gray-100">
                {p.desc}
              </div>
              <ul className="list-none mb-8 space-y-2">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="py-2 text-[var(--color-gray)] text-[0.95rem] flex items-center gap-2.5"
                  >
                    <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-[var(--color-primary)] text-xs font-bold shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block w-full text-center py-3.5 rounded-lg font-semibold no-underline transition-all ${
                  p.popular
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                    : "border border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {p.popular ? "상담 신청" : p.name === "Enterprise" ? "견적 문의" : "상담 신청"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
