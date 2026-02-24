"use client";

import { useEffect, useState, use } from "react";
import AdminHeader from "../../../components/AdminHeader";
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
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">포트폴리오 수정</h2>

        {loading ? (
          <div className="text-[var(--color-gray)] text-center py-20">로딩 중...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-20">{error}</div>
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
