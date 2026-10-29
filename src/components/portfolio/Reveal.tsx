"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * 화면에 들어올 때 떠오르듯 나타나는 껍데기.
 *
 * 처음 그릴 때는 '보이는 상태'로 둔다. 자바스크립트가 안 돌거나 느려도
 * 글이 사라진 채로 남는 일이 없어야 하기 때문이다. 자리를 잡은 뒤에야
 * 화면 밖에 있는 것들을 숨겼다가 들어올 때 올린다.
 *
 * 상태를 바꾸는 일은 전부 관찰자 콜백 안에서 일어난다.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** 줄줄이 늘어선 것들을 한 박자씩 밀어 넣을 때 쓴다. ms */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        } else {
          setState("armed");
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={state}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
