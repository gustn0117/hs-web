"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

const CATEGORY_STYLES: Record<string, { bg: string; iconColor: string }> = {
  "브랜드 홈페이지": { bg: "from-amber-100 to-amber-50", iconColor: "text-amber-600" },
  "쇼핑몰": { bg: "from-pink-100 to-pink-50", iconColor: "text-pink-600" },
  "기업 홈페이지": { bg: "from-sky-100 to-sky-50", iconColor: "text-sky-600" },
  "랜딩페이지": { bg: "from-violet-100 to-violet-50", iconColor: "text-violet-600" },
  "웹 애플리케이션": { bg: "from-emerald-100 to-emerald-50", iconColor: "text-emerald-600" },
  "CMS": { bg: "from-orange-100 to-orange-50", iconColor: "text-orange-600" },
  "기업 관리 시스템": { bg: "from-indigo-100 to-indigo-50", iconColor: "text-indigo-600" },
  "기타": { bg: "from-gray-100 to-gray-50", iconColor: "text-gray-600" },
};

function FallbackIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

export default function Portfolio({ items }: { items?: PortfolioItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayItems = items || [];

  return (
    <section className="pt-32 pb-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            PORTFOLIO
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            최근 작업물
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            다양한 산업군의 클라이언트와 함께한 프로젝트들을 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((p, i) => {
            const style = CATEGORY_STYLES[p.category] || CATEGORY_STYLES["기타"];
            return (
              <Link
                key={p.id}
                href={`/portfolio/${p.id}`}
                className="fade-up rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/50 group no-underline text-inherit"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`h-[200px] relative ${p.thumbnail ? '' : `bg-gradient-to-br ${style.bg} ${style.iconColor}`}`}>
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FallbackIcon />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-6 py-2 border-2 border-white text-white rounded-full text-sm font-semibold scale-75 group-hover:scale-100 transition-transform duration-300">
                      자세히 보기
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[0.75rem] text-[var(--color-primary)] font-semibold uppercase tracking-[1px] bg-emerald-50 px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                  <h3 className="text-[1.1rem] font-bold mt-2.5 text-[var(--color-dark)]">{p.title}</h3>
                  <p className="text-[var(--color-gray)] text-[0.9rem] mt-2">
                    {p.description}
                  </p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[0.7rem] px-2 py-0.5 bg-gray-50 text-[var(--color-gray-light)] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
