"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  key: string;
  label?: string;
  title: string;
  description: string;
  primary: { href: string; text: string };
  secondary?: { href: string; text: string };
  /** 배경 사진. 비어 있으면 빗금 자리표시자가 대신 들어간다. */
  image: string;
  /** 사진을 어느 지점 기준으로 자를지 */
  position?: string;
};

const SLIDES: Slide[] = [
  {
    key: "intro",
    title: "홈페이지, 프로그램 제작",
    description: "기획부터 디자인, 개발, 배포까지 한 곳에서.",
    primary: { href: "/contact", text: "상담 신청" },
    secondary: { href: "/portfolio", text: "제작 사례 보기" },
    image: "/home-hero-studio-v2.webp",
    position: "object-[68%_center] md:object-center",
  },
  {
    key: "ateez",
    label: "포트폴리오",
    title: "에이티즈 콘서트 관객 참여형 프로그램 제작",
    description: "공연 중 관객이 직접 참여하는 실시간 프로그램을 만들었습니다.",
    primary: { href: "/portfolio", text: "사례 보기" },
    secondary: { href: "/contact", text: "비슷한 제작 문의" },
    image: "",
  },
];

const INTERVAL = 6000;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || SLIDES.length < 2) return;
    // 모션을 줄이도록 설정한 사람에게는 자동으로 넘기지 않는다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="주요 소개"
      className="relative bg-[#0b1220] text-white overflow-hidden min-h-[560px] md:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="flex min-h-[560px] md:min-h-[680px] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => {
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={slide.key}
              aria-hidden={i !== index}
              className="relative w-full shrink-0 flex items-center"
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.position ?? ""}`}
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[#111c2e]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent 0 11px, rgba(255,255,255,0.13) 11px 13px)",
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/95 via-[#0b1220]/70 to-[#0b1220]/40" />

              <div className="relative w-full max-w-[1280px] mx-auto px-5 pt-16 pb-32 md:pt-24 md:pb-44">
                <div className="max-w-[820px]">
                  {slide.label && (
                    <span className="inline-flex items-center h-7 px-2.5 mb-5 border border-white/35 text-[12px] font-bold text-white/85">
                      {slide.label}
                    </span>
                  )}
                  <Heading className="text-[38px] md:text-[64px] font-extrabold leading-[1.15] tracking-[-0.035em]">
                    {slide.title}
                  </Heading>
                  <p className="mt-5 text-[15px] md:text-[18px] text-white/75 leading-[1.7]">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.primary.href}
                      tabIndex={i === index ? undefined : -1}
                      className="inline-flex items-center justify-center h-[52px] px-7 bg-white text-[#0b1220] text-[15px] font-extrabold no-underline hover:bg-white/90 transition-colors"
                    >
                      {slide.primary.text}
                    </Link>
                    {slide.secondary && (
                      <Link
                        href={slide.secondary.href}
                        tabIndex={i === index ? undefined : -1}
                        className="inline-flex items-center justify-center h-[52px] px-7 border border-white/40 text-white text-[15px] font-bold no-underline hover:bg-white/10 transition-colors"
                      >
                        {slide.secondary.text}
                      </Link>
                    )}
                  </div>

                  {SLIDES.length > 1 && (
                    <div className="mt-10 flex items-center gap-2">
                      {SLIDES.map((s, n) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => go(n)}
                          tabIndex={i === index ? undefined : -1}
                          aria-label={`${n + 1}번째 소개 보기`}
                          aria-current={n === index}
                          className={`h-[3px] cursor-pointer border-0 p-0 transition-all duration-300 ${
                            n === index ? "w-10 bg-white" : "w-5 bg-white/35 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
