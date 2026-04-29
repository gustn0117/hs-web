import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/portfolio";
import PortfolioDetailClient from "./PortfolioDetailClient";

const SITE_URL = "https://hsweb.pics";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) {
    return {
      title: "프로젝트를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/portfolio/${id}`;
  const description =
    item.description ||
    `${item.client ? item.client + " · " : ""}${item.category || "프로젝트"} 제작 사례. HS WEB이 직접 기획부터 개발까지 진행한 작업물입니다.`;
  const title = `${item.title} - ${item.category || "홈페이지 제작 사례"}`;

  return {
    title,
    description,
    keywords: [
      item.title,
      item.category,
      "홈페이지 제작 사례",
      "포트폴리오",
      "웹사이트 제작",
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
  const item = await getPortfolioItem(id);
  if (!item) notFound();

  const allItems = await getPortfolioItems();
  const currentIndex = allItems.findIndex((i) => i.id === id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  // JSON-LD: BreadcrumbList + CreativeWork (portfolio item)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: item.title,
        description: item.description || `${item.title} 제작 사례`,
        url: `${SITE_URL}/portfolio/${id}`,
        image: item.thumbnail || undefined,
        creator: { "@type": "Organization", name: "HS WEB", url: SITE_URL },
        dateCreated: item.createdAt || undefined,
        dateModified: item.updatedAt || undefined,
        keywords: item.tags?.join(", ") || item.category || undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "포트폴리오", item: `${SITE_URL}/portfolio` },
          { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}/portfolio/${id}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioDetailClient
        item={item}
        prevItem={prevItem ? { id: prevItem.id, title: prevItem.title, thumbnail: prevItem.thumbnail, category: prevItem.category } : null}
        nextItem={nextItem ? { id: nextItem.id, title: nextItem.title, thumbnail: nextItem.thumbnail, category: nextItem.category } : null}
      />
    </>
  );
}
