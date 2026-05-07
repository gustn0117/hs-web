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

/* ╔════════════════════════════ HOVER ════════════════════════════╗ */

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

function HoverBorderDraw() {
  return (
    <button className="relative px-6 h-12 bg-white text-[var(--c-text)] font-semibold text-sm cursor-pointer border-0 group">
      <span className="relative z-10">border draw</span>
      <span className="absolute top-0 left-0 w-0 h-[2px] bg-[var(--c-main)] transition-all duration-200 group-hover:w-full" />
      <span className="absolute top-0 right-0 w-[2px] h-0 bg-[var(--c-main)] transition-all duration-200 delay-200 group-hover:h-full" />
      <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-[var(--c-main)] transition-all duration-200 delay-[400ms] group-hover:w-full" />
      <span className="absolute bottom-0 left-0 w-[2px] h-0 bg-[var(--c-main)] transition-all duration-200 delay-[600ms] group-hover:h-full" />
    </button>
  );
}

function HoverShake() {
  const [k, setK] = useState(0);
  return (
    <button
      key={k}
      onClick={() => setK((v) => v + 1)}
      className="px-5 h-11 rounded-md bg-[var(--c-hot)] text-white font-semibold text-sm border-0 cursor-pointer hover:animate-[fx-shake_0.4s_ease-in-out]"
    >
      click to shake
    </button>
  );
}

function HoverSkew() {
  return (
    <div className="w-32 h-24 rounded-[10px] bg-[var(--c-main)] cursor-pointer transition-transform duration-300 hover:skew-x-[-8deg] hover:-skew-y-2 hover:scale-105 flex items-center justify-center text-white font-bold">
      skew
    </div>
  );
}

function HoverBgSlide() {
  return (
    <button className="relative overflow-hidden px-6 h-12 rounded-md text-[var(--c-text)] hover:text-white font-bold text-sm border border-[var(--c-text)] bg-white cursor-pointer transition-colors duration-300 group">
      <span className="relative z-10">bg slide in</span>
      <span className="absolute inset-0 bg-[var(--c-text)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
    </button>
  );
}

function HoverIconSpin() {
  return (
    <button className="px-5 h-11 rounded-md bg-white border border-[var(--c-line-2)] text-[var(--c-text)] font-semibold text-sm cursor-pointer flex items-center gap-2 group">
      <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
      icon spin
    </button>
  );
}

function HoverLabelFlip() {
  return (
    <button className="relative h-11 px-6 rounded-md bg-[var(--c-text)] text-white font-semibold text-sm overflow-hidden border-0 cursor-pointer">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">기본</span>
      <span className="block absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--c-main)]">호버됨</span>
    </button>
  );
}

function HoverRipple() {
  const [ripples, setRipples] = useState<{ x: number; y: number; k: number }[]>([]);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const k = Date.now();
    setRipples((r) => [...r, { x, y, k }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.k !== k)), 600);
  };
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden h-12 px-6 rounded-md bg-[var(--c-main)] text-white font-semibold text-sm border-0 cursor-pointer"
    >
      <span className="relative z-10">click ripple</span>
      {ripples.map((r) => (
        <span
          key={r.k}
          className="absolute rounded-full bg-white/40 pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%)",
            animation: "fx-ripple 0.6s ease-out forwards",
          }}
        />
      ))}
    </button>
  );
}

/* ╔════════════════════════════ REVEAL ════════════════════════════╗ */

function FadeUpDemo() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={active} className="px-6 py-3 rounded-md bg-white border border-[var(--c-line)] text-[14px] font-semibold text-[var(--c-text)] hero-fade-up">
        fade up #{active + 1}
      </div>
      <button onClick={() => setActive((v) => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">
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
      <button onClick={() => setActive((v) => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">
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
          <span key={t} className="px-3 h-8 inline-flex items-center rounded-md bg-[var(--c-text)] text-white text-[12px] font-bold tracking-wider hero-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            {t}
          </span>
        ))}
      </div>
      <button onClick={() => setActive((v) => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">
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
      <button onClick={() => { setN(0); setRunning(true); }} className="text-[11px] px-3 h-7 rounded border border-[var(--c-line-2)] bg-white text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer">
        count up
      </button>
    </div>
  );
}

function SlideInLeftDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="px-6 py-3 rounded-md bg-[var(--c-main)] text-white font-bold text-sm" style={{ animation: "fx-slide-left 0.7s cubic-bezier(0.22,1,0.36,1) forwards" }}>
        ← slide in
      </div>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function ScaleInDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="w-24 h-24 rounded-[14px] bg-[var(--c-text)] flex items-center justify-center text-white font-black" style={{ animation: "fx-scale-in 0.6s cubic-bezier(0.22,1,0.36,1) forwards" }}>
        scale
      </div>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function RotateInDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="w-24 h-24 rounded-[14px] bg-[var(--c-main)] flex items-center justify-center text-white font-black" style={{ animation: "fx-rotate-in 0.7s cubic-bezier(0.22,1,0.36,1) forwards" }}>
        rotate
      </div>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function MaskRevealDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="overflow-hidden">
        <div className="text-[24px] font-black text-[var(--c-text)]" style={{ animation: "fx-mask-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards" }}>
          MASK REVEAL
        </div>
      </div>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function ProgressBarDemo() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setV((p) => (p >= 100 ? 0 : p + 5)), 200);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="w-56">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[var(--c-sub)] uppercase">progress</span>
        <span className="text-[12px] font-bold text-[var(--c-text)] tnum">{v}%</span>
      </div>
      <div className="h-2 bg-[var(--c-bg-2)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--c-main)] rounded-full transition-[width] duration-300" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

/* ╔════════════════════════════ TEXT ════════════════════════════╗ */

