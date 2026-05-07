"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";

/** Reusable effect card wrapper */
function EffectCard({
  title,
  desc,
  tag,
  children,
}: {
  title: string;
  desc: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-[14px] border border-[var(--c-line)] bg-white overflow-hidden hover:border-[var(--c-line-3)] transition-colors">
      <div className="relative h-[200px] flex items-center justify-center bg-[var(--c-bg-1)] p-6 overflow-hidden">
        {children}
      </div>
      <div className="px-5 py-4 border-t border-[var(--c-line)]">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-[14.5px] font-bold text-[var(--c-text)] truncate">{title}</h3>
          <span className="text-[10px] font-bold text-[var(--c-sub-2)] tracking-wider uppercase font-mono shrink-0">
            {tag}
          </span>
        </div>
        <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.6]">{desc}</p>
      </div>
    </div>
  );
}

/* ───────────────── HOVER ───────────────── */

function HoverLift() {
  return (
    <button className="px-5 h-11 rounded-md bg-[var(--c-text)] text-white font-semibold text-sm border-0 cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
      hover me ↑
    </button>
  );
}

function HoverScale() {
  return (
    <div className="w-24 h-24 rounded-[14px] bg-[var(--c-main)] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95" />
  );
}

function HoverGlow() {
  return (
    <button className="px-6 h-12 rounded-md bg-white text-[var(--c-text)] font-semibold text-sm border border-[var(--c-line-2)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(36,89,176,0.25)]">
      glow on hover
    </button>
  );
}

function HoverGradient() {
  return (
    <button
      className="px-6 h-12 rounded-md text-white font-bold text-sm border-0 cursor-pointer transition-[background-position] duration-700"
      style={{
        backgroundImage: "linear-gradient(110deg, #0a2a5e 0%, #2459b0 50%, #0a2a5e 100%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "0% 50%",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 50%")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0% 50%")}
    >
      gradient shift
    </button>
  );
}

function HoverUnderline() {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className="relative text-[15px] font-semibold text-[var(--c-text)] no-underline">
      <span>슬라이드 밑줄</span>
      <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[var(--c-main)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}

function HoverImageZoom() {
  return (
    <div className="w-48 h-32 rounded-[10px] overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80&auto=format&fit=crop')",
        }}
      />
    </div>
  );
}

function HoverTilt3D() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-32 h-32 rounded-[14px] flex items-center justify-center text-white font-bold transition-transform duration-100 cursor-pointer"
      style={{ background: "linear-gradient(135deg, #0a2a5e, #2459b0)", transformStyle: "preserve-3d" }}
    >
      3D tilt
    </div>
  );
}

function HoverMagnetic() {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="px-6 h-12 rounded-full bg-[var(--c-text)] text-white font-semibold text-sm border-0 cursor-pointer transition-transform duration-200 ease-out"
    >
      magnetic
    </button>
  );
}

/* ───────────────── SCROLL / REVEAL ───────────────── */

function FadeUpDemo() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={active} className="px-6 py-3 rounded-md bg-white border border-[var(--c-line)] text-[14px] font-semibold text-[var(--c-text)] hero-fade-up" style={{ animationDelay: "0s" }}>
        fade up #{active + 1}
      </div>
      <button
        onClick={() => setActive((v) => v + 1)}
        className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0"
      >
        다시 보기 ↻
      </button>
    </div>
  );
}

function BlurInDemo() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={active} className="text-[20px] font-bold text-[var(--c-text)] hero-blur-in">
        Blur reveal
      </div>
      <button
        onClick={() => setActive((v) => v + 1)}
        className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0"
      >
        다시 보기 ↻
      </button>
    </div>
  );
}

