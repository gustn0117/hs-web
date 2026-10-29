"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import styles from "./Stage.module.css";

/** 글자 하나 찍는 간격 */
const TYPE_MS = 58;

const subscribeToMotionPref = (onChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** 서버에서는 움직임 여부를 알 수 없으니 안 움직이는 쪽으로 그려 둔다. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPref,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  );
}

/**
 * 한 줄을 타자 치듯 찍는다. 한 번 다 치면 그대로 둔다.
 *
 * 서버가 내려보내는 HTML 에는 글이 통째로 들어 있다 — 검색엔진과
 * 읽어 주는 기계는 그걸 읽고, 브라우저에서만 다시 찍는다.
 */
export default function TypeLine({ text }: { text: string }) {
  const still = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (still || typed >= text.length) return;
    const t = setTimeout(() => setTyped((v) => v + 1), TYPE_MS);
    return () => clearTimeout(t);
  }, [still, typed, text]);

  const done = still || typed >= text.length;

  return (
    <>
      <span aria-hidden={!still}>{still ? text : text.slice(0, typed)}</span>
      {!done && <span className={styles.caret} aria-hidden="true" />}
      {!still && <span className="sr-only">{text}</span>}
    </>
  );
}
