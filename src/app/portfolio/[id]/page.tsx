import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPortfolioItem, getPortfolioItemBySeq, getPortfolioItems, PortfolioItem } from "@/lib/portfolio";
import PortfolioDetailClient from "./PortfolioDetailClient";

const SITE_URL = "https://hsweb.pics";

export const revalidate = 300;

/** 숫자면 순번으로, UUID면 예전 주소로 본다. */
async function resolveItem(param: string): Promise<{ item: PortfolioItem | null; legacy: boolean }> {
  if (/^\d+$/.test(param)) {
    return { item: await getPortfolioItemBySeq(Number(param)), legacy: false };
  }
  return { item: await getPortfolioItem(param), legacy: true };
}

export async function generateStaticParams() {
  try {
    const items = await getPortfolioItems();
    return items.filter((i) => i.seq > 0).map((i) => ({ id: String(i.seq) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { item, legacy } = await resolveItem(id);

  if (!item) {
    return { title: "프로젝트를 찾을 수 없습니다", robots: { index: false, follow: false } };
  }
  // 예전 UUID 주소는 숫자 주소로 넘기므로 색인하지 않는다.
  if (legacy) {
    return { title: item.title, robots: { index: false, follow: true } };
  }

  const url = `${SITE_URL}/portfolio/${item.seq}`;
  const description =
    item.description ||
    `${item.client ? item.client + " · " : ""}${item.category || "홈페이지"} 제작 사례. 기획부터 디자인, 개발, 배포까지 HS WEB이 직접 진행했습니다.`;
  const title = `${item.title} | ${item.category || "홈페이지 제작"} 제작 사례`;

  return {
    title,
    description,
    keywords: [
      item.title,
      item.category,
      item.client,
      "홈페이지 제작 사례",
      "웹사이트 제작",
      "포트폴리오",
      ...(item.tags ?? []),
      "HS WEB",
    ].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${item.title} | HS WEB 포트폴리오`,
      description,
      url,
      siteName: "HS WEB",
      locale: "ko_KR",
      images: item.thumbnail
        ? [{ url: item.thumbnail, alt: item.title }]
        : [{ url: "/opengraph-image", width: 1200, height: 630, alt: "HS WEB 포트폴리오" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | HS WEB`,
      description,
      images: item.thumbnail ? [item.thumbnail] : ["/opengraph-image"],
    },
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { item, legacy } = await resolveItem(id);
  if (!item) notFound();
  if (legacy && item.seq > 0) permanentRedirect(`/portfolio/${item.seq}`);

  const allItems = await getPortfolioItems();
  const sorted = [...allItems].sort((a, b) => a.seq - b.seq);
  const currentIndex = sorted.findIndex((i) => i.id === item.id);
  const prevItem = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  const url = `${SITE_URL}/portfolio/${item.seq}`;
  const description = item.description || `${item.title} 제작 사례`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: item.title,
        headline: item.title,
        description,
        url,
        image: item.thumbnail || undefined,
        inLanguage: "ko-KR",
        genre: item.category || undefined,
        creator: { "@type": "Organization", name: "HS WEB", url: SITE_URL },
        provider: { "@type": "Organization", name: "HS WEB", url: SITE_URL },
        dateCreated: item.createdAt || undefined,
        dateModified: item.updatedAt || undefined,
        keywords: item.tags?.join(", ") || item.category || undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "포트폴리오", item: `${SITE_URL}/portfolio` },
          { "@type": "ListItem", position: 3, name: item.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioDetailClient
        item={item}
        prevItem={prevItem ? { seq: prevItem.seq, title: prevItem.title, thumbnail: prevItem.thumbnail, category: prevItem.category } : null}
        nextItem={nextItem ? { seq: nextItem.seq, title: nextItem.title, thumbnail: nextItem.thumbnail, category: nextItem.category } : null}
      />
    </>
  );
}
