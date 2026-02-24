"use client";

import { useEffect, useRef } from "react";

const steps = [
  { num: "01", title: "상담 & 기획", desc: "비즈니스 목표와 요구사항을 파악하고 최적의 방향을 설정합니다." },
  { num: "02", title: "디자인", desc: "브랜드 아이덴티티를 반영한 세련되고 직관적인 UI/UX를 설계합니다." },
  { num: "03", title: "개발", desc: "최신 기술 스택으로 빠르고 안정적인 웹사이트를 구현합니다." },
  { num: "04", title: "런칭 & 관리", desc: "QA 테스트 후 사이트를 오픈하고, 지속적인 유지보수를 지원합니다." },
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
    <section className="pt-32 pb-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PROCESS
          </p>
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            제작 과정
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            체계적인 프로세스로 최상의 결과물을 만들어냅니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 relative">
          <div className="hidden lg:block absolute top-[42px] left-[15%] right-[15%] h-px bg-gray-200" />

          {steps.map((s, i) => (
            <div key={i} className="fade-up text-center relative" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="w-[84px] h-[84px] bg-white border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-[1.2rem] font-extrabold text-[var(--color-primary)] mx-auto mb-5 relative z-10">
                {s.num}
              </div>
              <h3 className="text-[1.1rem] font-bold mb-2">{s.title}</h3>
              <p className="text-[var(--color-gray)] text-[0.9rem] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
