"use client";

import Link from "next/link";
import PortfolioForm from "../../components/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--color-dark)]">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link
          href="/admin/portfolio"
          className="text-[var(--color-gray-light)] no-underline hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          돌아가기
        </Link>
        <h1 className="text-lg font-bold text-white">새 포트폴리오 추가</h1>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <PortfolioForm />
      </div>
    </div>
  );
}
