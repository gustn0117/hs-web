"use client";

import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "맞춤형 디자인",
    desc: "템플릿이 아닌, 브랜드에 맞는 100% 맞춤형 디자인을 제공합니다. 고객의 아이덴티티를 반영한 유일한 웹사이트를 만듭니다.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "최신 기술 스택",
    desc: "React, Next.js 등 검증된 최신 프레임워크로 빠르고 안정적인 사이트를 구축합니다. SEO와 성능 최적화를 기본 포함합니다.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "투명한 소통",
    desc: "프로젝트 진행 상황을 실시간으로 공유하고, 피드백을 즉시 반영합니다. 매 단계마다 시안 확인 후 진행합니다.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "사후 관리",
    desc: "런칭 후에도 지속적인 유지보수와 성능 모니터링을 제공합니다. 보안 업데이트와 콘텐츠 수정을 빠르게 지원합니다.",
  },
];

export default function WhyUs() {
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
    ref.current?.querySelectorAll(".fade-up, .fade-left, .fade-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-left">
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
              WHY US
            </p>
            <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
              왜 <span className="gradient-text">HS WEB</span>인가요?
            </h2>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed mb-8">
              단순한 웹사이트 제작을 넘어, 비즈니스 성장을 위한 전략적 파트너가 되어드립니다.
              고객 중심의 접근 방식으로 최상의 결과를 만들어냅니다.
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-extrabold gradient-text">24h</div>
                <div className="text-[var(--color-gray)] text-xs mt-1">평균 응답</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-extrabold gradient-text">100%</div>
                <div className="text-[var(--color-gray)] text-xs mt-1">맞춤 제작</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-extrabold gradient-text">A/S</div>
                <div className="text-[var(--color-gray)] text-xs mt-1">무상 유지보수</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className="fade-right bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-emerald-400 text-white rounded-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  {r.icon}
                </div>
                <h3 className="font-bold text-[1rem] mb-2">{r.title}</h3>
                <p className="text-[var(--color-gray)] text-[0.85rem] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
