import Image from "next/image";
import Link from "next/link";
import styles from "./HeroBanner.module.css";

const WORKS = [
  { key: "brand", number: "01", label: "브랜드 홈페이지", title: "청년과 장년을 잇는 세대 연결 플랫폼 제작", href: "/portfolio/42" },
  { key: "system", number: "02", label: "업무 시스템", title: "기업 교육 신청 플랫폼 제작", href: "/portfolio/3" },
  { key: "commerce", number: "03", label: "쇼핑몰", title: "중국 상품 도매 플랫폼 제작", href: "/portfolio/33" },
] as const;

export default function HeroWorkCollage({ active }: { active: boolean }) {
  return (
    <div className={styles.editorialArt} role="group" aria-label="하온의 실제 제작 사례">
      <div className={styles.paperGrid} aria-hidden="true" />
      <p className={styles.artHeading}>
        <span>HAON — SELECTED WORKS</span>
        <span>WEB / COMMERCE / SYSTEM</span>
      </p>

      {WORKS.map((work) => (
        <Link
          key={work.key}
          href={work.href}
          prefetch={false}
          tabIndex={active ? undefined : -1}
          aria-label={`${work.title} 자세히 보기`}
          className={`${styles.workCard} ${styles[work.key]}`}
        >
          <div className={styles.browserBar} aria-hidden="true">
            <span className={styles.browserDots}><i /><i /><i /></span>
            <span>{work.number} / {work.label}</span>
            <span>↗</span>
          </div>
          <div className={styles.captureViewport}>
            <Image
              src={`/home-showcase/${work.key}.webp`}
              alt={work.title}
              width={2000}
              height={2000}
              quality={95}
              priority={work.key === "brand"}
              sizes="(min-width: 1280px) 580px, (min-width: 768px) 460px, (min-width: 620px) 580px, 94vw"
              className={styles.projectCapture}
            />
          </div>
          <div className={styles.workCaption}>
            <span>{work.number} <strong>{work.label}</strong></span>
            <span aria-hidden="true">↗</span>
          </div>
        </Link>
      ))}

      <span className={styles.editorialSeal} aria-hidden="true">↗</span>
    </div>
  );
}
