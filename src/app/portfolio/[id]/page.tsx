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
      <section className="relative bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark-2)] py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-20" />
        <div className="max-w-[900px] mx-auto px-6 relative z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-[var(--color-gray-light)] no-underline text-sm hover:text-white transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            포트폴리오 목록
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] text-[0.8rem] font-semibold rounded-full">
              {item.category}
            </span>
            {item.featured && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[0.8rem] font-semibold rounded-full">
                추천 프로젝트
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {item.title}
          </h1>
          <p className="text-[var(--color-gray-light)] text-lg leading-relaxed max-w-[600px]">
            {item.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 mt-8">
            {item.client && (
              <div>
                <div className="text-gray-500 text-[0.75rem] uppercase tracking-wider mb-1">클라이언트</div>
                <div className="text-white font-medium text-sm">{item.client}</div>
              </div>
            )}
            {item.date && (
              <div>
                <div className="text-gray-500 text-[0.75rem] uppercase tracking-wider mb-1">날짜</div>
                <div className="text-white font-medium text-sm">{item.date}</div>
              </div>
            )}
            {item.url && (
              <div>
                <div className="text-gray-500 text-[0.75rem] uppercase tracking-wider mb-1">사이트</div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-light)] font-medium text-sm no-underline hover:underline">
                  방문하기 →
                </a>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {item.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/[0.06] border border-white/10 text-[var(--color-gray-light)] text-[0.8rem] rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Thumbnail */}
      {item.thumbnail && (
        <section className="max-w-[900px] mx-auto px-6 -mt-2">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/30">
            <img src={item.thumbnail} alt={item.title} className="w-full object-cover" />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-[900px] mx-auto px-6 py-16">
        {item.content && (
          <div className="prose-like">
            {item.content.split("\n").map((paragraph, i) => (
              <p key={i} className="text-[var(--color-dark-2)] text-[1rem] leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Gallery */}
        <PortfolioDetailClient images={item.images} title={item.title} />
      </section>

      {/* Navigation */}
      <section className="border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 py-10">
          <div className="flex justify-between items-center">
            {prevItem ? (
              <Link
                href={`/portfolio/${prevItem.id}`}
                className="flex items-center gap-2 text-[var(--color-gray)] no-underline hover:text-[var(--color-primary)] transition-colors group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className="text-right">
                  <div className="text-[0.75rem] text-[var(--color-gray-light)]">이전 프로젝트</div>
                  <div className="font-semibold text-sm">{prevItem.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextItem ? (
              <Link
                href={`/portfolio/${nextItem.id}`}
                className="flex items-center gap-2 text-[var(--color-gray)] no-underline hover:text-[var(--color-primary)] transition-colors group"
              >
                <div>
                  <div className="text-[0.75rem] text-[var(--color-gray-light)]">다음 프로젝트</div>
                  <div className="font-semibold text-sm">{nextItem.title}</div>
                </div>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
