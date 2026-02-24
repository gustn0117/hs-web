"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "80",
    unit: "만원~",
    desc: "소규모 비즈니스에 적합한 기본 홈페이지 패키지",
    audience: "개인사업자 · 프리랜서 · 1인 기업",
    badge: "가장 경제적",
    badgeColor: "bg-sky-100 text-sky-600",
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
    audience: "중소기업 · 스타트업 · 브랜드",
    badge: null,
    badgeColor: "",
    features: [
      "맞춤형 디자인 (10페이지)",
      "고급 SEO & 성능 최적화",
      "관리자 페이지",
      "제작 기간 4~6주",
      "3개월 무상 유지보수",
    ],
    popular: true,
    guarantee: "만족 보증 — 수정 무제한",
  },
  {
    name: "Enterprise",
    price: "별도",
    unit: "견적",
    desc: "대규모 프로젝트를 위한 맞춤 솔루션",
    audience: "대기업 · 프랜차이즈 · 플랫폼",
    badge: "가장 유연한",
    badgeColor: "bg-violet-100 text-violet-600",
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

function DrawCheck({ delay, visible, accent }: { delay: number; visible: boolean; accent?: boolean }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${accent ? "text-white" : "text-[var(--color-primary)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
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
              className={`fade-scale rounded-2xl transition-all duration-300 relative overflow-hidden ${
                p.popular
                  ? "lg:scale-105 shadow-2xl shadow-emerald-500/15"
                  : "border border-gray-100 hover:-translate-y-2 hover:shadow-xl bg-white"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Popular plan: dark gradient background */}
              {p.popular ? (
                <div className="bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark-2)] p-9 relative">
                  {/* Subtle pattern */}
                  <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
                  {/* Badge */}
                  <div className="relative z-10">
                    <span className="shimmer-badge bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 text-white px-4 py-1 rounded-full text-[0.75rem] font-semibold shadow-lg shadow-emerald-500/30 relative overflow-hidden inline-block mb-5">
                      가장 인기
                    </span>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-[1px] mb-2">
                      {p.name}
                    </div>
                    <div className="mb-1 flex items-end gap-1">
                      <span className="text-[3rem] font-extrabold leading-none text-white">{p.price}</span>
                      <span className="text-base font-medium text-gray-400 mb-1.5">{p.unit}</span>
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{p.desc}</div>
                    {/* Audience */}
                    <div className="text-emerald-400/80 text-[0.78rem] font-medium mb-4">
                      추천: {p.audience}
                    </div>
                    {/* Guarantee */}
                    {"guarantee" in p && p.guarantee && (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full mb-6">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        {p.guarantee}
                      </div>
                    )}
                    <div className="pb-6 border-b border-white/10" />
                    <ul className="list-none mt-6 mb-8 space-y-3.5">
                      {p.features.map((f, fi) => (
                        <li key={f} className="text-gray-200 text-[0.95rem] flex items-center gap-3">
                          <DrawCheck delay={fi * 120 + i * 200 + 400} visible={visible} accent />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="btn-ripple block w-full text-center py-4 rounded-xl font-semibold no-underline transition-all duration-300 bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 text-white hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] text-[0.95rem]"
                    >
                      상담 신청
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-9">
                  {/* Badge for non-popular */}
                  {p.badge && (
                    <span className={`inline-block text-[0.72rem] font-semibold px-3 py-1 rounded-full mb-4 ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  )}
                  <div className="text-sm font-bold text-[var(--color-gray)] uppercase tracking-[1px] mb-2">
                    {p.name}
                  </div>
                  <div className="mb-1 flex items-end gap-1">
                    <span className="text-[2.8rem] font-extrabold leading-none text-[var(--color-dark)]">{p.price}</span>
                    <span className="text-base font-medium text-[var(--color-gray)] mb-1">{p.unit}</span>
                  </div>
                  <div className="text-[var(--color-gray)] text-sm mb-2">{p.desc}</div>
                  {/* Audience */}
                  <div className="text-[var(--color-primary)] text-[0.78rem] font-medium mb-6 pb-6 border-b border-gray-100">
                    추천: {p.audience}
                  </div>
                  <ul className="list-none mb-8 space-y-3.5">
                    {p.features.map((f, fi) => (
                      <li key={f} className="text-[var(--color-dark-2)] text-[0.95rem] flex items-center gap-3">
                        <DrawCheck delay={fi * 120 + i * 200 + 400} visible={visible} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="btn-ripple block w-full text-center py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 border-2 border-gray-200 text-[var(--color-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-emerald-50/50"
                  >
                    {p.name === "Enterprise" ? "견적 문의" : "상담 신청"}
                  </Link>
                </div>
              )}
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

        {/* Budget CTA */}
        <div className="mt-8 fade-up" style={{ transitionDelay: "200ms" }}>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-md shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-bold text-[var(--color-dark)] mb-1">예산이 정해져 있으신가요?</div>
              <div className="text-[var(--color-gray)] text-[0.88rem]">
                예산에 맞춘 최적의 플랜을 제안해드립니다. 부담 없이 상담해주세요.
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-ripple px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 no-underline text-[0.9rem] hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 shrink-0"
            >
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