function GradientText() {
  return <h3 className="text-[28px] font-black hero-gradient-text">자체 개발 + 디자인</h3>;
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
        <span aria-hidden className="hero-scribble absolute left-0 right-0 -bottom-1 h-[10px] bg-[var(--c-main)]/15 rounded-sm" />
      </div>
      <button onClick={() => setK((v) => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">
        다시 보기 ↻
      </button>
    </div>
  );
}

function GlitchText() {
  return (
    <div className="relative text-[28px] font-black text-[var(--c-text)] tracking-tight" style={{ animation: "fx-glitch-base 3s steps(2) infinite" }}>
      <span aria-hidden className="absolute inset-0 text-red-500" style={{ animation: "fx-glitch-1 3s steps(2) infinite" }}>GLITCH</span>
      <span aria-hidden className="absolute inset-0 text-cyan-500" style={{ animation: "fx-glitch-2 3s steps(2) infinite" }}>GLITCH</span>
      <span className="relative">GLITCH</span>
    </div>
  );
}

function WaveText() {
  const text = "WAVE TEXT";
  return (
    <div className="text-[24px] font-black text-[var(--c-main)] flex">
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{ animation: `fx-wave 1.6s ease-in-out ${i * 0.08}s infinite` }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </div>
  );
}

function HighlightSweep() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <p key={k} className="text-[18px] font-bold text-[var(--c-text)]">
        <span className="relative inline-block">
          중요한 키워드
          <span className="absolute inset-0 bg-yellow-300/60" style={{ animation: "fx-hl-sweep 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) forwards", transformOrigin: "left", transform: "scaleX(0)" }} />
        </span>
      </p>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function StrikeThroughDraw() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <p key={k} className="relative text-[20px] font-bold text-[var(--c-sub)]">
        취소된 텍스트
        <span className="absolute left-0 top-1/2 h-[2px] bg-[var(--c-hot)] origin-left" style={{ width: "100%", transform: "scaleX(0)", animation: "fx-strike 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) forwards" }} />
      </p>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function LetterRevealDemo() {
  const [k, setK] = useState(0);
  const text = "Letter by letter";
  return (
    <div className="flex flex-col items-center gap-3">
      <p key={k} className="text-[18px] font-bold text-[var(--c-text)]">
        {text.split("").map((c, i) => (
          <span key={i} className="inline-block" style={{ animation: "fx-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both", animationDelay: `${i * 0.04}s` }}>
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function GradientOutlineText() {
  return (
    <h3
      className="text-[36px] font-black tracking-tight"
      style={{
        WebkitTextStroke: "2px transparent",
        background: "linear-gradient(110deg, #0a2a5e, #2459b0, #5b87dc, #0a2a5e)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animation: "fx-bg-shift 4s ease-in-out infinite",
      }}
    >
      OUTLINE
    </h3>
  );
}

function VariableWeightDemo() {
  return (
    <p className="text-[28px] tracking-tight text-[var(--c-text)]" style={{ animation: "fx-weight 3s ease-in-out infinite" }}>
      Weight Anim
    </p>
  );
}

/* ╔════════════════════════════ LAYOUT / CARD ════════════════════════════╗ */

function CardFlipDemo() {
  return (
    <div className="w-40 h-28 group [perspective:800px]">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 rounded-[12px] bg-[var(--c-text)] text-white flex items-center justify-center font-bold [backface-visibility:hidden]">
          앞면 (호버)
        </div>
        <div className="absolute inset-0 rounded-[12px] bg-[var(--c-main)] text-white flex items-center justify-center font-bold [transform:rotateY(180deg)] [backface-visibility:hidden]">
          뒷면!
        </div>
      </div>
    </div>
  );
}

function StackedCardsDemo() {
  return (
    <div className="relative w-40 h-28">
      {[2, 1, 0].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-[12px] border border-[var(--c-line)] bg-white"
          style={{
            transform: `translateY(${i * 6}px) translateX(${i * 4}px)`,
            zIndex: 10 - i,
            opacity: 1 - i * 0.18,
          }}
        >
          <div className="p-3">
            <div className="h-2 w-12 bg-[var(--c-line-2)] rounded mb-2" />
            <div className="h-1.5 w-20 bg-[var(--c-line-2)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState(0);
  return (
    <div className="w-full max-w-[280px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-[var(--c-line)]">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-2 text-[13px] font-semibold text-[var(--c-text)] bg-transparent border-0 cursor-pointer">
            항목 {i}
            <svg className={`w-3.5 h-3.5 text-[var(--c-sub)] transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? "60px" : "0px" }}>
            <p className="text-[11.5px] text-[var(--c-sub)] pb-2 leading-[1.6]">자식 항목 내용 영역</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabIndicatorDemo() {
  const [tab, setTab] = useState(0);
  const tabs = ["전체", "신규", "완료"];
  return (
    <div className="relative inline-flex bg-[var(--c-bg-2)] rounded-md p-1">
      <span
        className="absolute top-1 bottom-1 bg-white shadow-sm rounded transition-[transform,width] duration-300 ease-out"
        style={{ width: `${100 / tabs.length}%`, transform: `translateX(${tab * 100}%)` }}
      />
      {tabs.map((t, i) => (
        <button key={t} onClick={() => setTab(i)} className={`relative z-10 px-4 h-8 text-[12px] font-bold border-0 bg-transparent cursor-pointer transition-colors ${tab === i ? "text-[var(--c-text)]" : "text-[var(--c-sub)]"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function ToggleSwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative w-14 h-8 rounded-full border-0 cursor-pointer transition-colors ${on ? "bg-emerald-500" : "bg-[var(--c-line-2)]"}`}
    >
      <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${on ? "translate-x-6" : ""}`} />
    </button>
  );
}

function ToastDemo() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={() => { setShow(true); setTimeout(() => setShow(false), 2400); }} className="px-4 h-9 rounded-md bg-[var(--c-text)] text-white text-[12px] font-semibold border-0 cursor-pointer">
        toast 띄우기
      </button>
      <div className="relative h-12 w-full">
        <div
          className={`absolute inset-x-0 mx-auto inline-flex items-center gap-2 px-4 h-10 rounded-md bg-emerald-500 text-white text-[12.5px] font-bold w-fit transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          ✓ 저장되었습니다
        </div>
      </div>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full h-full">
      <button onClick={() => setOpen(true)} className="absolute inset-0 m-auto w-fit h-fit px-4 h-9 inline-flex items-center rounded-md bg-[var(--c-text)] text-white text-[12px] font-semibold border-0 cursor-pointer">
        모달 열기
      </button>
      {open && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-[10px] p-4 w-[80%] max-w-[200px] text-center"
            style={{ animation: "fx-modal-in 0.2s cubic-bezier(0.22,1,0.36,1) forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[13px] font-bold text-[var(--c-text)] mb-2">알림</p>
            <p className="text-[11px] text-[var(--c-sub)] mb-3">예시 모달입니다.</p>
            <button onClick={() => setOpen(false)} className="px-3 h-7 text-[11px] rounded bg-[var(--c-text)] text-white border-0 cursor-pointer">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden border border-[var(--c-line)] rounded-[8px]">
      <button onClick={() => setOpen(true)} className="absolute inset-0 m-auto w-fit h-fit px-3 h-8 inline-flex items-center rounded-md bg-[var(--c-text)] text-white text-[11px] font-semibold border-0 cursor-pointer">
        drawer 열기
      </button>
      <div
        className={`absolute inset-y-0 right-0 w-[60%] bg-white border-l border-[var(--c-line)] p-3 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button onClick={() => setOpen(false)} className="text-[11px] text-[var(--c-sub)] cursor-pointer bg-transparent border-0 mb-2">✕ 닫기</button>
        <p className="text-[11px] font-bold text-[var(--c-text)]">사이드 드로어</p>
        <p className="text-[10px] text-[var(--c-sub)] mt-1">슬라이드로 등장</p>
      </div>
      {open && <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/30" style={{ zIndex: -1 }} />}
    </div>
  );
}

/* ╔════════════════════════════ LOADING ════════════════════════════╗ */

function SkeletonDemo() {
  return (
    <div className="w-56 space-y-2">
      <div className="h-3 w-32 bg-[var(--c-line-2)] rounded" style={{ animation: "fx-skeleton 1.4s ease-in-out infinite" }} />
      <div className="h-3 w-48 bg-[var(--c-line-2)] rounded" style={{ animation: "fx-skeleton 1.4s ease-in-out 0.2s infinite" }} />
      <div className="h-3 w-40 bg-[var(--c-line-2)] rounded" style={{ animation: "fx-skeleton 1.4s ease-in-out 0.4s infinite" }} />
    </div>
  );
}

function SpinnerCircle() {
  return (
    <svg className="w-10 h-10 text-[var(--c-main)] animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerDots() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-[var(--c-text)]"
          style={{ animation: "fx-bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function SpinnerBars() {
  return (
    <div className="flex items-end gap-1 h-10">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1.5 bg-[var(--c-main)] rounded-sm"
          style={{ animation: "fx-bars 1s ease-in-out infinite", animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function PulseLoader() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full bg-[var(--c-main)]/30" style={{ animation: "fx-ping-large 1.5s ease-out infinite" }} />
      <div className="absolute inset-2 rounded-full bg-[var(--c-main)]/40" style={{ animation: "fx-ping-large 1.5s 0.3s ease-out infinite" }} />
      <div className="absolute inset-4 rounded-full bg-[var(--c-main)]" />
    </div>
  );
}

function SvgPathLoader() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      <circle
        cx="50" cy="50" r="40"
        fill="none"
        stroke="#0a2a5e"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="60 250"
        style={{ transformOrigin: "center", animation: "fx-rotate 1.4s linear infinite" }}
      />
    </svg>
  );
}

/* ╔════════════════════════════ DECORATIVE ════════════════════════════╗ */

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
    <div className="w-20 h-20 rounded-[14px] flex items-center justify-center text-white font-black text-[20px] hero-float" style={{ background: "linear-gradient(135deg, #2459b0, #0a2a5e)" }}>
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
    <div className="relative w-48 h-32 rounded-[14px] overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a2a5e 0%, #2459b0 50%, #5b87dc 100%)" }}>
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
      {[[40, 50], [100, 30], [160, 50], [100, 70]].map(([cx, cy], i) => (
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
      <div className="absolute inset-0 rounded-full opacity-50 blur-2xl" style={{ background: "radial-gradient(circle, #2459b0 0%, transparent 70%)", animation: "hero-blob-a 6s ease-in-out infinite" }} />
      <div className="absolute inset-6 rounded-full bg-[var(--c-main)] flex items-center justify-center text-white font-black text-[18px]">●</div>
    </div>
  );
}

function GridBgDemo() {
  return (
    <div
      className="w-full h-full rounded-[8px] relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(10,42,94,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(10,42,94,0.12) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        animation: "fx-grid-drift 14s linear infinite",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0" />
    </div>
  );
}

function NoiseBgDemo() {
  return (
    <div className="w-full h-full rounded-[8px] relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a2a5e, #2459b0)" }}>
      <svg className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[18px]">NOISE</div>
    </div>
  );
}

function AuroraBgDemo() {
  return (
    <div className="w-full h-full rounded-[8px] overflow-hidden relative bg-[#0a0a14]">
      <div className="absolute inset-0 opacity-70" style={{ background: "conic-gradient(from 0deg at 50% 50%, #0a2a5e, #2459b0, #5b87dc, #c4b5fd, #0a2a5e)", animation: "fx-rotate 12s linear infinite", filter: "blur(40px)" }} />
      <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[18px] tracking-wider">AURORA</div>
    </div>
  );
}

function ScanlineDemo() {
  return (
    <div className="w-full h-full rounded-[8px] overflow-hidden relative bg-[#0a0a14]">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)" }} />
      <div className="absolute inset-x-0 h-1 bg-cyan-400/50" style={{ animation: "fx-scanline 3s linear infinite", filter: "blur(1px)" }} />
      <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-mono font-bold">SCAN</div>
    </div>
  );
}

function ParticleDriftDemo() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 53) % 200;
        const y = (i * 37) % 100;
        return (
          <circle key={i} cx={x} cy={y} r="1.5" fill="#0a2a5e" opacity="0.6">
            <animate attributeName="cy" values={`${y};${y - 30};${y}`} dur={`${3 + (i % 3)}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${3 + (i % 3)}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

function ConfettiDemo() {
  const [k, setK] = useState(0);
  const colors = ["#0a2a5e", "#2459b0", "#5b87dc", "#fbbf24", "#10b981", "#ef4444"];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-20" key={k}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-3 rounded-sm"
            style={{
              left: "50%",
              top: "100%",
              background: colors[i % colors.length],
              animation: `fx-confetti 1.4s cubic-bezier(0.22,1,0.36,1) forwards`,
              animationDelay: `${i * 0.02}s`,
              transform: `translate(-50%, 0) rotate(${i * 30}deg)`,
              ["--dx" as string]: `${(i - 10) * 12}px`,
              ["--dy" as string]: `${-30 - (i % 4) * 20}px`,
            }}
          />
        ))}
      </div>
      <button onClick={() => setK(v => v + 1)} className="px-3 h-7 text-[11px] rounded border border-[var(--c-line-2)] bg-white text-[var(--c-text)] cursor-pointer">
        🎉 발사
      </button>
    </div>
  );
}

function SparkleStarsDemo() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 10 + (i * 73) % 180;
        const y = 10 + (i * 47) % 80;
        return (
          <g key={i} style={{ animation: `fx-twinkle 2s ease-in-out infinite`, animationDelay: `${i * 0.18}s`, transformOrigin: `${x}px ${y}px` }}>
            <path d={`M ${x} ${y - 4} L ${x + 1} ${y - 1} L ${x + 4} ${y} L ${x + 1} ${y + 1} L ${x} ${y + 4} L ${x - 1} ${y + 1} L ${x - 4} ${y} L ${x - 1} ${y - 1} Z`} fill="#0a2a5e" />
          </g>
        );
      })}
    </svg>
  );
}

/* ╔════════════════════════════ INTERACTION ════════════════════════════╗ */

function CursorTrailDemo() {
  const [pts, setPts] = useState<{ x: number; y: number; k: number }[]>([]);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const k = Date.now();
    setPts((prev) => [...prev.slice(-12), { x: e.clientX - rect.left, y: e.clientY - rect.top, k }]);
  };
  return (
    <div onMouseMove={onMove} className="relative w-full h-full rounded-[8px] bg-white border border-dashed border-[var(--c-line-3)] flex items-center justify-center cursor-none">
      <span className="text-[12px] text-[var(--c-sub)]">마우스 이동</span>
      {pts.map((p, i) => (
        <span
          key={p.k}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: `${(i + 1) * 1.4}px`,
            height: `${(i + 1) * 1.4}px`,
            background: "var(--c-main)",
            transform: "translate(-50%, -50%)",
            opacity: (i + 1) / pts.length,
            transition: "left 100ms, top 100ms",
          }}
        />
      ))}
    </div>
  );
}

function SpotlightFollowDemo() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };
  return (
    <div onMouseMove={onMove} className="relative w-full h-full rounded-[8px] overflow-hidden bg-[#0a0a14] flex items-center justify-center cursor-none">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle 100px at ${pos.x}% ${pos.y}%, rgba(91,135,220,0.6), transparent 70%)` }} />
      <span className="relative text-white text-[14px] font-bold tracking-wider">SPOTLIGHT</span>
    </div>
  );
}

function CustomCursorDemo() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div onMouseMove={onMove} className="relative w-full h-full rounded-[8px] bg-white border border-[var(--c-line)] flex items-center justify-center cursor-none">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="px-4 h-9 rounded-md bg-[var(--c-text)] text-white text-[12px] font-semibold border-0 cursor-none"
      >
        호버해보세요
      </button>
      <div
        className="absolute rounded-full pointer-events-none border-2 border-[var(--c-main)] transition-[width,height] duration-200"
        style={{
          left: pos.x, top: pos.y,
          width: hover ? "40px" : "16px",
          height: hover ? "40px" : "16px",
          transform: "translate(-50%,-50%)",
          background: hover ? "rgba(36,89,176,0.15)" : "transparent",
        }}
      />
    </div>
  );
}

function ScrollProgressDemo() {
  const [v, setV] = useState(0);
  return (
    <div className="w-full">
      <div className="h-1 bg-[var(--c-line-2)] rounded-full overflow-hidden mb-3">
        <div className="h-full bg-[var(--c-main)] transition-[width] duration-150" style={{ width: `${v}%` }} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(parseInt(e.target.value))}
        className="w-full"
      />
      <p className="text-[11px] text-[var(--c-sub)] text-center mt-2 tnum">스크롤 시뮬레이션 — {v}%</p>
    </div>
  );
}

function DragRotateDemo() {
  const [rot, setRot] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  return (
    <div
      ref={ref}
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => {
        if (!dragging.current) return;
        setRot((r) => r + e.movementX);
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="w-24 h-24 rounded-[14px] bg-[var(--c-text)] flex items-center justify-center text-white font-bold transition-none select-none" style={{ transform: `rotate(${rot}deg)` }}>
        drag
      </div>
    </div>
  );
}

/* ╔════════════════════════════ 3D / PERSPECTIVE ════════════════════════════╗ */

function CubeRotateDemo() {
  return (
    <div className="w-24 h-24 [perspective:600px]">
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", animation: "fx-cube-rotate 8s linear infinite" }}>
        {[
          { face: "front", t: "translateZ(48px)", bg: "#0a2a5e", label: "1" },
          { face: "back", t: "rotateY(180deg) translateZ(48px)", bg: "#1e4b9a", label: "2" },
          { face: "right", t: "rotateY(90deg) translateZ(48px)", bg: "#2459b0", label: "3" },
          { face: "left", t: "rotateY(-90deg) translateZ(48px)", bg: "#3b6ecb", label: "4" },
          { face: "top", t: "rotateX(90deg) translateZ(48px)", bg: "#5b87dc", label: "5" },
          { face: "bottom", t: "rotateX(-90deg) translateZ(48px)", bg: "#94b3e8", label: "6" },
        ].map((f) => (
          <div key={f.face} className="absolute inset-0 flex items-center justify-center text-white font-black text-[20px] border border-white/30" style={{ background: f.bg, transform: f.t }}>
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingLayersDemo() {
  return (
    <div className="relative w-44 h-32 [perspective:800px]">
      {[
        { z: 0, op: 1 },
        { z: -30, op: 0.6 },
        { z: -60, op: 0.3 },
      ].map((l, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-[12px] bg-white border border-[var(--c-line)]"
          style={{
            transform: `translateZ(${l.z}px) translateY(${i * -8}px) translateX(${i * 8}px)`,
            opacity: l.op,
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
}

function PerspectiveCardDemo() {
  return (
    <div className="w-32 h-32 [perspective:600px]">
      <div className="w-full h-full" style={{ transform: "rotateX(15deg) rotateY(-15deg)" }}>
        <div className="w-full h-full rounded-[14px] flex items-center justify-center text-white font-black text-[18px] shadow-2xl" style={{ background: "linear-gradient(135deg, #0a2a5e, #2459b0)" }}>
          3D card
        </div>
      </div>
    </div>
  );
}

/* ╔════════════════════════════ MEDIA / IMAGE ════════════════════════════╗ */

function ImageHoverGrayscale() {
  return (
    <div className="w-48 h-32 rounded-[10px] overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-[filter] duration-500"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80&auto=format&fit=crop')" }}
      />
    </div>
  );
}

function ImageHoverOverlay() {
  return (
    <div className="relative w-48 h-32 rounded-[10px] overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&auto=format&fit=crop')" }} />
      <div className="absolute inset-0 bg-[var(--c-text)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
        <span className="text-white font-bold text-[14px]">View →</span>
      </div>
    </div>
  );
}

function ImageClipReveal() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={k} className="w-48 h-28 rounded-[10px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&auto=format&fit=crop')", animation: "fx-clip-reveal 0.9s cubic-bezier(0.22,1,0.36,1) forwards" }} />
      <button onClick={() => setK(v => v + 1)} className="text-[11px] text-[var(--c-sub)] hover:text-[var(--c-text)] cursor-pointer bg-transparent border-0">↻</button>
    </div>
  );
}

function ParallaxImageDemo() {
  const [t, setT] = useState(0);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setT((e.clientX - rect.left) / rect.width);
  };
  return (
    <div onMouseMove={onMove} className="relative w-48 h-32 rounded-[10px] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&auto=format&fit=crop')", transform: `translateX(${(t - 0.5) * -20}px) scale(1.1)` }} />
      <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[14px]">Parallax</div>
    </div>
  );
}

/* ╔════════════════════════════ INPUT / FORM ════════════════════════════╗ */

function FloatingLabelDemo() {
  const [val, setVal] = useState("");
  return (
    <div className="relative w-48">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="peer w-full h-11 px-3 pt-3 bg-white border border-[var(--c-line-2)] rounded-md text-[13px] focus:outline-none focus:border-[var(--c-text)]"
        placeholder=" "
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--c-sub)] pointer-events-none transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-[var(--c-text)] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px]">
        이메일
      </span>
    </div>
  );
}

function CheckboxBounceDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <button onClick={() => setChecked((v) => !v)} className={`relative w-7 h-7 rounded border-2 border-0 cursor-pointer transition-all ${checked ? "bg-[var(--c-text)] border-[var(--c-text)]" : "bg-white border-[var(--c-line-3)]"}`}>
      <svg className="w-5 h-5 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} style={{ strokeDasharray: 24, strokeDashoffset: checked ? 0 : 24, transition: "stroke-dashoffset 0.3s 0.1s" }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </button>
  );
}

