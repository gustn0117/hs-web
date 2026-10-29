"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Review } from "@/lib/reviews";

/** 글자 하나 찍는 간격 */
const TYPE_MS = 45;
/** 다 쓰고 나서 읽으라고 두는 시간 */
const HOLD_MS = 2400;
/** 밀려나고 들어오는 데 걸리는 시간. globals.css 의 quote-leave/enter 와 맞춰야 한다. */
const SLIDE_MS = 400;

/** 글씨 크기를 세 군데(본문·높이자·숨은 전문)에서 똑같이 써야 해서 묶어 둔다. */
const QUOTE_CLASS =
  "text-[20px] md:text-[30px] font-extrabold tracking-[-0.03em] leading-[1.6] text-[var(--c-text)] whitespace-pre-line";
const META_CLASS = "mt-7 flex items-center justify-center gap-2.5 text-[13px] text-[var(--c-sub)]";

const subscribeToMotionPref = (onChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** 효과 중에는 상태를 effect 안에서 바로 바꾸지 않으려고 외부 저장소로 읽는다. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPref,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // 서버에서는 알 수 없다. 움직이지 않는 쪽으로 그려 두고 브라우저에서 켠다.
    () => true
  );
}

function PriceTag({ range }: { range: string }) {
  return (
    <span className="shrink-0 inline-flex items-center h-[22px] px-2 bg-white border border-[var(--c-line)] text-[11px] font-medium text-[var(--c-sub)] tnum">
      {range}
    </span>
  );
}

export default function TypingQuote({ reviews }: { reviews: Review[] }) {
  const still = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const current = reviews[index];
  const text = current.comment;

  // 글자를 하나씩 찍고, 다 쓰면 잠깐 두었다가 밀어낸다.
  useEffect(() => {
    if (still || leaving) return;

    if (typed < text.length) {
      const t = setTimeout(() => setTyped((v) => v + 1), TYPE_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setLeaving(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [still, leaving, typed, text]);

  // 밀려 나간 뒤 다음 후기로 갈아끼운다.
  useEffect(() => {
    if (!leaving) return;

    const t = setTimeout(() => {
      setIndex((v) => (v + 1) % reviews.length);
      setTyped(0);
      setLeaving(false);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [leaving, reviews.length]);

  const shown = still ? text : text.slice(0, typed);
  const typing = !still && typed < text.length;

  // 후기마다 길이가 달라 화면이 출렁인다. 가장 긴 글로 자리를 미리 잡아 둔다.
  const tallest = reviews.reduce((a, b) => (b.comment.length > a.comment.length ? b : a));

  return (
    <div className="relative text-center">
      <div aria-hidden className="invisible" role="presentation">
        <p className={QUOTE_CLASS}>{tallest.comment}</p>
        <p className={META_CLASS}>
          <span>{tallest.nickname}</span>
          {tallest.priceRange && <PriceTag range={tallest.priceRange} />}
        </p>
      </div>

      <div className="absolute inset-0">
        <div key={index} className={leaving ? "quote-leave" : "quote-enter"}>
          {/* 읽어 주는 기계는 글자가 늘어나는 걸 따라 읽지 않아도 된다. 전문을 따로 준다. */}
          <blockquote className={QUOTE_CLASS} aria-hidden={!still}>
            {shown}
            {typing && <span className="quote-caret" />}
          </blockquote>
          {!still && <span className="sr-only">{text}</span>}

          <p className={META_CLASS}>
            <span>{current.nickname}</span>
            {current.priceRange && <PriceTag range={current.priceRange} />}
          </p>
        </div>
      </div>
    </div>
  );
}
