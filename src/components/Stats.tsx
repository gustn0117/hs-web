"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    num: 150, suffix: "+", label: "완료 프로젝트", subtext: "다양한 산업군에서 성공적 수행", color: "from-indigo-400 to-blue-300",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    num: 98, suffix: "%", label: "고객 만족도", subtext: "프로젝트 완료 후 설문 기준", color: "from-sky-400 to-cyan-300",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    num: 5, suffix: "년+", label: "업계 경력", subtext: "웹 개발 전문 노하우 축적", color: "from-violet-400 to-purple-300",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    num: 50, suffix: "+", label: "활성 클라이언트", subtext: "지속적 유지보수 계약 중", color: "from-amber-400 to-orange-300",
  },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-[var(--color-dark)] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      {/* Decorative geometric shapes */}
      <div className="absolute top-[15%] right-[10%] w-16 h-16 border border-indigo-500/10 rounded-lg animate-rotate-slow pointer-events-none" />
      <div className="absolute bottom-[20%] left-[8%] w-10 h-10 border border-indigo-500/10 rounded-full animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[50%] right-[25%] w-3 h-3 bg-indigo-400/20 rounded-full animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold shimmer-text inline-block mb-3">
            숫자로 증명하는 실력
          </h2>
          <p className="text-gray-400 text-[0.9rem]">HS WEB의 성과를 확인하세요</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] hover:ring-1 hover:ring-indigo-400/10 transition-all duration-500 group ${visible ? 'animate-bounce-in' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` }}
              >
                <div className="text-indigo-400 group-hover:text-white transition-colors duration-300">
                  {s.icon}
                </div>
              </div>
              <div className="text-4xl md:text-[2.8rem] font-black text-white mb-2 tracking-tight">
                <AnimatedCounter target={s.num} suffix={s.suffix} />
              </div>
              <div className="text-[var(--color-gray-light)] text-sm font-medium">
                {s.label}
              </div>
              <div className="text-gray-500 text-[0.72rem] mt-1">
                {s.subtext}
              </div>
              <div className={`w-10 h-1 bg-gradient-to-r ${s.color} rounded-full mx-auto mt-4 opacity-40 group-hover:opacity-100 group-hover:w-16 transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