function InputFocusGlowDemo() {
  return (
    <input
      type="text"
      placeholder="포커스 시 글로우"
      className="w-48 h-11 px-3 bg-white border border-[var(--c-line-2)] rounded-md text-[13px] focus:outline-none focus:border-[var(--c-main)] focus:shadow-[0_0_0_4px_rgba(36,89,176,0.15)] transition-shadow"
    />
  );
}

/* ╔════════════════════════════ JUMP NAV ════════════════════════════╗ */

const SECTIONS: { id: string; label: string; count: number }[] = [
  { id: "hover", label: "Hover", count: 14 },
  { id: "reveal", label: "Reveal", count: 9 },
  { id: "text", label: "Text", count: 12 },
  { id: "layout", label: "Layout", count: 8 },
  { id: "loading", label: "Loading", count: 6 },
  { id: "deco", label: "Decorative", count: 11 },
  { id: "interaction", label: "Interaction", count: 5 },
  { id: "3d", label: "3D", count: 3 },
  { id: "media", label: "Media", count: 4 },
  { id: "input", label: "Input", count: 3 },
];

/* ╔════════════════════════════ MAIN ════════════════════════════╗ */

export default function EffectsShowcase() {
  return (
    <>
      {/* Inline keyframes for all custom effects */}
      <style jsx global>{`
        @keyframes fx-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fx-ripple {
          to { width: 300px; height: 300px; opacity: 0; }
        }
        @keyframes fx-slide-left {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fx-scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fx-rotate-in {
          from { transform: rotate(-180deg) scale(0.5); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        @keyframes fx-mask-up {
          from { transform: translateY(110%); }
          to { transform: translateY(0); }
        }
        @keyframes fx-fade-up {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fx-glitch-base {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(0, 1px); }
        }
        @keyframes fx-glitch-1 {
          0%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(-3px, 0); clip-path: inset(20% 0 60% 0); }
          40% { transform: translate(3px, 0); clip-path: inset(50% 0 20% 0); }
          60% { transform: translate(-2px, 0); clip-path: inset(70% 0 5% 0); }
        }
        @keyframes fx-glitch-2 {
          0%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(3px, 0); clip-path: inset(60% 0 20% 0); }
          40% { transform: translate(-3px, 0); clip-path: inset(15% 0 50% 0); }
          60% { transform: translate(2px, 0); clip-path: inset(40% 0 30% 0); }
        }
        @keyframes fx-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fx-hl-sweep {
          to { transform: scaleX(1); }
        }
        @keyframes fx-strike {
          to { transform: scaleX(1); }
        }
        @keyframes fx-bg-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fx-weight {
          0%, 100% { font-weight: 100; letter-spacing: 0.04em; }
          50% { font-weight: 900; letter-spacing: -0.02em; }
        }
        @keyframes fx-modal-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fx-skeleton {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes fx-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fx-bars {
          0%, 100% { height: 8px; }
          50% { height: 36px; }
        }
        @keyframes fx-ping-large {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes fx-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes fx-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 30px 30px; }
        }
        @keyframes fx-scanline {
          0% { top: -2%; }
          100% { top: 102%; }
        }
        @keyframes fx-confetti {
          to { transform: translate(calc(-50% + var(--dx)), var(--dy)) rotate(720deg); opacity: 0; }
        }
        @keyframes fx-twinkle {
          0%, 100% { transform: scale(0.4); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fx-cube-rotate {
          0% { transform: rotateX(0) rotateY(0); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes fx-clip-reveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
      `}</style>

      {/* Sticky category jump nav */}
      <nav className="sticky top-14 z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-slate-50/95 backdrop-blur-md border-y border-slate-200 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-slate-200 bg-white text-[12px] font-bold text-slate-700 hover:bg-slate-100 no-underline transition-colors"
            >
              {s.label}
              <span className="text-[10px] text-slate-400 tabular-nums">{s.count}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* HOVER */}
      <section id="hover" className="space-y-5 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">HOVER · 14</p>
          <h2 className="p-h2">호버 인터랙션</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">마우스 오버 시 즉시 반응. 버튼·카드·이미지·링크에 가장 자주 적용.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="떠오름 (Lift)" desc="살짝 위로 올라옴." tag="CSS"><HoverLift /></EffectCard>
          <EffectCard title="확대 (Scale)" desc="부드럽게 커짐." tag="CSS"><HoverScale /></EffectCard>
          <EffectCard title="그림자 글로우" desc="컬러 그림자가 퍼짐." tag="CSS"><HoverGlow /></EffectCard>
          <EffectCard title="그라데이션 시프트" desc="배경 그라데이션 좌→우 흐름." tag="CSS"><HoverGradient /></EffectCard>
          <EffectCard title="슬라이드 밑줄" desc="밑줄이 좌에서 우로 그려짐." tag="CSS"><div className="group"><HoverUnderline /></div></EffectCard>
          <EffectCard title="이미지 줌" desc="컨테이너 고정, 내부 이미지 확대." tag="CSS"><HoverImageZoom /></EffectCard>
          <EffectCard title="3D 틸트" desc="마우스 위치 따라 3D 회전." tag="React"><HoverTilt3D /></EffectCard>
          <EffectCard title="자석 (Magnetic)" desc="마우스 방향으로 끌림." tag="React"><HoverMagnetic /></EffectCard>
          <EffectCard title="테두리 그리기" desc="네 변이 순차적으로 그려짐." tag="CSS"><HoverBorderDraw /></EffectCard>
          <EffectCard title="흔들림 (Shake)" desc="실수·에러 강조." tag="CSS"><HoverShake /></EffectCard>
          <EffectCard title="기울임 (Skew)" desc="X/Y 축 비대칭 변형." tag="CSS"><HoverSkew /></EffectCard>
          <EffectCard title="배경 슬라이드" desc="배경이 좌→우로 채워짐." tag="CSS"><HoverBgSlide /></EffectCard>
          <EffectCard title="아이콘 스핀" desc="아이콘만 회전." tag="CSS"><HoverIconSpin /></EffectCard>
          <EffectCard title="라벨 크로스페이드" desc="텍스트 위·아래 슬라이드 전환." tag="CSS"><div className="group"><HoverLabelFlip /></div></EffectCard>
          <EffectCard title="클릭 리플" desc="클릭 지점에서 물결 퍼짐." tag="React"><HoverRipple /></EffectCard>
        </div>
      </section>

      {/* REVEAL */}
      <section id="reveal" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">REVEAL · 9</p>
          <h2 className="p-h2">등장 인터랙션</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">화면에 나타날 때 부드럽게 진입. 스크롤·페이지 진입에 사용.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <EffectCard title="페이드 업" desc="아래에서 위로." tag="CSS"><FadeUpDemo /></EffectCard>
          <EffectCard title="블러 인" desc="블러 풀어지며 등장." tag="CSS"><BlurInDemo /></EffectCard>
          <EffectCard title="스태거" desc="자식 순차 등장." tag="CSS"><StaggerDemo /></EffectCard>
          <EffectCard title="카운트 업" desc="0→목표 숫자." tag="React"><CounterDemo /></EffectCard>
          <EffectCard title="좌→우 슬라이드" desc="옆에서 진입." tag="CSS"><SlideInLeftDemo /></EffectCard>
          <EffectCard title="스케일 인" desc="작은 점에서 커지며 등장." tag="CSS"><ScaleInDemo /></EffectCard>
          <EffectCard title="회전 인" desc="회전하며 진입." tag="CSS"><RotateInDemo /></EffectCard>
          <EffectCard title="마스크 reveal" desc="아래 잘림이 풀리며 노출." tag="CSS"><MaskRevealDemo /></EffectCard>
          <EffectCard title="진행률 바" desc="가로 막대 채워짐." tag="React"><ProgressBarDemo /></EffectCard>
        </div>
      </section>

      {/* TEXT */}
      <section id="text" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">TEXT · 12</p>
          <h2 className="p-h2">텍스트 효과</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">헤드라인·키워드 강조. 브랜드 컬러와 인터랙션을 동시에 전달.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="그라데이션 텍스트" desc="자동 시프트 그라데이션." tag="CSS"><GradientText /></EffectCard>
          <EffectCard title="쉬머 (Shimmer)" desc="흰빛 띠가 통과." tag="CSS"><ShimmerTextDemo /></EffectCard>
          <EffectCard title="회전 단어" desc="수직 슬라이드로 단어 교체." tag="CSS"><WordRotatorDemo /></EffectCard>
          <EffectCard title="타이핑" desc="한 글자씩 타자." tag="React"><TypewriterDemo /></EffectCard>
          <EffectCard title="커서 깜빡임" desc="블링킹 캐럿." tag="CSS"><CursorBlinkDemo /></EffectCard>
          <EffectCard title="언더라인 sweep" desc="좌→우 클립패스 sweep." tag="CSS"><UnderlineSweepDemo /></EffectCard>
          <EffectCard title="글리치 (Glitch)" desc="RGB 분리 + 살짝 흔들림." tag="CSS"><GlitchText /></EffectCard>
          <EffectCard title="웨이브 텍스트" desc="글자별 위·아래 사인 곡선." tag="CSS"><WaveText /></EffectCard>
          <EffectCard title="형광펜 강조" desc="배경이 좌→우로 채워짐." tag="CSS"><HighlightSweep /></EffectCard>
          <EffectCard title="취소선 그리기" desc="가로선이 좌→우로 그어짐." tag="CSS"><StrikeThroughDraw /></EffectCard>
          <EffectCard title="글자별 등장" desc="한 글자씩 페이드 업." tag="CSS"><LetterRevealDemo /></EffectCard>
          <EffectCard title="아웃라인 그라데이션" desc="텍스트 윤곽선만 그라데이션." tag="CSS"><GradientOutlineText /></EffectCard>
          <EffectCard title="가변 폰트 weight" desc="얇음 ↔ 굵음 자동 전환." tag="CSS"><VariableWeightDemo /></EffectCard>
        </div>
      </section>

      {/* LAYOUT */}
      <section id="layout" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">LAYOUT · 8</p>
          <h2 className="p-h2">레이아웃 / 카드</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">컨테이너·카드·UI 컴포넌트의 인터랙션 패턴.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <EffectCard title="카드 플립" desc="앞·뒤 3D 회전 (호버)." tag="CSS"><CardFlipDemo /></EffectCard>
          <EffectCard title="스택 카드" desc="여러 장 겹친 듯한 깊이감." tag="CSS"><StackedCardsDemo /></EffectCard>
          <EffectCard title="아코디언" desc="펼치고 접히는 max-height." tag="React"><AccordionDemo /></EffectCard>
          <EffectCard title="탭 인디케이터" desc="활성 탭 하이라이트 슬라이드." tag="React"><TabIndicatorDemo /></EffectCard>
          <EffectCard title="토글 스위치" desc="ON/OFF 부드러운 전환." tag="React"><ToggleSwitchDemo /></EffectCard>
          <EffectCard title="토스트 알림" desc="위에서 내려와 자동 사라짐." tag="React"><ToastDemo /></EffectCard>
          <EffectCard title="모달" desc="페이드 + 스케일 인." tag="React"><ModalDemo /></EffectCard>
          <EffectCard title="사이드 드로어" desc="우측에서 슬라이드 인." tag="React"><DrawerDemo /></EffectCard>
        </div>
      </section>

      {/* LOADING */}
      <section id="loading" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">LOADING · 6</p>
          <h2 className="p-h2">로딩 / 상태</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">데이터 대기·인증·요청 중을 알려주는 시각화.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="스켈레톤" desc="블록이 흐려졌다 진해짐." tag="CSS"><SkeletonDemo /></EffectCard>
          <EffectCard title="원형 스피너" desc="회전하는 원호." tag="CSS"><SpinnerCircle /></EffectCard>
          <EffectCard title="점 로더 (Dots)" desc="3개 점 순차 바운스." tag="CSS"><SpinnerDots /></EffectCard>
          <EffectCard title="막대 로더 (Bars)" desc="등화기 형태 막대 위·아래." tag="CSS"><SpinnerBars /></EffectCard>
          <EffectCard title="펄스 로더" desc="중심에서 링이 퍼짐." tag="CSS"><PulseLoader /></EffectCard>
          <EffectCard title="SVG 패스" desc="끊긴 원호가 회전." tag="SVG"><SvgPathLoader /></EffectCard>
        </div>
      </section>

      {/* DECORATIVE */}
      <section id="deco" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">DECORATIVE · 11</p>
          <h2 className="p-h2">장식 / 배경</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">시선·무드·깊이감을 만드는 시각 요소.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="펄스 링" desc="라이브 상태 표시 ping." tag="CSS"><PulseRingDemo /></EffectCard>
          <EffectCard title="플로팅" desc="위아래 사인 곡선." tag="CSS"><FloatDemo /></EffectCard>
          <EffectCard title="마퀴" desc="좌→우 무한 흐름." tag="CSS"><MarqueeDemo /></EffectCard>
          <EffectCard title="글래스모피즘" desc="투명 + 블러 카드." tag="CSS"><GlassCardDemo /></EffectCard>
          <EffectCard title="네트워크 도트" desc="펄싱 노드 + 연결선." tag="SVG"><PingDotsDemo /></EffectCard>
          <EffectCard title="글로우 오브" desc="블러된 컬러 오브 부유." tag="CSS"><GlowOrbDemo /></EffectCard>
          <EffectCard title="드리프트 그리드" desc="격자 배경 천천히 흐름." tag="CSS"><GridBgDemo /></EffectCard>
          <EffectCard title="노이즈 텍스처" desc="SVG feTurbulence 노이즈." tag="SVG"><NoiseBgDemo /></EffectCard>
          <EffectCard title="오로라 메쉬" desc="conic 그라데이션 회전 + 블러." tag="CSS"><AuroraBgDemo /></EffectCard>
          <EffectCard title="스캔라인" desc="레트로 CRT 스캔 라인 흐름." tag="CSS"><ScanlineDemo /></EffectCard>
          <EffectCard title="파티클 드리프트" desc="작은 점들 위로 떠오름." tag="SVG"><ParticleDriftDemo /></EffectCard>
          <EffectCard title="컨페티" desc="버튼 클릭 시 색종이 폭발." tag="React"><ConfettiDemo /></EffectCard>
          <EffectCard title="반짝이는 별" desc="여러 별이 깜빡임." tag="SVG"><SparkleStarsDemo /></EffectCard>
        </div>
      </section>

      {/* INTERACTION */}
      <section id="interaction" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">INTERACTION · 5</p>
          <h2 className="p-h2">마우스 / 인터랙션</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">마우스·커서 기반의 고급 인터랙션.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="커서 트레일" desc="마우스 뒤로 점들이 따라옴." tag="React"><CursorTrailDemo /></EffectCard>
          <EffectCard title="스포트라이트" desc="마우스 위치를 따라가는 빛." tag="React"><SpotlightFollowDemo /></EffectCard>
          <EffectCard title="커스텀 커서" desc="원형 커서, 호버 시 확대." tag="React"><CustomCursorDemo /></EffectCard>
          <EffectCard title="스크롤 진행률" desc="페이지 상단 진행 바." tag="React"><ScrollProgressDemo /></EffectCard>
          <EffectCard title="드래그 회전" desc="마우스 드래그로 회전." tag="React"><DragRotateDemo /></EffectCard>
        </div>
      </section>

      {/* 3D */}
      <section id="3d" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">3D · 3</p>
          <h2 className="p-h2">3D / 퍼스펙티브</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">CSS transform 3D · perspective 활용.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="회전 큐브" desc="6면 큐브 자동 회전." tag="CSS"><CubeRotateDemo /></EffectCard>
          <EffectCard title="플로팅 레이어" desc="여러 카드 깊이 다르게 적층." tag="CSS"><FloatingLayersDemo /></EffectCard>
          <EffectCard title="퍼스펙티브 카드" desc="X/Y 회전된 정적 카드." tag="CSS"><PerspectiveCardDemo /></EffectCard>
        </div>
      </section>

      {/* MEDIA */}
      <section id="media" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">MEDIA · 4</p>
          <h2 className="p-h2">미디어 / 이미지</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">이미지·미디어와 결합한 효과.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="흑백 → 컬러" desc="호버 시 채도 복귀." tag="CSS"><ImageHoverGrayscale /></EffectCard>
          <EffectCard title="오버레이 등장" desc="호버 시 다크 오버레이 + CTA." tag="CSS"><ImageHoverOverlay /></EffectCard>
          <EffectCard title="클립 reveal" desc="좌→우 clip-path로 노출." tag="CSS"><ImageClipReveal /></EffectCard>
          <EffectCard title="패럴럭스 이미지" desc="마우스 X에 따라 시차 이동." tag="React"><ParallaxImageDemo /></EffectCard>
        </div>
      </section>

      {/* INPUT */}
      <section id="input" className="space-y-5 mt-12 scroll-mt-24">
        <header>
          <p className="p-overline mb-2">INPUT · 3</p>
          <h2 className="p-h2">입력 / 폼</h2>
          <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.7]">폼 컴포넌트의 마이크로 인터랙션.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EffectCard title="플로팅 라벨" desc="입력 시 라벨이 위로 이동." tag="CSS"><FloatingLabelDemo /></EffectCard>
          <EffectCard title="체크박스 그리기" desc="체크 표시가 펜으로 그려지듯." tag="React"><CheckboxBounceDemo /></EffectCard>
          <EffectCard title="포커스 글로우" desc="포커스 시 ring 그림자 확장." tag="CSS"><InputFocusGlowDemo /></EffectCard>
        </div>
      </section>
    </>
  );
}
