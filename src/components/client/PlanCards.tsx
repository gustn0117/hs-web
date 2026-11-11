"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types/product";
import { splitFeatures } from "@/lib/product-groups";

/**
 * 고객센터 「상품」 탭의 카드. 회사 홈페이지의 가격 안내(/pricing) 카드와 같은 짜임이다.
 * 위의 작은 이름, 제목, 설명, 큰 금액, 점선, 표(「작업 기간: 3일」 같은 줄), 체크 목록, 신청 단추 순서다.
 */

/** 값 글자 한 줄. 상담 상품은 price_note(없으면 「상담 후 안내」), 0원은 「무료」다. */
export function priceText(p: Product) {
  if (p.price == null) return p.price_note || "상담 후 안내";
  if (p.price === 0) return p.price_note || "무료";
  return `${p.price.toLocaleString("ko-KR")}${p.price_note || "원"}`;
}

/** 카드의 큰 금액. 숫자는 크게, 뒤에 붙는 말(원, 원~)은 작게 쓴다. */
function priceParts(p: Product): { value: string; suffix: string; numeric: boolean } {
  if (p.price == null) return { value: p.price_note || "상담 후 안내", suffix: "", numeric: false };
  if (p.price === 0) return { value: p.price_note || "무료", suffix: "", numeric: false };
  return { value: p.price.toLocaleString("ko-KR"), suffix: p.price_note || "원", numeric: true };
}

const CHECK = "M4.5 12.75l6 6 9-13.5";