function StaggerDemo() {
  const [active, setActive] = useState(0);
  const items = ["UI", "UX", "DEV", "OPS"];
  return (
    <div className="flex flex-col items-center gap-4">
      <div key={active} className="flex gap-2">
        {items.map((t, i) => (
          <span
            key={t}
            className="px-3 h-8 inline-flex items-center rounded-md bg-[var(--c-text)] text-white text-[12px] font-bold tracking-wider hero-fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {t}
          </span>
        ))}
      </div>
      <button
        onClick={() => setActive((v) => v + 1)}
        className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0"
      >
        다시 보기 ↻
      </button>
    </div>
  );
}

function CounterDemo() {
  const [n, setN] = useState(0);
  const [running, setRunning] = useState(false);
  const target = 1247;
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.floor(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
      else setRunning(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[36px] font-black text-[var(--c-text)] tnum tabular-nums">{n.toLocaleString()}</p>
      <button
        onClick={() => {
          setN(0);
          setRunning(true);
        }}
        className="text-[11px] px-3 h-7 rounded border border-[var(--c-line-2)] bg-white text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer"
      >
        count up
      </button>
    </div>
  );
}

/* ───────────────── TEXT ───────────────── */

function GradientText() {
  return (
    <h3 className="text-[28px] font-black hero-gradient-text">자체 개발 + 디자인</h3>
  );
}

function ShimmerTextDemo() {
  return (
    <div className="text-[24px] font-black hero-text-shimmer hero-gradient-text" data-text="HS WEB">
      HS WEB
    </div>
  );
}

function WordRotatorDemo() {
  return (
    <div className="text-[20px] font-bold text-[var(--c-text)]">
      <span className="hero-word-rotator align-baseline">
        <span className="hero-word-rotator-track">
          <span>제대로 된</span>
          <span>빠르고 정확한</span>
          <span>감각적인</span>
          <span>실속 있는</span>
          <span>제대로 된</span>
        </span>
      </span>{" "}
      <span className="text-[var(--c-main)]">웹사이트</span>
    </div>
  );
}

function CursorBlinkDemo() {
  return (
    <p className="text-[16px] text-[var(--c-text)]">
      대기 중<span className="hero-cursor" aria-hidden />
    </p>
  );
}

function TypewriterDemo() {
  const phrases = ["Hello, world.", "Welcome to HS WEB.", "Custom-built sites."];
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = phrases[phraseIdx];
    const speed = deleting ? 30 : 60;
    const t = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) setText(current.slice(0, text.length + 1));
        else setTimeout(() => setDeleting(true), 1000);
      } else {
        if (text.length > 0) setText(current.slice(0, text.length - 1));
        else {
          setDeleting(false);
          setPhraseIdx((i) => (i + 1) % phrases.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases]);
  return (
    <div className="font-mono text-[14px] text-[var(--c-text)] min-h-[20px]">
      {text}
      <span className="hero-cursor" aria-hidden />
    </div>
  );
}

function UnderlineSweepDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="relative inline-block">
        <span className="text-[24px] font-bold text-[var(--c-text)]">강조 텍스트</span>
        <span
          aria-hidden
          className="hero-scribble absolute left-0 right-0 -bottom-1 h-[10px] bg-[var(--c-main)]/15 rounded-sm"
        />
      </div>
      <button
        onClick={() => setK((v) => v + 1)}
        className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0"
      >
        다시 보기 ↻
      </button>
    </div>
  );
}

/* ───────────────── DECO / OTHER ───────────────── */

function PulseRingDemo() {
  return (
    <span className="relative flex w-3 h-3">
      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-new)] opacity-75 animate-ping" />
      <span className="relative inline-flex w-3 h-3 rounded-full bg-[var(--c-new)]" />
    </span>
  );
}

function FloatDemo() {
  return (
    <div
      className="w-20 h-20 rounded-[14px] flex items-center justify-center text-white font-black text-[20px] hero-float"
      style={{ background: "linear-gradient(135deg, #2459b0, #0a2a5e)" }}
    >
      ↑
    </div>
  );
}

