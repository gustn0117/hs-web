"use client";

import { useEffect, useState } from "react";

/** 글자 하나씩 솟아오르게 하려고 쪼갠다. 띄어쓰기는 폭만 차지한다. */
const BRAND = "하온";
/** 첫 글자가 올라오기 시작하는 시점과 글자 사이 간격 */
const CHAR_START = 0.4;
const CHAR_GAP = 0.06;
/** 걷혀 올라간 뒤 문서에서 치우는 시점 */
const REMOVE_AFTER = 2900;

export default function IntroSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), REMOVE_AFTER);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro-splash" aria-hidden="true">
      <div className="intro-inner">
        <p className="intro-label">SOFTWARE SOLUTIONS</p>
        <p className="intro-phrase">종합 소프트웨어 솔루션</p>
        <h2 className="intro-brand">
          {BRAND.split("").map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              style={{ animationDelay: `${CHAR_START + i * CHAR_GAP}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h2>
        <span className="intro-line" />
      </div>
    </div>
  );
}
