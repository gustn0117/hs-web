import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { getPortfolioItems } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "포트폴리오 - 홈페이지 제작 사례",
  description:
    "HS WEB이 제작한 홈페이지 포트폴리오를 확인하세요. 다양한 산업군의 클라이언트와 함께한 반응형 홈페이지, 쇼핑몰, 랜딩페이지 프로젝트를 소개합니다.",
  keywords: ["홈페이지 제작 포트폴리오", "웹사이트 제작 사례", "홈페이지 디자인 포트폴리오", "웹에이전시 포트폴리오"],
  alternates: { canonical: "https://hsweb.pics/portfolio" },
};

export default function PortfolioPage() {
  const items = getPortfolioItems();

  return (
    <>
      <Portfolio items={items} />
      <Testimonials />
      <CTA />
    </>
  );
}