function MarqueeDemo() {
  const items = ["NEXT.JS", "REACT", "TYPESCRIPT", "TAILWIND", "FRAMER", "SVG"];
  return (
    <div className="w-full overflow-hidden p-marquee-wrap">
      <div className="p-marquee-track">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="text-[15px] font-bold text-[var(--c-text-2)] tracking-tight">
            {it}
            <span className="text-[var(--c-line-3)] mx-3">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function GlassCardDemo() {
  return (
    <div
      className="relative w-48 h-32 rounded-[14px] overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0a2a5e 0%, #2459b0 50%, #5b87dc 100%)",
      }}
    >
      <div className="absolute inset-3 rounded-[10px] bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
        <span className="text-white font-bold text-[14px]">Glass</span>
      </div>
    </div>
  );
}

function PingDotsDemo() {
  return (
    <svg viewBox="0 0 200 100" className="w-48 h-24">
      <defs>
        <radialGradient id="pd-pulse">
          <stop offset="0%" stopColor="#2459b0" />
          <stop offset="100%" stopColor="#2459b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[
        [40, 50],
        [100, 30],
        [160, 50],
        [100, 70],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3" fill="#0a2a5e" />
          <circle cx={cx} cy={cy} r="14" fill="url(#pd-pulse)">
            <animate attributeName="r" values="3;14;3" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <g stroke="rgba(10,42,94,0.25)" strokeWidth="0.8" fill="none">
        <line x1="40" y1="50" x2="100" y2="30" />
        <line x1="100" y1="30" x2="160" y2="50" />
        <line x1="160" y1="50" x2="100" y2="70" />
        <line x1="100" y1="70" x2="40" y2="50" />
      </g>
    </svg>
  );
}

