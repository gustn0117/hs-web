"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import PortfolioForm from "../../../components/PortfolioForm";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  date: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  url: string;
  featured: boolean;
  order: number;
}

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/portfolio/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("항목을 찾을 수 없습니다.");
        return res.json();
      })
      .then((data) => setItem(data.item))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
        <h1 className="text-lg font-bold text-white">포트폴리오 수정</h1>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {loading ? (
          <div className="text-[var(--color-gray-light)] text-center py-20">로딩 중...</div>
        ) : error ? (
          <div className="text-red-400 text-center py-20">{error}</div>
        ) : item ? (
          <PortfolioForm
            editId={id}
            initialData={{
              ...item,
              tags: item.tags.join(", "),
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
