"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState, type CSSProperties } from "react";
import type { Review } from "@/lib/reviews";
import ReviewStars from "./ReviewStars";
import styles from "./ReviewWall.module.css";

const PREVIEW_COUNT = 4;
const SPEEDS = ["270s", "306s"];
const WORKS = {
  brand: { title: "세대를 잇는 브랜드 웹사이트", category: "BRAND WEBSITE", href: "/portfolio/42", order: 3 },
  system: { title: "기업 교육 신청 플랫폼", category: "WEB PLATFORM", href: "/portfolio/3", order: 1 },
  commerce: { title: "중국 상품 도매 플랫폼", category: "E-COMMERCE", href: "/portfolio/33", order: 9 },
} as const;

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const tone = index % 7 === 1 ? "blue" : index % 7 === 2 ? "butter" : "paper";

  return (
    <article
      className={styles.card}
      data-tone={tone}
      data-preview={index < PREVIEW_COUNT}
      data-long={review.comment.length > 150}
      style={{ "--review-order": index * 2 } as CSSProperties}
    >
      <div className={styles.noteTop}>
        <span className={styles.noteNumber}>NOTE {String(index + 1).padStart(3, "0")}</span>
        <ReviewStars score={review.score} size={12} className={styles.stars} />
      </div>
      <span className={styles.quoteMark} aria-hidden="true">“</span>
      <blockquote className={styles.comment}>{review.comment}</blockquote>
      <footer className={styles.noteFooter}>
        <div className={styles.author}>
          <span className={styles.avatar} aria-hidden="true">{review.nickname.charAt(0)}</span>
          <span>{review.nickname}<time dateTime={review.date}>{review.date.replaceAll("-", ".")}</time></span>
        </div>
        {review.priceRange && <span className={styles.price}>{review.priceRange}</span>}
      </footer>
    </article>
  );
}

function WorkCard({ kind, duplicate }: { kind: keyof typeof WORKS; duplicate: boolean }) {
  const work = WORKS[kind];

  return (
    <Link
      href={work.href}
      prefetch={false}
      tabIndex={duplicate ? -1 : undefined}
      className={styles.workCard}
      data-work={kind}
      style={{ "--review-order": work.order } as CSSProperties}
      aria-label={`하온 제작 사례: ${work.title}`}
    >
      <div className={styles.workImage}>
        <span className={styles.workLabel}>SELECTED WORK</span>
        <Image src={`/home-showcase/${kind}.webp`} alt={work.title} width={1600} height={1600} sizes="(min-width: 1024px) 400px, (min-width: 600px) 45vw, 90vw" className={styles.workCapture} />
        <span className={styles.workArrow}><Arrow /></span>
      </div>
      <div className={styles.workCaption}><span>{work.category}</span><span>HAON</span></div>
    </Link>
  );
}

function ReviewGroup({ entries, column, duplicate = false }: {
  entries: { review: Review; index: number }[];
  column: number;
  duplicate?: boolean;
}) {
  return (
    <div className={[styles.group, duplicate ? styles.duplicate : ""].join(" ")} aria-hidden={duplicate || undefined} inert={duplicate || undefined}>
      {column === 1 && <WorkCard kind="system" duplicate={duplicate} />}
      {entries.map(({ review, index }, position) => (
        <Fragment key={review.id}>
          <ReviewCard review={review} index={index} />
          {column === 0 && position === 0 && <WorkCard kind="brand" duplicate={duplicate} />}
          {column === 1 && position === 1 && <WorkCard kind="commerce" duplicate={duplicate} />}
        </Fragment>
      ))}
    </div>
  );
}

export default function ReviewWall({ reviews }: { reviews: Review[] }) {
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const entries = reviews.map((review, index) => ({ review, index }));
  const columns = [0, 1].map((column) => entries.filter(({ index }) => index % 2 === column));

  function toggleExpanded() {
    setExpanded(!expanded);
    if (expanded) {
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      }));
    }
  }

  return (
    <section id="client-stories" ref={sectionRef} className={styles.section} aria-labelledby="review-stories-title" data-expanded={expanded} data-paused={paused}>
      <div className={styles.eyebrow}>
        <span><span className={styles.asterisk} aria-hidden="true">✳</span> FROM OUR CLIENTS</span>
        <span>REAL PEOPLE. REAL WORDS.</span>
      </div>

      <div className={styles.intro}>
        <h1 id="review-stories-title" className={styles.title}>Good work.<br /><em>Great words.</em><span className={styles.titleDot} aria-hidden="true">✳</span></h1>
        <div className={styles.introCopy}>
          <p>좋은 결과물 뒤에는,<br />좋은 이야기가 남습니다.</p>
          <span>함께 만들고, 다시 찾아주신 고객들의 기록.<br />꾸미지 않은 진짜 후기를 모았습니다.</span>
        </div>
      </div>

      <div className={styles.stage}>
        <aside className={styles.poster} aria-label="하온 고객 후기 아카이브 표지">
          <div className={styles.posterTop}><span>THE WORD<br />IS GOOD.</span><span aria-hidden="true">↗</span></div>
          <Image src="/testimonials/quote-sculpture.webp" alt="" width={1536} height={1536} sizes="(min-width: 1024px) 520px, 90vw" className={styles.posterArt} />
          <div className={styles.posterBottom}>
            <span>HAON<br />CLIENT NOTES / 2026</span>
          </div>
        </aside>

        <div className={styles.reviewSide}>
          <div className={styles.archiveHeader}>
            <span>THE REVIEW ARCHIVE <span className={styles.archiveCount}>({reviews.length})</span></span>
            {!expanded && (
              <button type="button" className={styles.pauseButton} onClick={() => setPaused(!paused)} aria-pressed={paused} aria-controls="customer-review-wall">
                <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {paused ? <path d="m6 3 11 7-11 7V3Z" /> : <path d="M5 4h3v12H5V4Zm7 0h3v12h-3V4Z" />}
                </svg>
                {paused ? "다시 재생" : "잠시 멈춤"}
              </button>
            )}
          </div>
          <div id="customer-review-wall" className={styles.wall}>
            <div className={styles.grid}>
              {columns.map((column, i) => (
                <div key={i} className={styles.column}>
                  <div className={styles.track} style={{ "--speed": SPEEDS[i] } as CSSProperties}>
                    <ReviewGroup entries={column} column={i} />
                    {!expanded && <ReviewGroup entries={column} column={i} duplicate />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button type="button" className={styles.expandButton} onClick={toggleExpanded} aria-expanded={expanded} aria-controls="customer-review-wall">
          {expanded ? "후기 접기" : "모두 보기"}
          <span className={styles.buttonArrow} aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </div>
    </section>
  );
}

