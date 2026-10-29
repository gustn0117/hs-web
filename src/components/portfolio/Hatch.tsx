import type { CSSProperties } from "react";
import styles from "./Stage.module.css";

/**
 * 아직 안 만든 이미지 자리.
 *
 * 회색 네모로 비워 두면 나중에 무엇을 넣어야 했는지 아무도 기억 못 한다.
 * 그래서 빗금 위에 '무엇을 몇 px 로 만들면 되는지' 를 적어 둔다.
 * 실제 이미지가 나오면 이 자리를 <img> 로 바꾸면 끝이다.
 */
export default function Hatch({
  label,
  spec,
  ratio = "16 / 10",
  tone = "dark",
}: {
  /** 이 자리에 들어갈 그림이 무엇인지 */
  label: string;
  /** 권장 크기·형식 */
  spec: string;
  ratio?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={styles.hatch}
      data-tone={tone}
      style={{ "--ratio": ratio } as CSSProperties}
      role="img"
      aria-label={`준비 중인 이미지: ${label}`}
    >
      <span className={styles.hatchLabel}>{label}</span>
      <span className={styles.hatchSpec}>{spec}</span>
    </div>
  );
}
