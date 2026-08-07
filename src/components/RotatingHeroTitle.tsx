"use client";

import { useEffect, useState } from "react";

const PHRASES: { ko: string; en: string }[] = [
  { ko: "감각이 담긴 웹", en: "Crafted with intention." },
  { ko: "무드가 흐르는 웹", en: "Designed with mood." },
  { ko: "브랜드를 짓는 웹", en: "Built for your brand." },
  { ko: "정성을 담은 웹", en: "Made with care." },
  { ko: "오래 남는 웹", en: "Made to last." },
  { ko: "손끝까지 다듬은 웹", en: "Refined to the last pixel." },
  { ko: "이야기가 흐르는 웹", en: "A web with a story." },
  { ko: "태도가 다른 웹", en: "A different kind of web." },
];

const ROTATE_MS = 4200;
const KO_STEP_MS = 55;
const EN_STEP_MS = 22;

function splitChars(str: string) {
  return Array.from(str);
}

export default function RotatingHeroTitle() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % PHRASES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const p = PHRASES[idx];
  const koChars = splitChars(p.ko);
  const enChars = splitChars(p.en);
  const koTotal = koChars.length * KO_STEP_MS;

  return (
    <h1
      className="text-[42px] sm:text-[56px] md:text-[76px] lg:text-[92px] font-light tracking-[-0.03em] leading-[1.2] mb-8"
      aria-label={`${p.ko}. ${p.en}`}
    >
      {/* Line 1 — 한글 */}
      <span
        key={`ko-${idx}`}
        className="block"
        style={{ minHeight: "1.3em", paddingBottom: "0.05em", overflow: "visible" }}
        aria-hidden
      >
        {koChars.map((ch, i) => (
          <span
            key={i}
            className="hero-char"
            style={{ animationDelay: `${i * KO_STEP_MS}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
        <span
          className="hero-char text-white/30"
          style={{ animationDelay: `${koChars.length * KO_STEP_MS}ms` }}
        >
          .
        </span>
      </span>

      {/* Line 2 — 영문 (italic, 반투명) · descender + italic 오버플로 여유 */}
      <span
        key={`en-${idx}`}
        className="block text-white/60 font-thin italic"
        style={{
          minHeight: "1.4em",
          paddingBottom: "0.2em",
          paddingRight: "0.15em",
          overflow: "visible",
        }}
        aria-hidden
      >
        {enChars.map((ch, i) => (
          <span
            key={i}
            className="hero-char"
            style={{ animationDelay: `${koTotal + 180 + i * EN_STEP_MS}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </h1>
  );
}
