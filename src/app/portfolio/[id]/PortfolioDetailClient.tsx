"use client";

import { useState } from "react";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/portfolio";
import { Breadcrumb, PageHeader } from "@/components/PageShell";

interface NavItem {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

interface Props {
  item: PortfolioItem;
  prevItem: NavItem | null;
  nextItem: NavItem | null;
}

function fmtDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function PortfolioDetailClient({ item, prevItem, nextItem }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="bg-[var(--color-bg-alt)] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <Breadcrumb items={[{ label: "포트폴리오", href: "/portfolio" }, { label: item.title }]} />
        <PageHeader title={item.title} caption={item.client} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
          <main className="min-w-0 space-y-4">
            {/* Meta info bar */}
            <div className="border border-[var(--color-border)] bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <MetaCell label="분류" value={item.category || "-"} />
                <MetaCell label="클라이언트" value={item.client || "-"} />
                <MetaCell label="제작일" value={item.date || fmtDate(item.createdAt)} />
                <MetaCell label="상태" value={item.featured ? "추천" : "완료"} point={item.featured} last />
              </div>
            </div>

            {/* Thumbnail */}
            {item.thumbnail && (
              <div className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>대표 이미지</h2>
                </div>
                <div className="p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full border border-[var(--color-border)] cursor-zoom-in"
                    onClick={() => setLightbox(-1)}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>프로젝트 소개</h2>
                </div>
                <div className="p-4 text-[13px] text-[var(--color-text-2)] leading-relaxed whitespace-pre-line">
                  {item.description}
                </div>
              </section>
            )}

            {/* Detail content */}
            {item.content && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>상세 설명</h2>
                </div>
                <div className="p-4 text-[13px] text-[var(--color-text-2)] leading-relaxed whitespace-pre-line">
                  {item.content}
                </div>
              </section>
            )}

            {/* Gallery */}
            {item.images && item.images.length > 0 && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>이미지 ({item.images.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--color-border)]">
                  {item.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="bg-white p-2 border-none cursor-zoom-in"
                    >
                      <div className="aspect-[4/3] overflow-hidden border border-[var(--color-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`${item.title} ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>태그</h2>
                </div>
                <div className="p-4 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span key={t} className="p-chip">{t}</span>
                  ))}
                </div>
              </section>
            )}

            {/* URL */}
            {item.url && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-[var(--color-muted)]">라이브 URL</p>
                    <p className="text-[13px] text-[var(--color-text)] tnum truncate">{item.url}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-btn p-btn-point shrink-0 no-underline"
                  >
                    방문하기 →
                  </a>
                </div>
              </section>
            )}

            {/* Prev/Next nav */}
            <div className="grid grid-cols-2 gap-0 border border-[var(--color-border)] bg-white">
              {prevItem ? (
                <Link
                  href={`/portfolio/${prevItem.id}`}
                  className="flex items-center gap-2 px-4 py-3 no-underline hover:bg-[var(--color-bg-alt)] border-r border-[var(--color-border)]"
                >
                  <span className="text-[var(--color-muted-2)]">‹</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[var(--color-muted)]">이전 프로젝트</p>
                    <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{prevItem.title}</p>
                  </div>
                </Link>
              ) : <span className="border-r border-[var(--color-border)]" />}

              {nextItem ? (
                <Link
                  href={`/portfolio/${nextItem.id}`}
                  className="flex items-center justify-end gap-2 px-4 py-3 no-underline hover:bg-[var(--color-bg-alt)]"
                >
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] text-[var(--color-muted)]">다음 프로젝트</p>
                    <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{nextItem.title}</p>
                  </div>
                  <span className="text-[var(--color-muted-2)]">›</span>
                </Link>
              ) : <span />}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>비슷한 프로젝트?</h2>
              </div>
              <div className="p-4">
                <p className="text-[12px] text-[var(--color-text-2)] mb-3 leading-relaxed">
                  이런 스타일의 홈페이지 제작이 필요하신가요?
                </p>
                <Link href="/contact" className="p-btn p-btn-point w-full no-underline">견적 상담</Link>
                <a href="tel:010-3319-2509" className="p-btn w-full tnum mt-2 no-underline">010-3319-2509</a>
              </div>
            </div>

            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>바로가기</h2>
              </div>
              <ul className="list-none">
                {[
                  { href: "/portfolio", label: "포트폴리오 목록" },
                  { href: "/services", label: "서비스 안내" },
                  { href: "/pricing", label: "가격 안내" },
                  { href: "/process", label: "제작 과정" },
                ].map((it) => (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className="flex items-center justify-between px-4 h-9 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
                    >
                      {it.label}
                      <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox === -1 ? item.thumbnail : (item.images?.[lightbox] ?? "")}
            alt={item.title}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}

function MetaCell({ label, value, point, last }: { label: string; value: string; point?: boolean; last?: boolean }) {
  return (
    <div
      className={`px-4 py-3 border-b md:border-b-0 ${
        last ? "" : "md:border-r"
      } border-[var(--color-border)]`}
    >
      <p className="text-[11px] text-[var(--color-muted)] mb-0.5">{label}</p>
      <p className={`text-[13px] font-semibold truncate ${point ? "text-[var(--color-point)]" : "text-[var(--color-text)]"}`}>
        {value}
      </p>
    </div>
  );
}
