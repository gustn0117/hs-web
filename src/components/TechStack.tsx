"use client";

import { useEffect, useRef, useState } from "react";

const categories = [
  {
    title: "프론트엔드",
    desc: "빠르고 인터랙티브한 사용자 경험을 구현합니다.",
    color: "from-blue-400 to-blue-600",
    barColor: "from-blue-400 to-blue-500",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    level: 95,
    techs: [
      { name: "React", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="2.5" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></svg> },
      { name: "Next.js", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 14.5V7.5l8 9h-2.5L10.5 10v6.5h-1z" opacity="0.6" /></svg> },
      { name: "Vue.js", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3z" opacity="0.5" /></svg> },
      { name: "TypeScript", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="3" opacity="0.15" /><text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold">TS</text></svg> },
      { name: "Tailwind CSS", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C13.35 10.82 14.5 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.65 7.18 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.35 16.82 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.65 13.18 9.5 12 7 12z" opacity="0.5" /></svg> },
    ],
  },
  {
    title: "백엔드",
    desc: "안정적이고 확장 가능한 서버 아키텍처를 설계합니다.",
    color: "from-blue-400 to-blue-600",
    barColor: "from-blue-400 to-violet-500",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    level: 90,
    techs: [
      { name: "Node.js", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.85l9 5.2v10.4l-9 5.2-9-5.2V7.05l9-5.2z" opacity="0.3" /></svg> },
      { name: "Express", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" opacity="0.15" /><text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold">Ex</text></svg> },
      { name: "Python", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C8.46 2 8 3.37 8 5v2h4v1H5.5C3.57 8 2 9.74 2 12s1.57 4 3.5 4h2v-2.5c0-1.93 1.57-3.5 3.5-3.5h4c1.1 0 2-.9 2-2V5c0-1.1-.9-3-2-3h-3.5zM9.5 4a.75.75 0 110 1.5.75.75 0 010-1.5zM12.5 22c3.04 0 3.5-1.37 3.5-3v-2h-4v-1h6.5c1.93 0 3.5-1.74 3.5-4s-1.57-4-3.5-4h-2v2.5c0 1.93-1.57 3.5-3.5 3.5h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 3 2 3h3.5zm2 -3.5a.75.75 0 110-1.5.75.75 0 010 1.5z" opacity="0.4" /></svg> },
      { name: "PostgreSQL", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3" opacity="0.15" /><text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold">PG</text></svg> },
      { name: "MongoDB", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-.5 4-3 7-4.5 9.5C6 14 5.5 16 5.5 18c0 3 3 5 6.5 5s6.5-2 6.5-5c0-2-.5-4-2-6.5C15 9 12.5 6 12 2z" opacity="0.3" /></svg> },
    ],
  },
  {
    title: "도구 & 플랫폼",
    desc: "효율적인 개발 환경과 안정적인 배포를 지원합니다.",
    color: "from-amber-400 to-amber-600",
    barColor: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    level: 88,
    techs: [
      { name: "Figma", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2.5" opacity="0.4" /><rect x="6.5" y="3" width="5" height="8" rx="2.5" opacity="0.25" /><rect x="12.5" y="3" width="5" height="5" rx="2.5" opacity="0.3" /></svg> },
      { name: "AWS", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="3" opacity="0.15" /><text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="bold">AWS</text></svg> },
      { name: "Vercel", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 20h20L12 3z" opacity="0.4" /></svg> },
      { name: "Git", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.62 11.11l-8.73-8.73a1.29 1.29 0 00-1.83 0L9.09 4.35l2.32 2.32a1.53 1.53 0 011.94 1.95l2.24 2.24a1.53 1.53 0 11-.92.86l-2.09-2.09v5.5a1.53 1.53 0 11-1.26-.06V9.37a1.53 1.53 0 01-.83-2.01L8.2 5.06 2.38 10.88a1.29 1.29 0 000 1.83l8.73 8.73a1.29 1.29 0 001.83 0l8.68-8.68a1.29 1.29 0 000-1.65z" opacity="0.4" /></svg> },
      { name: "Docker", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13 4h3v3h-3V4zm-4 0h3v3H9V4zM5 8h3v3H5V8zm4 0h3v3H9V8zm4 0h3v3h-3V8zm4 0h3v3h-3V8zM9 12h3v3H9v-3zm-4 0h3v3H5v-3z" opacity="0.35" /></svg> },
    ],
  },
];

const trendingTechs = [
  { name: "AI 챗봇", color: "bg-violet-50 text-violet-600 border-violet-200" },
  { name: "서버리스", color: "bg-sky-50 text-sky-600 border-sky-200" },
  { name: "PWA", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { name: "마이크로프론트엔드", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Edge Computing", color: "bg-rose-50 text-rose-600 border-rose-200" },
];

export default function TechStack() {
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
    <section className="py-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10 fade-up">
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

        {/* Tech philosophy */}
        <div className="fade-up max-w-[700px] mx-auto mb-14">
          <div className="border-l-[3px] border-[var(--color-accent)] pl-4 bg-blue-50/50 py-3 pr-4 rounded-r-lg">
            <p className="text-[var(--color-dark-2)] text-[0.88rem] leading-relaxed italic">
              &ldquo;트렌디한 기술이 아닌, 프로젝트에 최적의 기술을 선택합니다. 안정성, 성능, 유지보수성을 종합적으로 고려하여 기술 스택을 구성합니다.&rdquo;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, ci) => (
            <div
              key={cat.title}
              className="fade-up bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group"
              style={{ transitionDelay: `${ci * 100}ms` }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-sm">
                    {cat.title === "프론트엔드" ? "FE" : cat.title === "백엔드" ? "BE" : "DV"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-dark)] text-[1rem]">{cat.title}</h3>
                  <span className="text-[var(--color-gray-light)] text-[0.75rem]">숙련도 {cat.level}%</span>
                </div>
              </div>

              {/* Category description */}
              <p className="text-[var(--color-gray)] text-[0.8rem] leading-relaxed mb-5">
                {cat.desc}
              </p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {cat.techs.map((tech) => (
                  <div
                    key={tech.name}
                    className={`px-3.5 py-2 border rounded-xl text-[0.85rem] font-medium transition-all duration-300 cursor-default flex items-center gap-2 ${cat.badgeBg}`}
                  >
                    <span className="opacity-70">{tech.icon}</span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>

              {/* Skill bar */}
              <div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.barColor} rounded-full transition-transform duration-1000 ease-out origin-left`}
                    style={{ transform: visible ? `scaleX(${cat.level / 100})` : 'scaleX(0)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending techs */}
        <div className="mt-12 fade-up text-center">
          <h4 className="text-[var(--color-dark)] font-bold text-[0.95rem] mb-4">
            최근 관심 기술
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingTechs.map((t) => (
              <span
                key={t.name}
                className={`px-4 py-2 border rounded-full text-[0.82rem] font-medium ${t.color} transition-all duration-300 hover:scale-105`}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
