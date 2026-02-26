"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";

const ICON_COLORS = [
  { from: "from-blue-500", to: "to-blue-400", shadow: "shadow-blue-500/20" },
  { from: "from-pink-500", to: "to-rose-400", shadow: "shadow-pink-500/20" },
  { from: "from-violet-500", to: "to-purple-400", shadow: "shadow-violet-500/20" },
  { from: "from-sky-500", to: "to-cyan-400", shadow: "shadow-sky-500/20" },
  { from: "from-orange-500", to: "to-amber-400", shadow: "shadow-orange-500/20" },
  { from: "from-blue-500", to: "to-blue-400", shadow: "shadow-blue-500/20" },
  { from: "from-emerald-500", to: "to-teal-400", shadow: "shadow-emerald-500/20" },
];

const highlights = [
  { icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z", text: "다양한 프로젝트 경험" },
  { icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", text: "풀스택 개발 역량" },
  { icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5", text: "업종별 맞춤 솔루션" },
  { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", text: "유지보수 무료 지원" },
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
            웹사이트 제작부터 기술 마케팅까지,
            비즈니스 성장에 필요한 모든 웹 솔루션을 제공합니다.
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
            const color = ICON_COLORS[i] || ICON_COLORS[0];
            const num = String(i + 1).padStart(2, "0");
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`fade-up flex items-start sm:items-center gap-4 sm:gap-5 px-5 sm:px-6 py-5 transition-all duration-300 group hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:rounded-xl no-underline ${i < services.length - 1 ? "border-b border-gray-100" : ""}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {/* Number */}
                <span className="hidden sm:block text-[1.4rem] font-black gradient-text opacity-30 group-hover:opacity-100 transition-opacity duration-300 w-8 shrink-0 select-none">
                  {num}
                </span>

                {/* Icon */}
                <div className={`w-9 h-9 shrink-0 bg-gradient-to-br ${color.from} ${color.to} text-white rounded-lg flex items-center justify-center shadow-md ${color.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[0.95rem] font-bold text-[var(--color-dark)]">{s.title}</h3>
                    <span className="text-[0.68rem] px-2 py-0.5 bg-blue-50 text-[var(--color-primary)] rounded-full font-semibold hidden sm:inline-block">
                      {s.metric}
                    </span>
                  </div>
                  <p className="text-[var(--color-gray)] text-[0.82rem] leading-snug mt-0.5">{s.description.slice(0, 60)}...</p>
                  {/* Tags + metric - mobile */}
                  <div className="flex flex-wrap gap-1.5 mt-2 md:hidden">
                    <span className="text-[0.68rem] px-2 py-0.5 bg-blue-50 text-[var(--color-primary)] rounded-full font-semibold">
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
                      className="text-[0.72rem] px-2.5 py-1 bg-gray-50 text-[var(--color-gray)] rounded-full font-medium group-hover:bg-blue-50 group-hover:text-[var(--color-primary)] transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-primary)] transition-all duration-300 group-hover:translate-x-1 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
