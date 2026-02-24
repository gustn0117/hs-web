"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-indigo-50/20 flex items-center pt-[72px] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      {/* Floating decorations */}
      <div className="absolute top-32 right-[15%] w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 right-[5%] w-4 h-4 bg-[var(--color-primary)] rounded-full opacity-20 animate-float" style={{ animationDelay: "0.8s" }} />
      <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-[var(--color-accent)] rounded-full opacity-15 animate-float" style={{ animationDelay: "2s" }} />

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 px-4 py-2 rounded-full text-[var(--color-primary)] text-[0.85rem] font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
              웹 제작 전문 에이전시
            </div>

            <h1 className="text-4xl md:text-[3.2rem] font-black text-[var(--color-dark)] leading-[1.2] mb-5 tracking-tight">
              당신의 비즈니스를
              <br />
              <span className="gradient-text">빛나게 할 웹사이트</span>
            </h1>

            <p className="text-lg text-[var(--color-gray)] mb-9 max-w-[480px] leading-relaxed mx-auto lg:mx-0">
              HS WEB은 감각적인 디자인과 최신 기술력으로 고객 맞춤형 홈페이지를
              제작합니다. 반응형 웹, 쇼핑몰, 랜딩페이지까지 모든 웹 솔루션을
              제공합니다.
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-[14px] rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 no-underline hover:scale-[1.02]"
              >
                무료 상담 받기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-lg font-semibold text-[var(--color-dark)] border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 no-underline bg-white/50 backdrop-blur-sm"
              >
                포트폴리오 보기
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-12">
              {[
                { num: 150, suffix: "+", label: "제작 프로젝트" },
                { num: 98, suffix: "%", label: "고객 만족도" },
                { num: 5, suffix: "년+", label: "업계 경력" },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left border-l-2 border-[var(--color-primary)]/30 pl-4">
                  <div className="font-extrabold text-2xl md:text-[2rem] gradient-text">
                    <Counter target={s.num} suffix={s.suffix} />
                  </div>
                  <div className="text-[var(--color-gray)] text-[0.85rem] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-full max-w-[500px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-emerald-500/10 animate-float" style={{ animationDuration: "5s" }}>
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 ml-3 bg-white px-3 py-1 rounded-md text-[var(--color-gray-light)] text-[0.75rem] font-mono border border-gray-100 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  hsweb.pics
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 rounded" />
                  <div className="flex gap-2">
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-lg p-5">
                  <div className="h-3 w-[70%] bg-[var(--color-dark)] opacity-20 rounded mb-2" />
                  <div className="h-2 w-[50%] bg-gray-300 rounded mb-3" />
                  <div className="h-6 w-20 bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <div className="w-5 h-5 bg-emerald-100 rounded mb-1.5" />
                      <div className="h-1.5 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-1.5 w-2/3 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="h-2 w-12 bg-gray-200 rounded" />
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-4 h-4 bg-gray-100 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
