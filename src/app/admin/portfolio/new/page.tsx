"use client";

import AdminHeader from "../../components/AdminHeader";
import PortfolioForm from "../../components/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">새 포트폴리오 추가</h2>
        <PortfolioForm />
      </div>
    </div>
  );
}
