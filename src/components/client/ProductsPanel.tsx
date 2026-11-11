"use client";

import { useEffect, useRef, useState } from "react";
import type { Product, ProductRequest } from "@/lib/types/product";
import { REQUEST_STATUS_LABEL } from "@/lib/types/product";
import {
  groupProducts,
  shortestWorkDays,
  splitProductName,
  startingPrice,
} from "@/lib/product-groups";
import { PortalLoading } from "@/components/client/PortalState";
import PortalIllustration from "@/components/client/PortalIllustration";
import { PlanCard, PlanRow, priceText } from "@/components/client/PlanCards";

/** 신청 상태. 칠하기 규칙은 portal.css 의 세 단계를 따른다. */
const STATUS_STYLE: Record<string, string> = {
  new: "markActive",
  contacted: "markActive",
  done: "markDone",
  cancelled: "markDone opacity-60",
};

/** 신청한 뒤의 순서. 둘째와 넷째는 「내 신청」의 상태 이름과 같다. */
const STEPS = [
  { title: "신청", desc: "패키지를 고르고 하실 말씀을 남겨 주세요." },
  {
    title: "연락",
    desc: `확인하고 연락드립니다. 내 신청이 「${REQUEST_STATUS_LABEL.contacted}」으로 바뀝니다.`,
  },
  { title: "작업", desc: "범위와 일정을 정한 뒤 작업을 시작합니다." },
  {
    title: "완료",
    desc: `결과물을 확인하고 마무리합니다. 내 신청이 「${REQUEST_STATUS_LABEL.done}」로 바뀝니다.`,
  },
];

/**
 * 화면의 덩어리. 패키지로 나눈 서비스는 서비스마다 한 덩어리이고,
 * 패키지가 아닌 상품은 분류마다 한 덩어리로 모은다. 순서는 상품의 정렬 순서를 따른다.
 */
type Block =
  | { kind: "packages"; key: string; title: string; items: Product[] }
  | { kind: "singles"; key: string; title: string; items: Product[] };

function toBlocks(products: Product[]): Block[] {
  const blocks: Block[] = [];
  const byCategory = new Map<string, Block>();
  for (const group of groupProducts(products)) {
    if (group.items.length > 1) {
      blocks.push({
        kind: "packages",
        key: group.key,
        title: group.service,
        items: group.items,
      });
      continue;
    }
    const product = group.items[0];
    let block = byCategory.get(product.category);
    if (!block) {
      block = {
        kind: "singles",
        key: `category:${product.category}`,
        title: product.category,
        items: [],
      };
      byCategory.set(product.category, block);
      blocks.push(block);
    }
    block.items.push(product);
  }
  return blocks;
}

function SectionHead({
  title,
  aside,
}: {
  title: string;
  aside?: string | null;
}) {
  return (
    <div className="portal-product-section-head">
      <h3>{title}</h3>
      {aside && <p>{aside}</p>}
    </div>
  );
}

