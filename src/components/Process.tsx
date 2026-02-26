"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "상담 & 기획",
    subtitle: "Consultation & Planning",
    desc: "비즈니스 목표와 요구사항을 깊이 파악하여 프로젝트의 방향을 설정합니다.",
    details: [
      "프로젝트 목표 및 타겟 분석",
      "사이트맵 & 와이어프레임 작성",
      "기능 명세서 및 견적 확정",
    ],
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  },
  {
    num: "02",
    title: "디자인",
    subtitle: "UI/UX Design",
    desc: "브랜드 아이덴티티를 반영한 시각 디자인과 사용자 경험을 설계합니다.",
    details: [
      "무드보드 & 컨셉 디자인",
      "반응형 UI/UX 시안 제작",
      "피드백 반영 및 최종 시안 확정",
    ],
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  },
  {
    num: "03",
    title: "개발",
    subtitle: "Development",
    desc: "최신 기술 스택으로 견고하고 빠른 웹사이트를 구현합니다.",
    details: [
      "프론트엔드 & 백엔드 개발",
      "단계별 진행 상황 공유",
      "성능 최적화 & 크로스 브라우저 테스트",
    ],
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
  {
    num: "04",
    title: "런칭 & 관리",
    subtitle: "Launch & Support",
    desc: "철저한 QA 후 사이트를 오픈하고, 지속적인 무료 유지보수를 제공합니다.",
    details: [
      "최종 QA 테스트 및 배포",
      "도메인 & 호스팅 셋업",
      "무상 유지보수 시작",
    ],
    icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  },
];

export default function Process() {
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
    <section className="py-28 bg-[var(--color-light)] overflow-hidden" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 fade-up">
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PROCESS
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] tracking-tight mb-4">
            제작 과정
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[480px] mx-auto leading-relaxed">
            체계적인 4단계 프로세스로 최상의 결과물을 만듭니다.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-20">
            {steps.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={s.num}
                  className="fade-up relative"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Timeline dot — desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-10 w-12 h-12 bg-[var(--color-dark)] text-white rounded-full items-center justify-center text-sm font-bold shadow-lg shadow-gray-900/15 border-4 border-[var(--color-light)]">
                    {s.num}
                  </div>

                  {/* Content */}
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-start ${isEven ? "" : "lg:direction-rtl"}`}>
                    {/* Card side */}
                    <div className={`${isEven ? "lg:pr-8" : "lg:pl-8 lg:col-start-2"}`}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-7 md:p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
                        {/* Mobile number + icon row */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-12 h-12 bg-[var(--color-dark)] text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 lg:w-11 lg:h-11">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                            </svg>
                          </div>
                          <div>
                            <span className="lg:hidden text-[var(--color-accent)] text-xs font-bold tracking-wider">STEP {s.num}</span>
                            <h3 className="text-xl font-bold text-[var(--color-dark)] leading-tight">{s.title}</h3>
                            <p className="text-[var(--color-gray)] text-xs uppercase tracking-wider mt-0.5">{s.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-[var(--color-gray)] text-[0.9rem] leading-relaxed mb-5">
                          {s.desc}
                        </p>

                        {/* Detail items */}
                        <div className="space-y-2.5">
                          {s.details.map((d, di) => (
                            <div key={di} className="flex items-center gap-2.5">
                              <div className="w-5 h-5 rounded-md bg-[var(--color-light)] flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                <svg className="w-3 h-3 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </div>
                              <span className="text-[var(--color-dark-2)] text-[0.85rem]">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Empty side — placeholder for grid alignment */}
                    <div className={`hidden lg:block ${isEven ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-20 fade-up" style={{ transitionDelay: "150ms" }}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-6 py-3 shadow-sm">
              <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
              <span className="text-[var(--color-dark)] text-[0.88rem] font-medium">
                평균 프로젝트 완료까지 빠르고 효율적으로 진행합니다
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
