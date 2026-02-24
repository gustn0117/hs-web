"use client";

import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "맞춤형 디자인",
    desc: "템플릿이 아닌, 브랜드에 맞는 100% 맞춤형 디자인을 제공합니다.",
    stat: "템플릿 대비 전환율 평균 2배 향상",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "최신 기술 스택",
    desc: "React, Next.js 등 검증된 최신 프레임워크로 빠르고 안정적인 사이트를 구축합니다.",
    stat: "Google PageSpeed 90점 이상 보장",
    color: "from-sky-500 to-cyan-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "투명한 소통",
    desc: "프로젝트 진행 상황을 실시간 공유하고, 피드백을 즉시 반영합니다.",
    stat: "전용 프로젝트 관리 페이지 제공",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "사후 관리",
    desc: "런칭 후에도 지속적인 유지보수와 성능 모니터링을 제공합니다.",
    stat: "평균 응답 시간 24시간 이내",
    color: "from-emerald-500 to-teal-400",
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
          {/* Left - Text */}
          <div className="fade-left">
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
              WHY US
            </p>
            <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
              왜 <span className="gradient-text">HS WEB</span>인가요?
            </h2>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed mb-6">
              단순한 웹사이트 제작을 넘어, 비즈니스 성장을 위한 전략적 파트너가 되어드립니다.
            </p>

            {/* Philosophy quote */}
            <div className="border-l-[3px] border-[var(--color-primary)] pl-4 mb-8 bg-emerald-50/50 py-3 pr-4 rounded-r-lg">
              <p className="text-[var(--color-dark-2)] text-[0.9rem] leading-relaxed italic">
                &ldquo;우리는 단순한 외주 업체가 아닙니다. 고객의 비즈니스를 깊이 이해하고, 웹을 통해 실질적인 성장을 이끌어내는 전략적 파트너입니다.&rdquo;
              </p>
            </div>

            {/* Stats bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap gap-0 shadow-sm">
              {[
                { value: "24h", label: "평균 응답" },
                { value: "100%", label: "맞춤 제작" },
                { value: "150+", label: "완료 프로젝트" },
                { value: "A/S", label: "무상 유지보수" },
                { value: "4.9", label: "평균 평점" },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 text-center min-w-[80px] py-1 ${i < 4 ? "border-r border-gray-100" : ""}`}>
                  <div className="text-lg font-extrabold gradient-text">{s.value}</div>
                  <div className="text-[var(--color-gray)] text-[0.7rem] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={r.title}
                  className="fade-right bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="absolute -top-2 -right-1 text-[4rem] font-black text-gray-50 group-hover:text-emerald-50 transition-colors duration-500 select-none leading-none">
                    {num}
                  </span>

                  <div className={`w-11 h-11 bg-gradient-to-br ${r.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {r.icon}
                  </div>
                  <h3 className="font-bold text-[1rem] mb-2 relative z-10">{r.title}</h3>
                  <p className="text-[var(--color-gray)] text-[0.82rem] leading-relaxed relative z-10 mb-3">
                    {r.desc}
                  </p>
                  {/* Stat line */}
                  <div className="flex items-center gap-1.5 relative z-10">
                    <svg className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[var(--color-primary)] text-[0.75rem] font-semibold">{r.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
