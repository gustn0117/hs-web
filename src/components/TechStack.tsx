"use client";

import { useEffect, useRef } from "react";

const categories = [
  {
    title: "프론트엔드",
    techs: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "백엔드",
    techs: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"],
  },
  {
    title: "도구 & 플랫폼",
    techs: ["Figma", "AWS", "Vercel", "Git", "Docker"],
  },
];

export default function TechStack() {
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
    <section className="py-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            TECH STACK
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            사용 기술
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            검증된 최신 기술 스택으로 최적의 성능과 안정성을 보장합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, ci) => (
            <div key={cat.title} className="fade-up" style={{ transitionDelay: `${ci * 100}ms` }}>
              <h3 className="text-sm font-bold text-[var(--color-gray)] uppercase tracking-[2px] mb-5 text-center">
                {cat.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {cat.techs.map((tech) => (
                  <div
                    key={tech}
                    className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[0.9rem] font-medium text-[var(--color-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
