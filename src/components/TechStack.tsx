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
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-12 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            TECH STACK
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
            사용 기술
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, ci) => (
            <div
              key={cat.title}
              className="fade-up"
              style={{ transitionDelay: `${ci * 80}ms` }}
            >
              <h3 className="font-bold text-[var(--color-dark)] text-[0.9rem] mb-3">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-[var(--color-light)] border border-gray-200 rounded-lg text-[0.82rem] font-medium text-[var(--color-dark-2)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
