"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface HeroSlide {
  overline: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
  /** 사진을 넣을 때만 채우면 된다. 비어 있으면 빗금 자리표시자가 보인다. */
  image?: string;
}

const SLIDES: HeroSlide[] = [
  {
    overline: "홈페이지 제작",
    title: "249,000원부터\n시작합니다",
    desc: "기획부터 디자인, 개발, 배포까지 한 번에. 불필요한 비용 없이 실속 있게.",
    cta: { label: "상담 신청", href: "/contact" },
  },
  {
    overline: "무료 유지보수",
    title: "만든 뒤에도\n계속 봐드립니다",
    desc: "텍스트·이미지·콘텐츠 수정은 기간 제한 없이 무료로 지원합니다.",
    cta: { label: "서비스 보기", href: "/services" },
  },
  {
    overline: "소스코드 100% 제공",
    title: "결과물은\n온전히 고객의 것",
    desc: "납품 후 저작권을 모두 넘겨드립니다. 원하는 곳 어디로든 옮길 수 있습니다.",
    cta: { label: "제작 사례 보기", href: "/portfolio" },
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing]);

  const slide = SLIDES[index];

  return (
    <section className="relative bg-[#0b1220] text-white overflow-hidden min-h-[560px] md:min-h-[720px] flex items-center">
      {/* 배경: 사진이 없으면 빗금 자리표시자 */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          style={
            s.image
              ? { backgroundImage: `url(${s.image})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #101a2e 0px, #101a2e 14px, #16223a 14px, #16223a 28px)",
                }
          }
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/95 via-[#0b1220]/70 to-[#0b1220]/40" />

      <div className="relative w-full max-w-[1280px] mx-auto px-5 pt-16 pb-32 md:pt-24 md:pb-44">
        <div className="max-w-[760px]">
          <p className="text-[13px] md:text-[15px] font-bold text-white/75 tracking-[0.02em]">
            {slide.overline}
          </p>
          <h1 className="mt-3 md:mt-4 text-[34px] md:text-[60px] font-extrabold leading-[1.15] tracking-[-0.03em] whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="mt-5 text-[15px] md:text-[18px] text-white/75 leading-[1.7] max-w-[560px]">
            {slide.desc}
          </p>
          <Link
            href={slide.cta.href}
            className="mt-8 inline-flex items-center gap-2.5 text-[15px] font-bold text-white no-underline group"
          >
            <span className="w-12 h-12 rounded-full bg-white/10 border border-white/30 inline-flex items-center justify-center group-hover:bg-white group-hover:text-[#0b1220] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
            {slide.cta.label}
          </Link>
        </div>

        {/* 인디케이터 */}
        <div className="mt-12 flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}번 슬라이드`}
              aria-current={i === index}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer border-0 transition-colors ${
                i === index ? "bg-white" : "bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "자동 넘김 멈춤" : "자동 넘김 시작"}
            className="ml-1 w-7 h-7 inline-flex items-center justify-center text-white/70 hover:text-white cursor-pointer bg-transparent border-0 transition-colors"
          >
            {playing ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5h2v14H9zm4 0h2v14h-2z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* 좌우 화살표 */}
      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
        {[
          { label: "이전 슬라이드", d: "M15.75 19.5L8.25 12l7.5-7.5", on: () => go(index - 1) },
          { label: "다음 슬라이드", d: "M8.25 4.5l7.5 7.5-7.5 7.5", on: () => go(index + 1) },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={b.on}
            aria-label={b.label}
            className="w-12 h-12 rounded-full border border-white/40 text-white/80 inline-flex items-center justify-center hover:bg-white hover:text-[#0b1220] cursor-pointer bg-transparent transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={b.d} />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}
