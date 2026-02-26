import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPortfolioItem, getPortfolioItems } from "@/lib/portfolio";
import PortfolioDetailClient from "./PortfolioDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getPortfolioItem(id);
  if (!item) return { title: "프로젝트를 찾을 수 없습니다" };
  return {
    title: `${item.title} | HS WEB 포트폴리오`,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getPortfolioItem(id);
  if (!item) notFound();

  const allItems = getPortfolioItems();
  const currentIndex = allItems.findIndex((i) => i.id === id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="relative bg-[var(--color-dark)] py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-[0.04]" />
        <div className="max-w-[900px] mx-auto px-6 relative z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-gray-400 no-underline text-sm hover:text-white transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            포트폴리오 목록
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-3 py-1 bg-white/10 text-gray-300 text-[0.8rem] font-semibold rounded-full border border-white/10">
              {item.category}
            </span>
            {item.featured && (
              <span className="px-3 py-1 bg-blue-500/15 text-blue-300 text-[0.8rem] font-semibold rounded-full border border-blue-500/20">
                추천 프로젝트
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-white mb-4 tracking-tight leading-tight">
            {item.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[600px]">
            {item.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10">
            {item.client && (
              <div>
                <div className="text-gray-500 text-[0.72rem] uppercase tracking-widest mb-1.5 font-medium">클라이언트</div>
                <div className="text-white font-semibold text-sm">{item.client}</div>
              </div>
            )}
            {item.date && (
              <div>
                <div className="text-gray-500 text-[0.72rem] uppercase tracking-widest mb-1.5 font-medium">날짜</div>
                <div className="text-white font-semibold text-sm">{item.date}</div>
              </div>
            )}
            {item.url && (
              <div>
                <div className="text-gray-500 text-[0.72rem] uppercase tracking-widest mb-1.5 font-medium">사이트</div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold text-sm no-underline hover:text-blue-300 transition-colors inline-flex items-center gap-1">
                  방문하기
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
            {item.tags.length > 0 && (
              <div>
                <div className="text-gray-500 text-[0.72rem] uppercase tracking-widest mb-1.5 font-medium">기술</div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-white/[0.06] border border-white/10 text-gray-300 text-[0.78rem] rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Thumbnail */}
      {item.thumbnail && (
        <section className="bg-[var(--color-light)]">
          <div className="max-w-[900px] mx-auto px-6 -mt-4 relative z-10">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/30">
              <img src={item.thumbnail} alt={item.title} className="w-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="bg-[var(--color-light)]">
        <div className="max-w-[900px] mx-auto px-6 py-16">
          {item.content && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10">
              {item.content.split("\n").map((paragraph, i) => (
                <p key={i} className="text-[var(--color-dark-2)] text-[1rem] leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Gallery */}
          <PortfolioDetailClient images={item.images} title={item.title} />
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-[var(--color-light)] border-t border-gray-200">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {prevItem ? (
              <Link
                href={`/portfolio/${prevItem.id}`}
                className="flex items-center gap-3 py-8 pr-6 text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div>
                  <div className="text-[0.75rem] text-[var(--color-gray)] mb-0.5">이전 프로젝트</div>
                  <div className="font-semibold text-sm">{prevItem.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextItem ? (
              <Link
                href={`/portfolio/${nextItem.id}`}
                className="flex items-center justify-end gap-3 py-8 pl-6 text-[var(--color-gray)] no-underline hover:text-[var(--color-dark)] transition-colors group text-right"
              >
                <div>
                  <div className="text-[0.75rem] text-[var(--color-gray)] mb-0.5">다음 프로젝트</div>
                  <div className="font-semibold text-sm">{nextItem.title}</div>
                </div>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
