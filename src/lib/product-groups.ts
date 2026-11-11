import type { Product } from "@/lib/types/product";

/** 패키지 이름. 크몽과 같은 세 단계다. */
export const PACKAGE_TIERS = ["STANDARD", "DELUXE", "PREMIUM"] as const;

/**
 * 「홈페이지 제작 · STANDARD」처럼 이름이 「서비스 · 패키지」면 앞은 서비스 이름, 뒤는 패키지 이름이다.
 * 크몽처럼 한 서비스를 여러 패키지로 나눠 팔 때 쓴다. 패키지 하나가 상품 하나라서 신청 기록에도
 * 어느 패키지를 골랐는지 이름째 남는다. 「호스팅 · 도메인 관리」처럼 뒤가 패키지 이름이 아니면 그냥 상품이다.
 */
export function splitProductName(name: string): { service: string; tier: string | null } {
  const at = name.lastIndexOf(" · ");
  const tier = at < 0 ? "" : name.slice(at + 3);
  if (!(PACKAGE_TIERS as readonly string[]).includes(tier)) return { service: name, tier: null };
  return { service: name.slice(0, at), tier };
}

export interface ProductGroup {
  key: string;
  service: string;
  items: Product[];
}

/**
 * 같은 서비스의 패키지를 한 묶음으로 모은다. 묶음의 순서와 묶음 안의 순서는 들어온 순서(정렬 순서)를 따른다.
 * 패키지 이름이 없는 상품은 혼자 한 묶음이다.
 */
export function groupProducts(products: Product[]): ProductGroup[] {
  const groups: ProductGroup[] = [];
  const byService = new Map<string, ProductGroup>();

  for (const product of products) {
    const { service, tier } = splitProductName(product.name);
    if (!tier) {
      groups.push({ key: product.id, service: product.name, items: [product] });
      continue;
    }
    let group = byService.get(service);
    if (!group) {
      group = { key: `service:${service}`, service, items: [] };
      byService.set(service, group);
      groups.push(group);
    }
    group.items.push(product);
  }

  return groups;
}

/** 패키지 가운데 가장 싼 값. 값이 정해진 패키지가 없으면 null이다. */
export function startingPrice(items: Product[]): number | null {
  const prices = items.map((item) => item.price).filter((price): price is number => price != null && price > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export interface FeatureRow {
  label: string;
  value: string;
}

/**
 * 포함 내역 한 줄이 「작업 기간: 3일」처럼 「이름: 값」이면 표의 한 줄로 쓴다.
 * 그 밖의 줄(「맞춤 디자인」)은 체크 목록이다.
 */
export function splitFeature(feature: string): FeatureRow | null {
  const match = /^\s*([^:：]{1,12}?)\s*[:：]\s*(.+?)\s*$/.exec(feature);
  return match ? { label: match[1], value: match[2] } : null;
}

/** 포함 내역을 표로 쓸 줄과 체크 목록으로 나눈다. 순서는 적은 순서 그대로다. */
export function splitFeatures(features: string[]): { rows: FeatureRow[]; checks: string[] } {
  const rows: FeatureRow[] = [];
  const checks: string[] = [];
  for (const feature of features) {
    const row = splitFeature(feature);
    if (row) rows.push(row);
    else checks.push(feature);
  }
  return { rows, checks };
}

/** 「작업 기간: 3일」에서 가장 짧은 날 수. 그런 줄이 없으면 null이다. */
export function shortestWorkDays(products: Product[]): number | null {
  const days = products.flatMap((product) =>
    splitFeatures(product.features)
      .rows.filter((row) => row.label.replace(/\s/g, "") === "작업기간")
      .map((row) => Number(/(\d+)\s*일/.exec(row.value)?.[1]))
      .filter((n) => Number.isFinite(n) && n > 0)
  );
  return days.length > 0 ? Math.min(...days) : null;
}
