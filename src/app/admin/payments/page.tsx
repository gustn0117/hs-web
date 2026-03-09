"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

interface Payment {
  id: string;
  client_id: string;
  client_name: string;
  amount: number;
  type: string;
  description: string | null;
  payment_date: string | null;
  status: string;
  created_at: string;
}

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "완료", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  confirming: { label: "입금확인중", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  pending: { label: "대기", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  overdue: { label: "미납", cls: "bg-red-50 text-red-700 border border-red-200" },
};

function fmt(n: number): string {
  return Number(n).toLocaleString() + "원";
}

type SortKey = "payment_date" | "amount" | "client_name";
type SortDir = "asc" | "desc";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("payment_date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((data) => setPayments(data.payments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "amount" ? "desc" : "asc");
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const filtered = payments
    .filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (p.client_name && p.client_name.toLowerCase().includes(q)) ||
          (p.type && p.type.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "payment_date") {
        const da = a.payment_date ?? "";
        const db = b.payment_date ?? "";
        // Default: upcoming first, then past
        if (sortDir === "asc") {
          const aFuture = da >= today ? 0 : 1;
          const bFuture = db >= today ? 0 : 1;
          if (aFuture !== bFuture) return aFuture - bFuture;
          if (aFuture === 0) return da.localeCompare(db);
          return db.localeCompare(da);
        }
        return db.localeCompare(da);
      }
      if (sortKey === "amount") return (a.amount - b.amount) * dir;
      if (sortKey === "client_name") return (a.client_name ?? "").localeCompare(b.client_name ?? "") * dir;
      return 0;
    });

  const types = [...new Set(payments.map((p) => p.type))].sort();
  const totalAmount = filtered.reduce((s, p) => s + Number(p.amount), 0);
  const paidAmount = filtered.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const pendingAmount = filtered.filter((p) => p.status === "pending" || p.status === "overdue" || p.status === "confirming").reduce((s, p) => s + Number(p.amount), 0);

  const SortIcon = ({ field }: { field: SortKey }) => {
    if (sortKey !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-[var(--color-primary)] ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-dark)] mb-1">결제 내역</h2>
            <p className="text-[var(--color-gray)] text-sm">
              총 {filtered.length}건 · {fmt(totalAmount)}
              {paidAmount > 0 && <span className="text-emerald-600 ml-2">완료 {fmt(paidAmount)}</span>}
              {pendingAmount > 0 && <span className="text-amber-600 ml-2">미결제 {fmt(pendingAmount)}</span>}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="클라이언트명, 유형, 설명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
              >
                <option value="all">전체 상태</option>
                <option value="paid">완료</option>
                <option value="confirming">입금확인중</option>
                <option value="pending">대기</option>
                <option value="overdue">미납</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
              >
                <option value="all">전체 유형</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-gray)]">결제 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th
                      onClick={() => handleSort("client_name")}
                      className="text-left py-3 px-6 text-[var(--color-gray)] font-medium text-xs cursor-pointer hover:text-[var(--color-dark)] select-none"
                    >
                      클라이언트<SortIcon field="client_name" />
                    </th>
                    <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">유형</th>
                    <th className="text-left py-3 px-3 text-[var(--color-gray)] font-medium text-xs">설명</th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="text-right py-3 px-3 text-[var(--color-gray)] font-medium text-xs cursor-pointer hover:text-[var(--color-dark)] select-none"
                    >
                      금액<SortIcon field="amount" />
                    </th>
                    <th className="text-center py-3 px-3 text-[var(--color-gray)] font-medium text-xs">상태</th>
                    <th
                      onClick={() => handleSort("payment_date")}
                      className="text-right py-3 px-6 text-[var(--color-gray)] font-medium text-xs cursor-pointer hover:text-[var(--color-dark)] select-none"
                    >
                      결제일<SortIcon field="payment_date" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const si = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
                    const isPast = p.payment_date && p.payment_date < today && p.status !== "paid";
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6">
                          <Link
                            href={`/admin/clients/${p.client_id}`}
                            className="text-[var(--color-dark)] font-medium no-underline hover:text-[var(--color-primary)] transition-colors"
                          >
                            {p.client_name}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-[var(--color-dark-2)]">{p.type}</td>
                        <td className="py-3 px-3 text-[var(--color-gray)]">{p.description || "-"}</td>
                        <td className="py-3 px-3 text-[var(--color-dark)] font-semibold text-right tabular-nums">{fmt(p.amount)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${si.cls}`}>{si.label}</span>
                        </td>
                        <td className={`py-3 px-6 text-right tabular-nums ${isPast ? "text-red-500 font-medium" : "text-[var(--color-gray)]"}`}>
                          {p.payment_date || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
