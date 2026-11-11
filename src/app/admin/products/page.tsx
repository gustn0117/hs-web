"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";
import { PRODUCT_CATEGORIES, REQUEST_STATUS_LABEL } from "@/lib/types/product";
import type { Product, ProductRequestStatus } from "@/lib/types/product";

interface AdminRequest {
  id: string;
  product_name: string;
  message: string | null;
  status: ProductRequestStatus;
  created_at: string;
  client_name: string;
  client_phone: string | null;
}

type Draft = {
  name: string;
  tagline: string;
  description: string;
  price: string;
  price_note: string;
  category: string;
  features: string;
  is_active: boolean;
  sort_order: string;
};

const EMPTY: Draft = {
  name: "",
  tagline: "",
  description: "",
  price: "",
  price_note: "",
  category: "제작",
  features: "",
  is_active: true,
  sort_order: "100",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)]";
const labelClass = "block text-xs font-medium text-[var(--color-dark-2)] mb-1.5";

function toDraft(p: Product): Draft {
  return {
    name: p.name,
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    price: p.price == null ? "" : String(p.price),
    price_note: p.price_note ?? "",
    category: p.category,
    features: p.features.join("\n"),
    is_active: p.is_active,
    sort_order: String(p.sort_order),
  };
}

function toBody(d: Draft) {
  return {
    name: d.name,
    tagline: d.tagline,
    description: d.description,
    price: d.price.trim() === "" ? null : Number(d.price),
    price_note: d.price_note,
    category: d.category,
    features: d.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    is_active: d.is_active,
    sort_order: Number(d.sort_order) || 100,
  };
}

