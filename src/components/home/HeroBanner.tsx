import Image from "next/image";
import Link from "next/link";
import TypeLine from "@/components/TypeLine";
import styles from "./HeroBanner.module.css";

const HEADLINE = "올겨울, 브랜드를 더 빛나게.";

/** 크리스마스 배경. 아래 카드가 겹치는 만큼 하단 여백을 확보한다. */
export default function HeroBanner() {
  return (
    <section className={styles.hero} aria-label="하온 소개">
      <div className={styles.scenery} aria-hidden="true">
        <Image
          src="/home-hero-christmas-wonderland.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={95}
          className={styles.background}
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.snow} aria-hidden="true" />

      <div className={styles.content}>
        <div className={`hero-enter ${styles.copy}`}>
          <p className={styles.greeting} lang="en">
            <span aria-hidden="true">✦</span>
            CHRISTMAS WITH HAON
            <span aria-hidden="true">✦</span>
          </p>

          <p className={styles.seasonalTitle} lang="en">
            <span>Christmas</span>
            <em>Wonderland</em>
          </p>

          {/* 타이핑 중에도 본문과 버튼의 위치를 유지한다. */}
          <h1 className={styles.headline}>
            <TypeLine text={HEADLINE} />
          </h1>

          <p className={styles.description}>
            홈페이지부터 쇼핑몰, 업무 시스템까지.
            <br />
            당신의 비즈니스에 꼭 맞는 웹 솔루션을 만듭니다.
          </p>

          <div className={styles.actions}>
            <Link
              href="/contact"
              className={`${styles.button} ${styles.primary}`}
            >
              상담 신청
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/portfolio"
              className={`${styles.button} ${styles.secondary}`}
            >
              제작 사례 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