function GlowOrbDemo() {
  return (
    <div className="relative w-32 h-32">
      <div
        className="absolute inset-0 rounded-full opacity-50 blur-2xl"
        style={{
          background: "radial-gradient(circle, #2459b0 0%, transparent 70%)",
          animation: "hero-blob-a 6s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-6 rounded-full bg-[var(--c-main)] flex items-center justify-center text-white font-black text-[18px]">
        ●
      </div>
    </div>
  );
}

/* ───────────────── PAGE LAYOUT ───────────────── */

export default function EffectsShowcase() {
  return (
    <>
      {/* HOVER */}
      <section className="space-y-5">
        <header>
          <p className="p-overline mb-2">HOVER</p>
          <h2 className="p-h2">호버 인터랙션</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">
            마우스 오버 시 즉시 반응하는 효과. 버튼·카드·이미지 등에 가장 자주 적용됩니다.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="떠오름 (Lift)" desc="호버 시 살짝 위로 올라옴. 클릭 가능 영역 강조에 유용." tag="CSS">
            <HoverLift />
          </EffectCard>
          <EffectCard title="확대 (Scale)" desc="호버 시 부드럽게 커짐. 카드·아이콘에 활용." tag="CSS">
            <HoverScale />
          </EffectCard>
          <EffectCard title="그림자 글로우 (Glow)" desc="호버 시 컬러 그림자가 퍼져 깊이감 부여." tag="CSS">
            <HoverGlow />
          </EffectCard>
          <EffectCard title="그라데이션 시프트" desc="호버 시 배경 그라데이션이 좌→우로 흘러감." tag="CSS">
            <HoverGradient />
          </EffectCard>
          <EffectCard title="슬라이드 밑줄" desc="호버 시 밑줄이 좌에서 우로 그려짐. 링크에 적합." tag="CSS">
            <div className="group">
              <HoverUnderline />
            </div>
          </EffectCard>
          <EffectCard title="이미지 줌" desc="컨테이너는 고정, 내부 이미지만 확대되며 잘림." tag="CSS">
            <HoverImageZoom />
          </EffectCard>
          <EffectCard title="3D 틸트 (Mouse follow)" desc="마우스 위치에 따라 카드가 3D로 기울어짐." tag="React">
            <HoverTilt3D />
          </EffectCard>
          <EffectCard title="자석 (Magnetic)" desc="호버 시 마우스 방향으로 살짝 끌려옴." tag="React">
            <HoverMagnetic />
          </EffectCard>
        </div>
      </section>

      {/* SCROLL / REVEAL */}
      <section className="space-y-5 mt-10">
        <header>
          <p className="p-overline mb-2">REVEAL</p>
          <h2 className="p-h2">등장 인터랙션</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">
            요소가 화면에 나타날 때 부드럽게 등장. 스크롤·페이지 진입 시 사용됩니다.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <EffectCard title="페이드 업" desc="아래에서 위로 페이드 인. 가장 기본." tag="CSS">
            <FadeUpDemo />
          </EffectCard>
          <EffectCard title="블러 인" desc="블러가 풀어지며 등장. 드라마틱한 진입." tag="CSS">
            <BlurInDemo />
          </EffectCard>
          <EffectCard title="스태거 (Stagger)" desc="자식 요소가 순차적으로 등장." tag="CSS">
            <StaggerDemo />
          </EffectCard>
          <EffectCard title="카운트 업" desc="0에서 목표 숫자까지 부드럽게 증가." tag="React">
            <CounterDemo />
          </EffectCard>
        </div>
      </section>

      {/* TEXT */}
      <section className="space-y-5 mt-10">
        <header>
          <p className="p-overline mb-2">TEXT</p>
          <h2 className="p-h2">텍스트 효과</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">
            헤드라인·키워드 강조. 브랜드 컬러와 인터랙션을 동시에 전달합니다.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="그라데이션 텍스트" desc="텍스트에 그라데이션 컬러 + 자동 위치 시프트." tag="CSS">
            <GradientText />
          </EffectCard>
          <EffectCard title="쉬머 (Shimmer)" desc="텍스트 위로 흰빛 띠가 통과." tag="CSS">
            <ShimmerTextDemo />
          </EffectCard>
          <EffectCard title="회전 단어" desc="여러 단어가 수직으로 슬라이드되며 교체." tag="CSS">
            <WordRotatorDemo />
          </EffectCard>
          <EffectCard title="타이핑 (Typewriter)" desc="문구가 한 글자씩 타이핑되고 지워짐." tag="React">
            <TypewriterDemo />
          </EffectCard>
          <EffectCard title="커서 깜빡임" desc="블링킹 캐럿. 입력 대기 느낌 연출." tag="CSS">
            <CursorBlinkDemo />
          </EffectCard>
          <EffectCard title="언더라인 sweep" desc="좌→우로 클립패스 sweep. 마커 휘갈김 효과." tag="CSS">
            <UnderlineSweepDemo />
          </EffectCard>
        </div>
      </section>

      {/* DECO */}
      <section className="space-y-5 mt-10">
        <header>
          <p className="p-overline mb-2">DECORATIVE</p>
          <h2 className="p-h2">데코레이션 / 레이아웃</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">
            배경 무드와 시선 흐름을 만드는 장식 요소들.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="펄스 링" desc="라이브 상태 표시(접속 중·실시간) 미세한 ping." tag="CSS">
            <PulseRingDemo />
          </EffectCard>
          <EffectCard title="플로팅 (Float)" desc="요소가 위아래로 부드럽게 떠다님." tag="CSS">
            <FloatDemo />
          </EffectCard>
          <EffectCard title="마퀴 (Marquee)" desc="콘텐츠가 좌→우로 무한히 흐름. 로고/태그 노출." tag="CSS">
            <MarqueeDemo />
          </EffectCard>
          <EffectCard title="글래스모피즘" desc="투명+블러 카드. 그라데이션 위에 얹어 깊이감." tag="CSS">
            <GlassCardDemo />
          </EffectCard>
          <EffectCard title="네트워크 도트" desc="연결된 노드가 차례로 펄싱. 시스템 상태·관계도." tag="SVG">
            <PingDotsDemo />
          </EffectCard>
          <EffectCard title="글로우 오브" desc="블러 처리된 컬러 오브가 천천히 떠다님." tag="CSS">
            <GlowOrbDemo />
          </EffectCard>
        </div>
      </section>
    </>
  );
}
