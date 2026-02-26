"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TYPED_WORDS = ["홈페이지", "쇼핑몰", "CMS", "ERP 시스템", "랜딩페이지"];

function TypingEffect() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPED_WORDS[wordIndex];
    const speed = deleting ? 50 : 120;

    if (!deleting && charIndex === word.length) {
      setTimeout(() => setDeleting(true), 1800);
      return;
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % TYPED_WORDS.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex]);

  return (
    <span className="text-[var(--color-primary)]">
      {TYPED_WORDS[wordIndex].slice(0, charIndex)}
      <span className="inline-block w-[2px] h-[1em] bg-[var(--color-primary)] ml-0.5 align-middle animate-[blink-cursor_0.75s_step-end_infinite]" />
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const scrollY = window.scrollY;
      const blobs = sectionRef.current.querySelectorAll('.parallax-slow');
      blobs.forEach((blob) => {
        (blob as HTMLElement).style.transform = `translateY(${scrollY * 0.15}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20 flex items-center pt-[72px] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      {/* Floating decorations with parallax */}
      <div className="parallax-slow absolute top-32 right-[15%] w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
      <div className="parallax-slow absolute bottom-20 left-[10%] w-56 h-56 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 right-[5%] w-4 h-4 bg-[var(--color-primary)] rounded-full opacity-20 animate-float" style={{ animationDelay: "0.8s" }} />
      <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-[var(--color-accent)] rounded-full opacity-15 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] right-[30%] w-2 h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full opacity-15 animate-float" style={{ animationDelay: "2.5s", animationDuration: "4s" }} />
      <div className="absolute bottom-[30%] right-[8%] w-6 h-6 border border-blue-300/20 rounded-full animate-float" style={{ animationDelay: "1.2s", animationDuration: "5s" }} />
      <div className="absolute top-[60%] left-[5%] w-3 h-3 border border-blue-300/15 rounded-full animate-float" style={{ animationDelay: "3s", animationDuration: "4.5s" }} />

      {/* Geometric decorations */}
      <div className="absolute top-[25%] right-[6%] w-14 h-14 border border-blue-400/10 rounded-lg animate-rotate-slow pointer-events-none" />
      <div className="absolute bottom-[18%] left-[3%] w-20 h-[2px] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent pointer-events-none" />
      <div className="absolute top-[70%] right-[18%] w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/60 px-4 py-2 rounded-full text-[var(--color-primary)] text-[0.85rem] font-semibold mb-6 shadow-sm shadow-blue-100/50">
              웹 제작 &middot; 마케팅 전문 에이전시
            </div>

            <h1 className="text-4xl md:text-[3.2rem] font-black text-[var(--color-dark)] leading-[1.2] mb-4 tracking-tight">
              당신의 비즈니스를
              <br />
              <span className="shimmer-text">빛나게 할 웹사이트</span>
            </h1>

            {/* Sub-tagline */}
            <p className="text-[var(--color-primary)] font-semibold text-[0.9rem] mb-5 tracking-wide">
              기획부터 디자인, 개발, 유지보수까지 원스톱 솔루션
            </p>

            <p className="text-lg text-[var(--color-gray)] mb-9 max-w-[480px] leading-relaxed mx-auto lg:mx-0">
              HS WEB은 감각적인 디자인과 최신 기술력으로 웹사이트 제작부터
              SEO, 백링크 등 기술 마케팅까지 비즈니스 성장에 필요한 모든 웹
              솔루션을 제공합니다.
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link
                href="/contact"
                className="btn-ripple group inline-flex items-center gap-2 px-8 py-[14px] rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-blue-600 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 no-underline hover:scale-[1.02]"
              >
                무료 상담 받기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-xl font-semibold text-[var(--color-dark)] border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 no-underline bg-white/50 backdrop-blur-sm"
              >
                포트폴리오 보기
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-3 mt-6 justify-center lg:justify-start text-[0.8rem] text-[var(--color-gray-light)]">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                무료 상담
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                빠른 제작
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-emerald-600 font-semibold">유지보수 무료</span>
              </div>
            </div>

            {/* Key points */}
            <div className="flex flex-wrap gap-3 mt-10">
              {["맞춤형 디자인", "반응형 웹", "SEO / 마케팅", "유지보수 무료"].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 rounded-full text-[var(--color-gray)] text-[0.85rem] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[500px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-blue-500/10 animate-float" style={{ animationDuration: "5s" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 ml-3 bg-white px-3 py-1 rounded-md text-[var(--color-gray-light)] text-[0.75rem] font-mono border border-gray-100 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  hsweb.pics
                </div>
              </div>
              {/* Browser content */}
              <div className="p-6 space-y-4">
                {/* Nav */}
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded" />
                  <div className="flex gap-2">
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                    <div className="h-2 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
                {/* Hero area */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-lg p-5">
                  <div className="h-3 w-[70%] bg-[var(--color-dark)] opacity-20 rounded mb-2" />
                  <div className="h-2 w-[50%] bg-gray-300 rounded mb-3" />
                  <div className="h-6 w-20 bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded" />
                  {/* Typing effect area */}
                  <div className="mt-3 flex items-center gap-1 text-[0.7rem] text-[var(--color-gray)]">
                    <span>제작 중: </span>
                    <TypingEffect />
                  </div>
                </div>
                {/* Code simulation lines */}
                <div className="bg-gray-900 rounded-lg p-3 space-y-1.5 font-mono text-[0.6rem]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 w-4 text-right">1</span>
                    <span className="text-violet-400">import</span>
                    <span className="text-gray-300">{" { "}</span>
                    <span className="text-blue-400">useState</span>
                    <span className="text-gray-300">{" } "}</span>
                    <span className="text-violet-400">from</span>
                    <span className="text-amber-400">{" 'react'"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 w-4 text-right">2</span>
                    <span className="text-violet-400">const</span>
                    <span className="text-sky-300"> App</span>
                    <span className="text-gray-300"> = () =&gt; {"{"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 w-4 text-right">3</span>
                    <span className="text-gray-500 pl-4">return</span>
                    <span className="text-blue-400"> &lt;Layout&gt;</span>
                    <span className="text-gray-400">...</span>
                  </div>
                </div>
                {/* Cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: "bg-blue-100", border: "border-blue-50" },
                    { color: "bg-blue-100", border: "border-blue-50" },
                    { color: "bg-amber-100", border: "border-amber-50" },
                  ].map((c, n) => (
                    <div key={n} className={`bg-gray-50 rounded-lg p-2.5 border ${c.border}`}>
                      <div className={`w-5 h-5 ${c.color} rounded mb-1.5`} />
                      <div className="h-1.5 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-1.5 w-2/3 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
                {/* Footer */}
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
