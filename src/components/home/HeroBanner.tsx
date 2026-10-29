"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroBanner.module.css";
import HeroWorkCollage from "./HeroWorkCollage";

type Slide = {
  key: string;
  label?: string;
  title: string;
  description: string;
  primary: { href: string; text: string };
  secondary?: { href: string; text: string };
  /** 배경 이미지. 비어 있으면 빗금 자리표시자가 대신 들어간다. */
  image: string;
  /** 밝은 배경에서는 사진의 먹색에 글자를 맞추고, 상담 버튼만 상호 색으로 남긴다. */
  tone?: "light";
  /** 문구와 이미지를 나란히 두고, 모바일에서는 위아래로 배치한다. */
  layout?: "split" | "editorial";
  /** 이미지를 어느 지점 기준으로 자를지 */
  position?: string;
  /** 배경 위에 덮어 문구의 가독성을 확보하는 그라데이션. */
  overlay: string;
  /** 제목 위에 상호 로고를 올릴지 */
  logo?: boolean;
};

const DIM = (...stops: string[]) => `linear-gradient(90deg, ${stops.join(", ")})`;
const ink = (a: number, at: number) => `rgba(11,18,32,${a}) ${at}%`;

const SLIDES: Slide[] = [
  {
    key: "intro",
    title: "쓰임에 맞는\n웹 솔루션",
    description:
      "홈페이지 제작부터 쇼핑몰, 랜딩페이지, CRM, 관리자 시스템까지 직접 설계하고 만듭니다.",
    primary: { href: "/contact", text: "상담 신청" },
    secondary: { href: "/portfolio", text: "제작 사례 보기" },
    image: "/home-hero-haon-studio-hq.webp",
    logo: true,
    tone: "light",
    layout: "split",
    position: "object-right md:object-center",
    overlay: "none",
  },
  {
    key: "ateez",
    label: "포트폴리오",
    title: "에이티즈 콘서트 관객 참여형 프로그램 제작",
    description: "공연 중 관객이 직접 참여하는 실시간 프로그램을 만들었습니다.",
    primary: { href: "/portfolio", text: "사례 보기" },
    secondary: { href: "/contact", text: "비슷한 제작 문의" },
    image: "/hero-ateez.webp",
    logo: true,
    // 무대가 오른쪽에 오도록 잡고, 글자가 놓이는 왼쪽은 더 진하게 덮는다.
    position: "object-[62%_center]",
    overlay: DIM(ink(0.96, 0), ink(0.9, 36), ink(0.62, 54), ink(0.3, 74), ink(0.22, 100)),
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
          const isLight = slide.tone === "light";
          const isEditorial = slide.layout === "editorial";
          const isSplit = slide.layout === "split" || isEditorial;
          return (
            <div
              key={slide.key}
              aria-hidden={i !== index}
              className={`relative w-full shrink-0 flex items-center ${isEditorial ? styles.editorialSlide : isLight ? "bg-[#f3f3f1] text-[#0d0d0f]" : isSplit ? "bg-[#080f1b]" : ""}`}
            >
              {isEditorial ? (
                <HeroWorkCollage active={i === index} />
              ) : slide.image ? (
                <div
                  className={`absolute ${isSplit ? `inset-x-0 bottom-8 h-[340px] md:top-1/2 md:bottom-auto md:h-auto md:aspect-[2/1] md:-translate-y-1/2 xl:inset-0 xl:aspect-auto xl:translate-y-0 2xl:max-w-[1640px] 2xl:ml-auto ${styles.brandScene}` : "inset-0"}`}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    quality={i === 0 ? 95 : 75}
                    sizes={isSplit ? "(max-width: 767px) 680px, 100vw" : "100vw"}
                    className={`object-cover ${slide.position ?? ""}`}
                  />
                </div>
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
              <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: slide.overlay }} />
              {/* 어두운 슬라이드는 모바일에서도 흰 문구가 잘 읽히도록 한다. */}
              {!isLight && !isSplit && <div className="absolute inset-0 bg-[#0b1220]/50 md:hidden" />}

              <div className={`relative w-full max-w-[1280px] mx-auto px-5 md:pt-24 md:pb-44 ${isEditorial ? styles.editorialCopy : isSplit ? "pt-14 pb-[340px]" : "pt-16 pb-32"}`}>
                {/* 지금 보이는 슬라이드만 올라오게 한다. 넘어갈 때마다 다시 실행된다. */}
                <div
                  className={`${i === index ? "hero-enter" : ""} ${
                    isSplit
                      ? "max-w-[470px] md:max-w-[300px] lg:max-w-[390px] xl:max-w-[470px]"
                      : "max-w-[820px]"
                  }`}
                >
                  {slide.logo && (
                    <Image
                      src={isLight ? "/brand/haon-logo.png" : "/brand/haon-logo-white.png"}
                      alt="하온 HAON Software Solutions"
                      width={751}
                      height={240}
                      priority={i === 0}
                      className="h-[34px] md:h-[42px] w-auto mb-6"
                    />
                  )}
                  {slide.label && (
                    <span className="inline-flex items-center h-7 px-2.5 mb-5 border border-white/35 text-[12px] font-bold text-white/85">
                      {slide.label}
                    </span>
                  )}
                  <Heading className={`text-[38px] font-extrabold leading-[1.15] tracking-[-0.035em] whitespace-pre-line ${isSplit ? "md:text-[54px] lg:text-[64px]" : "md:text-[64px]"}`}>
                    {slide.title}
                  </Heading>
                  <p className={`mt-5 text-[15px] md:text-[18px] leading-[1.7] ${isLight ? "text-[#38383d]" : "text-white/75"}`}>
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.primary.href}
                      tabIndex={i === index ? undefined : -1}
                      className={`inline-flex items-center justify-center h-[52px] px-7 text-[15px] font-extrabold no-underline transition-colors ${isEditorial ? "bg-[#1b1b18] text-white hover:bg-[#3b3a34]" : isLight ? "bg-[#0a2a5e] text-white hover:bg-[#061e47]" : "bg-white text-[#0b1220] hover:bg-white/90"}`}
                    >
                      {slide.primary.text}
                    </Link>
                    {slide.secondary && (
                      <Link
                        href={slide.secondary.href}
                        tabIndex={i === index ? undefined : -1}
                        className={`inline-flex items-center justify-center h-[52px] px-7 border text-[15px] font-bold no-underline transition-colors ${isLight ? "border-[#0d0d0f]/20 text-[#0d0d0f] hover:bg-white/50" : "border-white/40 text-white hover:bg-white/10"}`}
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
                            n === index
                              ? `w-10 ${isLight ? "bg-[#0d0d0f]" : "bg-white"}`
                              : `w-5 ${isLight ? "bg-[#0d0d0f]/25 hover:bg-[#0d0d0f]/50" : "bg-white/35 hover:bg-white/60"}`
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
