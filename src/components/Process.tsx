"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "상담 & 기획",
    desc: "비즈니스 목표와 요구사항을 파악하고 최적의 방향을 설정합니다.",
    detailedDesc: "비즈니스 목표, 타겟 고객, 벤치마킹 사이트를 함께 분석합니다. 요구사항을 체계적으로 정리하고 사이트맵과 와이어프레임을 작성하여 전체 구조를 확정합니다.",
    timeline: "1~3일",
    deliverables: ["요구사항 정의서", "사이트맵", "와이어프레임", "견적서"],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    color: "from-indigo-500 to-blue-400",
  },
  {
    num: "02",
    title: "디자인",
    desc: "브랜드 아이덴티티를 반영한 세련되고 직관적인 UI/UX를 설계합니다.",
    detailedDesc: "브랜드 가이드라인을 기반으로 메인 페이지 시안을 제작합니다. 고객 피드백을 반영한 수정 작업을 거쳐 모든 페이지의 최종 디자인을 확정합니다.",
    timeline: "5~10일",
    deliverables: ["디자인 시안", "스타일 가이드", "UI 컴포넌트", "반응형 레이아웃"],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    color: "from-violet-500 to-purple-400",
  },
  {
    num: "03",
    title: "개발",
    desc: "최신 기술 스택으로 빠르고 안정적인 웹사이트를 구현합니다.",
    detailedDesc: "확정된 디자인을 기반으로 프론트엔드와 백엔드를 개발합니다. 단계별 진행 상황을 공유하며, 중간 검수를 통해 방향성을 확인합니다.",
    timeline: "2~4주",
    deliverables: ["프론트엔드 구현", "백엔드 API", "DB 설계", "테스트 서버"],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    color: "from-sky-500 to-cyan-400",
  },
  {
    num: "04",
    title: "런칭 & 관리",
    desc: "QA 테스트 후 사이트를 오픈하고, 지속적인 유지보수를 지원합니다.",
    detailedDesc: "크로스 브라우저 테스트와 성능 최적화를 완료한 후 사이트를 오픈합니다. 런칭 후에도 안정적인 운영을 위해 지속적으로 모니터링합니다.",
    timeline: "1~3일",
    deliverables: ["QA 테스트 리포트", "배포 & 런칭", "운영 가이드", "유지보수 시작"],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-400",
  },
];

export default function Process() {
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
      ref.current.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-32 pb-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PROCESS
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            제작 과정
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            체계적인 프로세스로 최상의 결과물을 만들어냅니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[56px] left-[15%] right-[15%] h-[2px]">
            <div className="w-full h-full bg-gray-100 rounded-full" />
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-400 rounded-full ${visible ? 'animate-[draw-line_2s_ease-out_forwards]' : 'w-0'}`}
            />
          </div>

          {steps.map((s, i) => (
            <div key={i} className="fade-up text-center relative group" style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Step circle */}
              <div className="relative mx-auto mb-5 w-[112px] h-[112px]">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${s.color} opacity-20 ${visible ? 'animate-[pulse-ring_2.5s_ease-out_infinite]' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
                <div
                  className={`w-[112px] h-[112px] bg-white rounded-full flex flex-col items-center justify-center relative z-10 border-2 border-gray-100 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:border-transparent group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-indigo-300 ${visible ? 'animate-bounce-in' : 'scale-0'}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {s.icon}
                  </div>
                </div>
                <div className={`absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br ${s.color} text-white text-[0.7rem] font-bold rounded-full flex items-center justify-center z-20 shadow-md`}>
                  {s.num}
                </div>
              </div>

              <h3 className="text-[1.05rem] font-bold mb-2 text-[var(--color-dark)]">{s.title}</h3>
              <p className="text-[var(--color-gray)] text-[0.85rem] leading-relaxed max-w-[220px] mx-auto mb-4">
                {s.detailedDesc}
              </p>

              {/* Timeline badge */}
              <div className="inline-flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 mb-3 shadow-sm">
                <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[0.75rem] font-semibold text-[var(--color-dark)]">{s.timeline}</span>
              </div>

              {/* Deliverables */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {s.deliverables.map((d) => (
                  <span key={d} className="text-[0.68rem] px-2 py-0.5 bg-gray-50 text-[var(--color-gray)] rounded-full border border-gray-100">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total timeline summary */}
        <div className="mt-14 fade-up">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[var(--color-dark)]">전체 프로세스: <span className="gradient-text">평균 4~8주</span></div>
                <div className="text-[var(--color-gray)] text-[0.82rem]">프로젝트 규모에 따라 유동적으로 조정됩니다</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[0.8rem]">
              {[
                { label: "주 1~2회 미팅", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
                { label: "실시간 진행 공유", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-[var(--color-gray)]">
                  <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