export function PlanCard({
  product,
  overline,
  title,
  lead,
  dark = false,
  pending,
  open,
  onRequest,
}: {
  product: Product;
  /** 맨 위 작은 이름(STANDARD 같은 패키지 이름). 없으면 제목부터 시작한다. */
  overline?: string;
  title: string;
  /** 제목 아래 한 줄. 단독 상품의 한 줄 설명을 여기 둔다. */
  lead?: string | null;
  /** 가운데 패키지. 하온 남색으로 칠해 줄의 가운데가 비어 보이지 않게 한다. */
  dark?: boolean;
  /** 이미 신청해서 처리를 기다리는 중이다. */
  pending: boolean;
  /** 이 상품의 신청 칸이 열려 있다. */
  open: boolean;
  onRequest: () => void;
}) {
  const { rows, checks } = splitFeatures(product.features);
  const price = priceParts(product);
  const sub = dark ? "text-white/60" : "text-[var(--p-sub)]";

  return (
    <article
      aria-label={product.name}
      className={`row-span-5 grid grid-rows-subgrid rounded-[18px] border p-6 ${
        dark
          ? "border-[var(--p-brand)] bg-[var(--p-brand)] text-white"
          : "border-[var(--p-line)] bg-white text-[var(--p-ink)]"
      }`}
    >
      <div>
        {overline && <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] ${sub}`}>{overline}</p>}
        <h4 className="text-[19px] font-bold leading-snug tracking-[-0.02em]">{title}</h4>
        {lead && <p className={`mt-1 text-[13px] font-semibold ${dark ? "text-white/80" : "text-[var(--p-ink-2)]"}`}>{lead}</p>}
        {product.description && <p className={`mt-2 text-[13px] leading-[1.65] ${sub}`}>{product.description}</p>}
      </div>

      <div
        className={`mt-5 flex items-baseline gap-1 border-b border-dashed pb-5 ${
          dark ? "border-white/25" : "border-[var(--p-line-firm)]"
        }`}
      >
        <span
          className={`p-stat leading-none ${price.numeric ? "text-[36px]" : "text-[26px]"} ${dark ? "!text-white" : "!text-[var(--p-ink)]"}`}
        >
          {price.value}
        </span>
        {price.suffix && <span className={`text-[14px] font-semibold ${sub}`}>{price.suffix}</span>}
      </div>

      {/* 표와 체크 목록은 비어도 자리를 둔다. 카드마다 다섯 칸이어야 옆 카드와 줄이 맞는다. */}
      {rows.length === 0 ? (
        <div />
      ) : (
        <dl className="mt-5 space-y-2 text-[13px]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <dt className={sub}>{row.label}</dt>
              <dd className={`text-right font-semibold ${dark ? "text-white" : "text-[var(--p-ink)]"}`}>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {checks.length === 0 ? (
        <div />
      ) : (
        <ul className="m-0 mt-5 list-none space-y-2.5 p-0">
          {checks.map((check) => (
            <li
              key={check}
              className={`flex items-start gap-2 text-[13.5px] leading-[1.5] ${dark ? "text-white/85" : "text-[var(--p-ink-2)]"}`}
            >
              <svg
                className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-white" : "text-[var(--p-brand)]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={CHECK} />
              </svg>
              {check}
            </li>
          ))}
        </ul>
      )}

      <div className="self-end pt-7">
        <button
          type="button"
          onClick={onRequest}
          disabled={pending}
          aria-expanded={open}
          className={`pressWide h-12 w-full cursor-pointer rounded-[10px] border-none text-[14px] font-bold transition-colors disabled:cursor-default ${
            dark
              ? "bg-white text-[var(--p-brand)] disabled:bg-white/15 disabled:text-white/60"
              : "bg-[var(--p-brand)] text-white disabled:bg-[var(--p-fill)] disabled:text-[var(--p-sub)]"
          }`}
        >
          {pending ? "신청 접수됨" : "이거 해주세요"}
        </button>
      </div>
    </article>
  );
}

/**
 * 카드 줄. 좁은 화면에서는 옆으로 넘기고(다음 카드가 살짝 보인다), 넓은 화면에서는 세 칸에 나란히 놓는다.
 * 패키지 이름을 주면 위에 이름 단추가 생긴다. 누르면 그 카드로 넘어가고, 손으로 넘기면 단추가 따라온다.
 */
export function PlanRow({ labels, ariaLabel, children }: { labels?: string[]; ariaLabel: string; children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const cards = Children.toArray(children);

  /** 카드마다 그 카드가 맨 앞에 올 때의 스크롤 위치. 끝 카드는 더 넘길 수 없는 곳에서 멈춘다. */
  const stops = () => {
    const row = rowRef.current;
    if (!row) return [];
    const items = Array.from(row.children) as HTMLElement[];
    const first = items[0]?.offsetLeft ?? 0;
    const end = row.scrollWidth - row.clientWidth;
    return items.map((item) => Math.min(item.offsetLeft - first, end));
  };

  const follow = () => {
    const row = rowRef.current;
    if (!row) return;
    const list = stops();
    let nearest = 0;
    list.forEach((stop, i) => {
      if (Math.abs(stop - row.scrollLeft) < Math.abs(list[nearest] - row.scrollLeft)) nearest = i;
    });
    setIndex(nearest);
  };

  const go = (i: number) => {
    const row = rowRef.current;
    if (!row) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: stops()[i] ?? 0, behavior: still ? "auto" : "smooth" });
    setIndex(i);
  };

  return (
    <div>
      {labels && labels.length > 1 && (
        <div className="mb-3 flex gap-1.5 lg:hidden">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "true" : undefined}
              className={`h-8 cursor-pointer rounded-full border px-3.5 text-[11.5px] font-bold tracking-[0.06em] transition-colors ${
                i === index
                  ? "border-[var(--p-brand)] bg-[var(--p-brand)] text-white"
                  : "border-[var(--p-line)] bg-white text-[var(--p-sub)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 카드 안의 다섯 칸(머리 · 금액 · 표 · 체크 · 단추)을 줄 전체의 다섯 줄에 맞춘다(subgrid).
          그래서 설명 길이가 달라도 금액과 표가 옆 카드와 같은 높이에 온다. 체크 줄(1fr)이 남는 높이를 먹어
          단추는 늘 맨 아래에 나란히 선다. */}
      <div
        ref={rowRef}
        onScroll={follow}
        role="group"
        aria-label={ariaLabel}
        className={`snapRow -mx-4 grid snap-x snap-mandatory scroll-px-4 grid-flow-col grid-rows-[auto_auto_auto_1fr_auto] gap-x-3 gap-y-0 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3 lg:gap-x-4 lg:overflow-visible lg:px-0 ${
          cards.length > 1 ? "auto-cols-[82%] sm:auto-cols-[46%]" : "auto-cols-[100%]"
        }`}
      >
        {cards.map((card, i) => (
          <div key={i} className="row-span-5 grid snap-start grid-rows-subgrid">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