/** Browse service packages and submit a request without leaving the customer app. */
export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  // 방금 신청한 상품과 알림. 그 상품이 있는 덩어리 바로 아래에 띄운다.
  const [sent, setSent] = useState<{ productId: string; text: string } | null>(
    null,
  );
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/client-auth/products").then((r) => r.json()),
      fetch("/api/client-auth/product-requests").then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setProducts(a.products ?? []);
        setRequests(b.requests ?? []);
      })
      .catch(() =>
        setLoadError("상품을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요."),
      )
      .finally(() => setLoading(false));
  }, []);

  // 신청 칸은 카드 줄 아래에 열린다. 카드 단추를 누른 자리에서 안 보일 수 있어 그쪽으로 데려간다.
  useEffect(() => {
    if (!openId) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({
      block: "nearest",
      behavior: still ? "auto" : "smooth",
    });
  }, [openId]);

  const pendingIds = new Set(
    requests
      .filter((r) => r.status === "new" || r.status === "contacted")
      .map((r) => r.product_id),
  );

  const openForm = (product: Product) => {
    setOpenId(product.id);
    setMessage("");
    setSendError("");
    setSent(null);
  };

  const closeForm = () => {
    setOpenId(null);
    setMessage("");
    setSendError("");
  };

  const submit = async (product: Product) => {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/client-auth/product-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.error || "신청에 실패했습니다.");
        return;
      }
      setRequests((prev) => [data.request, ...prev]);
      closeForm();
      setSent({
        productId: product.id,
        text: `「${product.name}」 신청이 접수됐습니다. 곧 연락드리겠습니다.`,
      });
    } catch {
      setSendError("신청 중 문제가 생겼습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <PortalLoading compact />;

  const blocks = toBlocks(products);
  const from = startingPrice(products);
  const days = shortestWorkDays(products);
  const stats = [
    from != null
      ? { label: "최저가", value: from.toLocaleString("ko-KR"), suffix: "원~" }
      : null,
    days != null
      ? { label: "최단 작업", value: String(days), suffix: "일" }
      : null,
    blocks.length > 0
      ? {
          label: "서비스",
          value: String(groupProducts(products).length),
          suffix: "종",
        }
      : null,
  ].filter(
    (s): s is { label: string; value: string; suffix: string } => s != null,
  );

  /** 카드 줄 아래 신청 칸. 어느 상품으로 신청하는지 이름과 값을 다시 보여준다. */
  const requestForm = (product: Product) => (
    <div
      ref={formRef}
      className="mt-3 scroll-mb-28 rounded-[16px] border-2 border-[var(--p-brand)] bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.04em] text-[var(--p-sub)]">
            신청할 상품
          </p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-[var(--p-ink)]">
            {product.name}
          </p>
        </div>
        <p className="tnum shrink-0 text-[15px] font-extrabold text-[var(--p-ink)]">
          {priceText(product)}
        </p>
      </div>
      <label
        htmlFor={`msg-${product.id}`}
        className="mt-4 block text-xs font-medium text-[var(--p-ink-2)]"
      >
        하실 말씀 (안 적어도 됩니다)
      </label>
      <textarea
        id={`msg-${product.id}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="예: 다음 달에 시작하고 싶어요"
        className="mt-2 w-full rounded-xl border border-[var(--p-line)] bg-[var(--p-bg-sunk)] px-3.5 py-2.5 text-sm text-[var(--p-ink)] focus:border-[var(--p-brand)] focus:outline-none"
      />
      {sendError && (
        <p
          role="alert"
          className="mt-2 text-[12.5px] font-semibold text-[var(--p-ink)]"
        >
          {sendError}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => submit(product)}
          disabled={sending}
          className="pressWide min-h-[46px] flex-1 cursor-pointer rounded-[10px] border-none bg-[var(--p-brand)] text-sm font-bold text-white disabled:opacity-50"
        >
          {sending ? "보내는 중..." : "신청 보내기"}
        </button>
        <button
          type="button"
          onClick={closeForm}
          className="min-h-[46px] cursor-pointer rounded-[10px] border border-[var(--p-line)] bg-[var(--p-bg-sunk)] px-4 text-sm font-medium text-[var(--p-sub)]"
        >
          취소
        </button>
      </div>
    </div>
  );

  const sentNotice = (text: string) => (
    <div
      role="status"
      className="mt-3 flex items-start gap-2.5 rounded-[14px] border border-[var(--p-brand)] bg-[var(--p-brand-tint)] px-4 py-3.5 text-[13.5px] leading-[1.55] text-[var(--p-brand)]"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      {text}
    </div>
  );

  return (
    <div className="portal-products">
      <header className="portal-products-hero">
        <div>
          <span className="portal-eyebrow">GROW WITH HAON</span>
          <h2>
            다음 시작도,
            <br />
            하온과 함께해요.
          </h2>
          <p>필요한 서비스를 고르면 담당자가 자세히 안내해 드려요.</p>
          {stats.length > 0 && (
            <dl className="portal-product-stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    {stat.value}
                    <span>{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <PortalIllustration kind="services" />
      </header>

      {loadError && (
        <div
          role="status"
          className="rounded-xl border border-[var(--p-line)] bg-white px-4 py-3 text-sm text-[var(--p-ink)]"
        >
          {loadError}
        </div>
      )}

      {requests.length > 0 && (
        <section>
          <SectionHead title="내 신청" aside={`${requests.length}건`} />
          <div className="divide-y divide-[var(--p-line)] rounded-[16px] border border-[var(--p-line)] bg-white">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--p-ink)]">
                    {r.product_name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--p-sub)]">
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    {r.message ? ` · ${r.message}` : ""}
                  </p>
                </div>
                <span
                  className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[11px] font-bold ${
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

      {blocks.length === 0
        ? !loadError && (
            <div className="py-16 text-center text-sm text-[var(--p-sub)]">
              준비된 상품이 아직 없습니다.
            </div>
          )
        : blocks.map((block) => {
            const isPackages = block.kind === "packages";
            const lowest = isPackages ? startingPrice(block.items) : null;
            const formProduct = block.items.find((item) => item.id === openId);
            const notice =
              sent && block.items.some((item) => item.id === sent.productId)
                ? sent.text
                : null;
            return (
              <section key={block.key}>
                <SectionHead
                  title={block.title}
                  aside={
                    lowest != null
                      ? `${lowest.toLocaleString("ko-KR")}원부터`
                      : null
                  }
                />
                <PlanRow
                  ariaLabel={
                    isPackages ? `${block.title} 패키지` : `${block.title} 상품`
                  }
                  labels={
                    isPackages
                      ? block.items.map(
                          (item) =>
                            splitProductName(item.name).tier ?? item.name,
                        )
                      : undefined
                  }
                >
                  {block.items.map((item, i) => {
                    const tier = splitProductName(item.name).tier;
                    return (
                      <PlanCard
                        key={item.id}
                        product={item}
                        overline={isPackages && tier ? tier : undefined}
                        title={
                          isPackages
                            ? item.tagline || tier || item.name
                            : item.name
                        }
                        lead={isPackages ? null : item.tagline}
                        featured={
                          isPackages && block.items.length === 3 && i === 1
                        }
                        pending={pendingIds.has(item.id)}
                        open={openId === item.id}
                        onRequest={() =>
                          openId === item.id
                            ? formRef.current?.scrollIntoView({
                                block: "nearest",
                              })
                            : openForm(item)
                        }
                      />
                    );
                  })}
                </PlanRow>
                {formProduct && requestForm(formProduct)}
                {notice && sentNotice(notice)}
              </section>
            );
          })}

      {blocks.length > 0 && (
        <section>
          <SectionHead title="신청하면 이렇게 진행돼요" />
          <ol className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-[14px] border border-[var(--p-line)] bg-white p-5"
              >
                <p className="tnum text-[12px] font-bold tracking-[0.12em] text-[var(--p-brand)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[15px] font-bold text-[var(--p-ink)]">
                  {step.title}
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.6] text-[var(--p-sub)]">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
