"use client";

import Link from "next/link";
import { useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import styles from "./Stage.module.css";

const ALL = "전체";

function year(iso: string) {
  return iso ? iso.slice(0, 4) : "";
}

export default function WorkIndex({ items }: { items: PortfolioItem[] }) {
  const [picked, setPicked] = useState(ALL);

  const categories = [ALL, ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const shown = picked === ALL ? items : items.filter((i) => i.category === picked);

  return (
    <section className={styles.index} id="all-works" aria-labelledby="all-works-title">
      <div className={styles.wrap}>
        <div className={styles.indexHeading}>
          <h2 className={styles.indexTitle} id="all-works-title">전부 보기</h2>
          <p className={styles.indexCount} aria-live="polite" aria-atomic="true">
            {picked === ALL ? "전체" : picked} <span>{shown.length}</span>개 프로젝트
          </p>
        </div>

        <div className={styles.filters} role="group" aria-label="프로젝트 분야 선택">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.filter}
              aria-pressed={picked === c}
              onClick={() => setPicked(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className={styles.empty}>이 분야는 아직 공개한 작업이 없습니다.</p>
        ) : (
          <div className={styles.grid}>
            {shown.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.seq}`} className={styles.card}>
                <div className={styles.cardShot}>
                  {/* 썸네일은 Supabase 스토리지에서 온다. 도메인이 유동적이라 next/image 를 쓰지 않는다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.thumbnail && <img src={p.thumbnail} alt="" loading="lazy" decoding="async" />}
                </div>
                <p className={styles.cardMeta}>
                  <span>{String(p.seq).padStart(3, "0")}</span>
                  {year(p.createdAt) && <span>{year(p.createdAt)}</span>}
                  <span>{p.category || "기타"}</span>
                </p>
                <h3 className={styles.cardName}>{p.title}</h3>
                {p.client && <p className={styles.cardClient}>{p.client}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
