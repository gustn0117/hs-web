"use client";

import { useEffect, useRef } from "react";

const ICON_COLORS = [
  { from: "from-emerald-500", to: "to-teal-400", shadow: "shadow-emerald-500/20" },
  { from: "from-pink-500", to: "to-rose-400", shadow: "shadow-pink-500/20" },
  { from: "from-violet-500", to: "to-purple-400", shadow: "shadow-violet-500/20" },
  { from: "from-sky-500", to: "to-cyan-400", shadow: "shadow-sky-500/20" },
  { from: "from-orange-500", to: "to-amber-400", shadow: "shadow-orange-500/20" },
  { from: "from-indigo-500", to: "to-blue-400", shadow: "shadow-indigo-500/20" },
];

const services = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    ),
    title: "반응형 홈페이지",
    desc: "PC, 태블릿, 모바일 모든 디바이스에서 완벽하게 보이는 반응형 홈페이지를 제작합니다.",
    tags: ["PC / 모바일 최적화", "SEO 적용", "빠른 로딩"],
    metric: "평균 제작 기간 2주",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    title: "쇼핑몰 구축",
    desc: "결제 시스템 연동부터 상품 관리까지, 매출을 극대화하는 온라인 쇼핑몰을 구축합니다.",
    tags: ["PG 결제 연동", "재고 관리", "회원 시스템"],
    metric: "매출 평균 35% 증가",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: "랜딩페이지",
    desc: "전환율을 극대화하는 마케팅 랜딩페이지로 광고 효과를 높여드립니다.",
    tags: ["전환율 최적화", "A/B 테스트", "애니메이션"],
    metric: "전환율 평균 40% 향상",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "웹 애플리케이션",
    desc: "React, Vue 등 최신 프레임워크를 활용한 고성능 웹 앱을 개발합니다.",
    tags: ["React / Vue", "Node.js", "API 개발"],
    metric: "일 평균 1만+ 사용자 지원",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "CMS 시스템",
    desc: "콘텐츠를 직접 관리할 수 있는 맞춤형 CMS를 구축합니다.",
    tags: ["콘텐츠 관리", "관리자 페이지", "권한 설정"],
    metric: "관리 시간 70% 절감",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "기업 관리 시스템",
    desc: "ERP, CRM, 인사관리 등 기업 맞춤형 관리 시스템을 개발합니다.",
    tags: ["ERP / CRM", "업무 자동화", "데이터 분석"],
    metric: "업무 효율 평균 50% 개선",
  },
];

const highlights = [
  { icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z", text: "5년간 150+ 프로젝트 경험" },
  { icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", text: "풀스택 개발 역량" },
  { icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5", text: "업종별 맞춤 솔루션" },
  { icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941", text: "런칭 후 성과 추적" },
];

export default function Services() {
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
    <section className="pt-32 pb-24 bg-[var(--color-light)] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            SERVICES
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            제공 서비스
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            비즈니스 목표에 맞는 최적의 웹 솔루션을 제안하고,
            기획부터 런칭까지 원스톱으로 진행합니다.
          </p>
        </div>

        {/* Highlights box */}
        <div className="fade-up mb-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-[0.85rem] font-bold text-[var(--color-primary)] uppercase tracking-[1.5px] mb-4">핵심 역량</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={h.icon} />
                </svg>
                <span className="text-[var(--color-dark)] text-[0.88rem] font-medium">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {services.map((s, i) => {
            const color = ICON_COLORS[i];
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={i}
                className={`fade-up flex items-start sm:items-center gap-4 sm:gap-5 px-5 sm:px-6 py-5 transition-all duration-300 group hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:rounded-xl cursor-default ${i < services.length - 1 ? "border-b border-gray-100" : ""}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {/* Number */}
                <span className="hidden sm:block text-[1.4rem] font-black gradient-text opacity-30 group-hover:opacity-100 transition-opacity duration-300 w-8 shrink-0 select-none">
                  {num}
                </span>

                {/* Icon */}
                <div className={`w-9 h-9 shrink-0 bg-gradient-to-br ${color.from} ${color.to} text-white rounded-lg flex items-center justify-center shadow-md ${color.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {s.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[0.95rem] font-bold text-[var(--color-dark)]">{s.title}</h3>
                    <span className="text-[0.68rem] px-2 py-0.5 bg-emerald-50 text-[var(--color-primary)] rounded-full font-semibold hidden sm:inline-block">
                      {s.metric}
                    </span>
                  </div>
                  <p className="text-[var(--color-gray)] text-[0.82rem] leading-snug mt-0.5">{s.desc}</p>
                  {/* Tags + metric - mobile */}
                  <div className="flex flex-wrap gap-1.5 mt-2 md:hidden">
                    <span className="text-[0.68rem] px-2 py-0.5 bg-emerald-50 text-[var(--color-primary)] rounded-full font-semibold">
                      {s.metric}
                    </span>
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[0.68rem] px-2 py-0.5 bg-gray-50 text-[var(--color-gray)] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags - desktop */}
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.72rem] px-2.5 py-1 bg-gray-50 text-[var(--color-gray)] rounded-full font-medium group-hover:bg-emerald-50 group-hover:text-[var(--color-primary)] transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-primary)] transition-all duration-300 group-hover:translate-x-1 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
