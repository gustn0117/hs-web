"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/portfolio";

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

export default function PortfolioDetailClient({ item, prevItem, nextItem }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Hero image load
  useEffect(() => {
    if (item.thumbnail) {
      const img = new Image();
      img.onload = () => setHeroLoaded(true);
      img.src = item.thumbnail;
    } else {
      setHeroLoaded(true);
    }
  }, [item.thumbnail]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft" && lightbox > 0) setLightbox(lightbox - 1);
      if (e.key === "ArrowRight" && lightbox < item.images.length - 1) setLightbox(lightbox + 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightbox, item.images.length]);

  const addRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  }, []);

  const allImages = item.thumbnail ? [item.thumbnail, ...item.images] : item.images;

  return (
    <div className="pt-[72px]">
      {/* ── Full-width Hero ── */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden bg-[var(--color-dark)]">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              heroLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark)]/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-sm no-underline hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            목록으로
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-[1100px] mx-auto">
            <div className={`flex flex-wrap gap-2 mb-4 transition-all duration-700 delay-200 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-[0.78rem] font-semibold rounded-full border border-white/20">
                {item.category}
              </span>
              {item.featured && (
                <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-blue-200 text-[0.78rem] font-semibold rounded-full border border-blue-400/30">
                  추천 프로젝트
                </span>
              )}
            </div>
            <h1 className={`text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight leading-[1.15] transition-all duration-700 delay-300 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {item.title}
            </h1>
            <p className={`text-white/60 text-lg md:text-xl max-w-[600px] leading-relaxed transition-all duration-700 delay-500 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {item.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Project Info Bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div
          ref={addRef(0)}
          className="max-w-[1100px] mx-auto px-6 py-6 fade-up"
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {item.client && (
              <div>
                <div className="text-[var(--color-gray-light)] text-[0.7rem] uppercase tracking-[0.12em] font-medium mb-0.5">클라이언트</div>
                <div className="text-[var(--color-dark)] font-semibold text-[0.95rem]">{item.client}</div>
              </div>
            )}
            {item.date && (
              <div>
                <div className="text-[var(--color-gray-light)] text-[0.7rem] uppercase tracking-[0.12em] font-medium mb-0.5">날짜</div>
                <div className="text-[var(--color-dark)] font-semibold text-[0.95rem]">{item.date}</div>
              </div>
            )}
            {item.tags.length > 0 && (
              <div>
                <div className="text-[var(--color-gray-light)] text-[0.7rem] uppercase tracking-[0.12em] font-medium mb-1.5">기술 스택</div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-gray-50 border border-gray-200 text-[var(--color-dark-2)] text-[0.78rem] rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.url && (
              <div className="ml-auto">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-dark)] text-white text-sm font-semibold rounded-lg no-underline hover:bg-[var(--color-dark-2)] transition-colors btn-ripple"
                >
                  사이트 방문
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content Section ── */}
      {item.content && (
        <section className="bg-[var(--color-light)]">
          <div className="max-w-[800px] mx-auto px-6 py-16 md:py-20">
            <div ref={addRef(1)} className="fade-up">
              <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">프로젝트 소개</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mb-8" />
              <div className="space-y-5">
                {item.content.split("\n").filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="text-[var(--color-gray)] text-[1.05rem] leading-[1.85]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery Section ── */}
      {allImages.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
            <div ref={addRef(2)} className="fade-up">
              <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">프로젝트 갤러리</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mb-10" />
            </div>

            {/* Bento Grid */}
            <div
              ref={addRef(3)}
              className="fade-up grid gap-3 md:gap-4"
              style={{
                gridTemplateColumns: "repeat(12, 1fr)",
                gridAutoRows: "minmax(140px, auto)",
              }}
            >
              {allImages.map((img, i) => {
                // Bento pattern: first image large, then alternate
                let colSpan: string;
                let rowSpan: string;
                if (i === 0) {
                  colSpan = "col-span-12 md:col-span-8";
                  rowSpan = "row-span-2";
                } else if (i === 1) {
                  colSpan = "col-span-12 md:col-span-4";
                  rowSpan = "row-span-2";
                } else if (allImages.length <= 4) {
                  colSpan = "col-span-6 md:col-span-6";
                  rowSpan = "row-span-1";
                } else {
                  colSpan = i % 3 === 2 ? "col-span-12 md:col-span-4" : "col-span-6 md:col-span-4";
                  rowSpan = "row-span-1";
                }

                return (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={`${colSpan} ${rowSpan} relative rounded-xl overflow-hidden group cursor-pointer bg-gray-100 border-0 p-0 text-left`}
                    style={{ minHeight: i < 2 ? "240px" : "180px" }}
                  >
                    <img
                      src={img}
                      alt={`${item.title} ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
                        <svg className="w-5 h-5 text-[var(--color-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Project Navigation ── */}
      <section className="bg-[var(--color-dark)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {prevItem ? (
              <Link
                href={`/portfolio/${prevItem.id}`}
                className="relative group flex items-end p-8 md:p-10 min-h-[200px] overflow-hidden no-underline border-b md:border-b-0 md:border-r border-white/10"
              >
                {prevItem.thumbnail && (
                  <img
                    src={prevItem.thumbnail}
                    alt={prevItem.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-500 scale-105 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/80 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-3 group-hover:text-white/60 transition-colors">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    이전 프로젝트
                  </div>
                  <div className="text-white font-bold text-lg md:text-xl group-hover:text-white transition-colors">
                    {prevItem.title}
                  </div>
                  <span className="mt-2 inline-block text-white/30 text-[0.78rem]">{prevItem.category}</span>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block border-r border-white/10" />
            )}
            {nextItem ? (
              <Link
                href={`/portfolio/${nextItem.id}`}
                className="relative group flex items-end justify-end p-8 md:p-10 min-h-[200px] overflow-hidden no-underline text-right"
              >
                {nextItem.thumbnail && (
                  <img
                    src={nextItem.thumbnail}
                    alt={nextItem.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-500 scale-105 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/80 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-end gap-2 text-white/40 text-sm mb-3 group-hover:text-white/60 transition-colors">
                    다음 프로젝트
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <div className="text-white font-bold text-lg md:text-xl group-hover:text-white transition-colors">
                    {nextItem.title}
                  </div>
                  <span className="mt-2 inline-block text-white/30 text-[0.78rem]">{nextItem.category}</span>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg md:text-xl mb-1">이런 프로젝트가 필요하신가요?</h3>
            <p className="text-white/60 text-sm">지금 바로 상담받아보세요. 무료 견적을 도와드립니다.</p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-3 bg-white text-[var(--color-primary)] font-bold rounded-lg no-underline hover:bg-gray-100 transition-colors text-sm shrink-0 btn-ripple"
          >
            무료 상담 신청
          </Link>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-0 cursor-pointer transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white/50 text-sm font-medium">
            {lightbox + 1} / {allImages.length}
          </div>

          {/* Image */}
          <img
            src={allImages[lightbox]}
            alt={`${item.title} ${lightbox + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border-0 cursor-pointer transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next */}
          {lightbox < allImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border-0 cursor-pointer transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-full">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-all cursor-pointer p-0 ${
                    i === lightbox ? "border-white opacity-100 scale-110" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
