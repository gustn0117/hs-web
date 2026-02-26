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
    deliverable: "기획안 & 견적서",
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
    deliverable: "UI/UX 시안",
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
    deliverable: "개발 완료 사이트",
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
    deliverable: "라이브 사이트",
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
    <section ref={ref}>
      {/* Dark Hero Header */}
      <div className="bg-[var(--color-dark)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center fade-up">
            <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-[3px] mb-4">
              PROCESS
            </p>
            <h2 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white tracking-tight mb-5">
              제작 과정
            </h2>
            <p className="text-gray-400 text-lg max-w-[520px] mx-auto leading-relaxed">
              체계적인 4단계 프로세스로
              <br className="hidden sm:block" />
              최상의 결과물을 만듭니다.
            </p>
          </div>

          {/* Step overview pills — desktop */}
          <div
            className="hidden md:flex items-center justify-center mt-14 fade-up"
            style={{ transitionDelay: "100ms" }}
          >
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10">
                  <span className="text-[var(--color-accent)] font-bold text-sm">
                    {s.num}
                  </span>
                  <span className="text-white font-medium text-sm">
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <svg
                    className="w-4 h-4 text-white/20 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-[var(--color-light)] py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="relative">
            {/* Vertical connector — desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-accent)]/25 via-gray-200 to-[var(--color-accent)]/25" />

            <div className="space-y-8 lg:space-y-0">
              {steps.map((s, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={s.num}
                    className="fade-up relative lg:py-10"
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    {/* Timeline node — desktop */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-[var(--color-accent)]/10" />
                        <div className="w-14 h-14 bg-[var(--color-dark)] text-white rounded-full flex items-center justify-center text-base font-bold shadow-xl shadow-gray-900/20 border-[3px] border-[var(--color-light)] relative z-10">
                          {s.num}
                        </div>
                      </div>
                    </div>

                    {/* Content grid */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                      <div
                        className={`${isEven ? "lg:pr-12" : "lg:pl-12 lg:col-start-2"}`}
                      >
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 group">
                          {/* Top accent gradient */}
                          <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />

                          <div className="p-7 md:p-8">
                            {/* Mobile step badge */}
                            <div className="lg:hidden mb-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-dark)] text-white text-xs font-bold rounded-full">
                                STEP {s.num}
                              </span>
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-4 mb-5">
                              <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-blue-900/15">
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
                                    d={s.icon}
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-[var(--color-dark)] leading-tight mb-1">
                                  {s.title}
                                </h3>
                                <p className="text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider">
                                  {s.subtitle}
                                </p>
                              </div>
                            </div>

                            <p className="text-[var(--color-gray)] text-[0.9rem] leading-relaxed mb-6">
                              {s.desc}
                            </p>

                            <div className="h-px bg-gray-100 mb-5" />

                            {/* Details */}
                            <div className="space-y-3">
                              {s.details.map((d, di) => (
                                <div key={di} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-lg bg-[var(--color-light)] flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors duration-300">
                                    <svg
                                      className="w-3.5 h-3.5 text-[var(--color-accent)]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                      />
                                    </svg>
                                  </div>
                                  <span className="text-[var(--color-dark-2)] text-[0.88rem]">
                                    {d}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Deliverable */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-[var(--color-accent)]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                  />
                                </svg>
                                <span className="text-[var(--color-gray)] text-xs font-medium">
                                  산출물
                                </span>
                                <span className="text-[var(--color-dark)] text-xs font-bold bg-[var(--color-light)] px-2.5 py-0.5 rounded-md">
                                  {s.deliverable}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Empty side for grid alignment */}
                      <div
                        className={`hidden lg:block ${isEven ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom summary */}
          <div className="mt-20 fade-up" style={{ transitionDelay: "200ms" }}>
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
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-white text-xl font-bold mb-2">
                    모든 과정이 투명하게 공유됩니다
                  </h3>
                  <p className="text-gray-400 text-[0.9rem] leading-relaxed max-w-[480px]">
                    각 단계마다 진행 상황을 공유하고, 피드백을 반영하여 빠르고
                    효율적으로 프로젝트를 완성합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
