"use client";

import { useEffect, useState } from "react";
import type { Product, ProductRequest } from "@/lib/types/product";
import { REQUEST_STATUS_LABEL } from "@/lib/types/product";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

function priceText(p: Product) {
  if (p.price == null) return p.price_note || "상담 후 안내";
  if (p.price === 0) return p.price_note || "무료";
  return `${p.price.toLocaleString("ko-KR")}${p.price_note || "원"}`;
}

/**
 * 하온이 하는 일을 보고 그 자리에서 신청하는 칸.
 *
 * 카톡으로 「이것도 해주실 수 있어요?」 하고 묻던 걸 여기서 받는다. 그래서
 * 신청한 뒤에 어떻게 되고 있는지(새 신청 · 연락함 · 완료)까지 같이 보여준다.
 */
export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/client-auth/products").then((r) => r.json()),
      fetch("/api/client-auth/product-requests").then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setProducts(a.products ?? []);
        setRequests(b.requests ?? []);
      })
      .catch(() => setNotice("상품을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요."))
      .finally(() => setLoading(false));
  }, []);

  const pendingIds = new Set(
    requests.filter((r) => r.status === "new" || r.status === "contacted").map((r) => r.product_id)
  );

  const submit = async (product: Product) => {
    setSending(true);
    setNotice("");
    try {
      const res = await fetch("/api/client-auth/product-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || "신청에 실패했습니다.");
        return;
      }
      setRequests((prev) => [data.request, ...prev]);
      setOpenId(null);
      setMessage("");
      setNotice(`「${product.name}」 신청이 접수됐습니다. 곧 연락드리겠습니다.`);
    } catch {
      setNotice("신청 중 문제가 생겼습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-[var(--color-gray)] text-sm">불러오는 중...</div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-8">
      {notice && (
        <div
          role="status"
          className="px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-sm"
        >
          {notice}
        </div>
      )}

      {requests.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">내 신청</h3>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-dark)] truncate">
                    {r.product_name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-gray)]">
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    {r.message ? ` · ${r.message}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center h-6 px-2.5 rounded-full border text-[11px] font-bold ${
                    STATUS_STYLE[r.status] || STATUS_STYLE.cancelled
                  }`}
                >
                  {REQUEST_STATUS_LABEL[r.status] ?? r.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {products.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-gray)] text-sm">
          준비된 상품이 아직 없습니다.
        </div>
      ) : (
        categories.map((category) => (
          <section key={category}>
            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">{category}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {products
                .filter((p) => p.category === category)
                .map((product) => {
                  const already = pendingIds.has(product.id);
                  const open = openId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[16px] font-bold text-[var(--color-dark)] leading-snug">
                            {product.name}
                          </p>
                          {product.tagline && (
                            <p className="mt-1 text-xs text-[var(--color-gray)]">{product.tagline}</p>
                          )}
                        </div>
                        <p className="shrink-0 text-[15px] font-extrabold text-[var(--color-dark)] whitespace-nowrap">
                          {priceText(product)}
                        </p>
                      </div>

                      {product.description && (
                        <p className="mt-3 text-[13.5px] text-[var(--color-gray)] leading-[1.7]">
                          {product.description}
                        </p>
                      )}

                      {product.features.length > 0 && (
                        <ul className="mt-4 space-y-1.5 list-none p-0 m-0">
                          {product.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2 text-[13px] text-[var(--color-dark-2)]"
                            >
                              <svg
                                className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      {open ? (
                        <div className="mt-4 space-y-2">
                          <label
                            htmlFor={`msg-${product.id}`}
                            className="block text-xs font-medium text-[var(--color-dark-2)]"
                          >
                            하실 말씀 (안 적어도 됩니다)
                          </label>
                          <textarea
                            id={`msg-${product.id}`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="예: 다음 달에 시작하고 싶어요"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)]"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => submit(product)}
                              disabled={sending}
                              className="flex-1 min-h-[44px] bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
                            >
                              {sending ? "보내는 중..." : "신청 보내기"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenId(null);
                                setMessage("");
                              }}
                              className="min-h-[44px] px-4 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenId(product.id);
                            setMessage("");
                            setNotice("");
                          }}
                          disabled={already}
                          className="mt-4 w-full min-h-[44px] rounded-xl text-sm font-semibold cursor-pointer transition-colors disabled:cursor-default bg-gray-50 border border-gray-200 text-[var(--color-dark)] hover:bg-gray-100 disabled:bg-gray-50 disabled:text-[var(--color-gray)]"
                        >
                          {already ? "신청 접수됨" : "이거 해주세요"}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
