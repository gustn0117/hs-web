"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  featured: boolean;
  order: number;
  date: string;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchItems = async () => {
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    setItems(data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 포트폴리오를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)]">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">
            HS <span className="gradient-text">WEB</span>
            <span className="text-[var(--color-gray-light)] font-normal text-sm ml-2">Admin</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--color-gray-light)] text-sm no-underline hover:text-white transition-colors"
          >
            사이트 보기
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/[0.06] border border-white/10 text-[var(--color-gray-light)] text-sm rounded-lg cursor-pointer hover:bg-white/10 transition-all"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">포트폴리오 관리</h2>
            <p className="text-[var(--color-gray-light)] text-sm">
              {items.length}개의 프로젝트
            </p>
          </div>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 text-white rounded-xl text-sm font-semibold no-underline hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 포트폴리오
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--color-gray-light)]">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-gray-light)] mb-4">아직 포트폴리오가 없습니다.</p>
            <Link
              href="/admin/portfolio/new"
              className="text-[var(--color-primary)] no-underline font-semibold hover:underline"
            >
              첫 번째 포트폴리오를 추가해보세요
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                {/* Thumbnail */}
                <div className="h-36 bg-gradient-to-br from-indigo-900/30 to-indigo-900/30 relative">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                  {item.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-[0.7rem] font-semibold rounded-full">
                      추천
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-[var(--color-gray-light)] text-[0.75rem] mb-1">
                    {item.category} · {item.date}
                  </div>
                  <h3 className="text-white font-semibold text-[0.95rem] mb-3">{item.title}</h3>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/portfolio/${item.id}/edit`}
                      className="flex-1 text-center py-2 bg-white/[0.06] border border-white/10 text-[var(--color-gray-light)] text-sm rounded-lg no-underline hover:bg-white/10 hover:text-white transition-all"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="flex-1 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg cursor-pointer hover:bg-red-500/20 transition-all"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
