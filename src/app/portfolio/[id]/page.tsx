import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/portfolio";
import PortfolioDetailClient from "./PortfolioDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getPortfolioItem(id);
  if (!item) return { title: "프로젝트를 찾을 수 없습니다" };
  return {
    title: `${item.title} | HS WEB 포트폴리오`,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getPortfolioItem(id);
  if (!item) notFound();

  const allItems = getPortfolioItems();
  const currentIndex = allItems.findIndex((i) => i.id === id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <PortfolioDetailClient
      item={item}
      prevItem={prevItem ? { id: prevItem.id, title: prevItem.title, thumbnail: prevItem.thumbnail, category: prevItem.category } : null}
      nextItem={nextItem ? { id: nextItem.id, title: nextItem.title, thumbnail: nextItem.thumbnail, category: nextItem.category } : null}
    />
  );
}