export default function AdminProductsPage() {
  const [tab, setTab] = useState<"products" | "requests">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/product-requests").then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setProducts(a.products ?? []);
        setRequests(b.requests ?? []);
      })
      .catch(() => setError("불러오지 못했습니다."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    if (!draft.name.trim()) {
      setError("상품 이름을 적어주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const isNew = editing === "new";
      const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${editing}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toBody(draft)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "저장에 실패했습니다.");
        return;
      }
      setProducts((prev) =>
        isNew
          ? [...prev, data.product].sort((a, b) => a.sort_order - b.sort_order)
          : prev.map((p) => (p.id === data.product.id ? data.product : p))
      );
      setEditing(null);
      setDraft(EMPTY);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: Product) => {
    if (!confirm(`"${product.name}"을(를) 지우시겠습니까?\n고객센터에서 바로 사라집니다.`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제에 실패했습니다.");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const toggle = async (product: Product) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "변경에 실패했습니다.");
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
  };

  const setStatus = async (request: AdminRequest, status: ProductRequestStatus) => {
    const res = await fetch(`/api/admin/product-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      alert("변경에 실패했습니다.");
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status } : r)));
  };

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <AdminHeader />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <Link
          href="/admin/dashboard"
          className="text-sm text-[var(--color-gray)] hover:text-[var(--color-dark)] no-underline"
        >
          ← 대시보드로
        </Link>

        <div className="mt-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-dark)]">상품</h1>
          <p className="mt-1 text-sm text-[var(--color-gray)]">
            여기서 켜 둔 상품이 고객센터에 그대로 보입니다.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {([
            ["products", `상품 ${products.length}`],
            ["requests", newCount > 0 ? `신청 ${newCount}건 대기` : `신청 ${requests.length}`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 bg-transparent cursor-pointer transition-colors ${
                tab === key
                  ? "border-[var(--color-accent)] text-[var(--color-dark)]"
                  : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-dark)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-[var(--color-gray)]">불러오는 중...</p>
        ) : tab === "products" ? (
          <div className="space-y-4">
            {editing === null && (
              <button
                type="button"
                onClick={() => {
                  setEditing("new");
                  setDraft(EMPTY);
                  setError("");
                }}
                className="w-full min-h-[48px] bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90"
              >
                상품 추가
              </button>
            )}

            {editing !== null && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
                <h2 className="text-sm font-semibold text-[var(--color-dark)]">
                  {editing === "new" ? "새 상품" : "상품 수정"}
                </h2>

                <div>
                  <label className={labelClass}>이름</label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="기업 홈페이지 Basic"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-gray)] leading-relaxed">
                    「홈페이지 제작 · STANDARD」처럼 뒤에 「 · STANDARD / DELUXE / PREMIUM」을 붙이면 고객센터에서 한 서비스의 패키지로 묶여 나란히 보입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>한 줄 설명</label>
                    <input
                      value={draft.tagline}
                      onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                      placeholder="개인사업자·스타트업"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>분류</label>
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className={inputClass}
                    >
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>자세한 설명</label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>가격</label>
                    <input
                      value={draft.price}
                      onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                      placeholder="비워두면 상담"
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>가격 뒤에 붙는 말</label>
                    <input
                      value={draft.price_note}
                      onChange={(e) => setDraft({ ...draft, price_note: e.target.value })}
                      placeholder="원~ / 상담 후 안내"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>순서 (작을수록 위)</label>
                    <input
                      value={draft.sort_order}
                      onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>포함 내역 (한 줄에 하나)</label>
                  <textarea
                    value={draft.features}
                    onChange={(e) => setDraft({ ...draft, features: e.target.value })}
                    rows={5}
                    placeholder={"작업 기간: 3일\n반응형 웹 디자인 (5P)\n메타 태그 · sitemap 기본"}
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-gray)] leading-relaxed">
                    「작업 기간: 3일」처럼 「이름: 값」으로 쓴 줄은 카드에 표로, 나머지 줄은 체크 목록으로 나옵니다.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm text-[var(--color-dark-2)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  고객센터에 보이기
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="flex-1 min-h-[44px] bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setDraft(EMPTY);
                      setError("");
                    }}
                    className="min-h-[44px] px-5 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[var(--color-dark)] truncate">{product.name}</p>
                    <span className="shrink-0 inline-flex items-center h-5 px-2 rounded-full bg-gray-100 text-[11px] font-semibold text-[var(--color-gray)]">
                      {product.category}
                    </span>
                    {!product.is_active && (
                      <span className="shrink-0 inline-flex items-center h-5 px-2 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">
                        숨김
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-gray)] truncate">
                    {product.price == null
                      ? product.price_note || "상담"
                      : `${Number(product.price).toLocaleString("ko-KR")}${product.price_note || "원"}`}
                    {product.tagline ? ` · ${product.tagline}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(product)}
                  className="shrink-0 min-h-[40px] px-3 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-xl text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  {product.is_active ? "숨기기" : "보이기"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(product.id);
                    setDraft(toDraft(product));
                    setError("");
                  }}
                  className="shrink-0 min-h-[40px] px-3 bg-gray-50 border border-gray-200 text-[var(--color-dark)] rounded-xl text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => remove(product)}
                  className="shrink-0 min-h-[40px] px-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold cursor-pointer hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="py-16 text-center text-sm text-[var(--color-gray)]">아직 신청이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--color-dark)]">{request.product_name}</p>
                    <p className="mt-1 text-xs text-[var(--color-gray)]">
                      {request.client_name}
                      {request.client_phone ? ` · ${request.client_phone}` : ""} ·{" "}
                      {new Date(request.created_at).toLocaleString("ko-KR")}
                    </p>
                    {request.message && (
                      <p className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-[13px] text-[var(--color-dark-2)]">
                        {request.message}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center h-6 px-2.5 rounded-full border text-[11px] font-bold ${
                      STATUS_STYLE[request.status]
                    }`}
                  >
                    {REQUEST_STATUS_LABEL[request.status]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(["new", "contacted", "done", "cancelled"] as ProductRequestStatus[])
                    .filter((s) => s !== request.status)
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(request, s)}
                        className="min-h-[36px] px-3 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-100"
                      >
                        {REQUEST_STATUS_LABEL[s]}으로
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
