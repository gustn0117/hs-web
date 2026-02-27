import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "홈페이지 제작 가격 안내 - 합리적인 맞춤 견적",
  description:
    "홈페이지 제작 비용이 궁금하신가요? HS WEB은 프로젝트 규모에 맞는 합리적인 가격을 제안합니다. Basic, Professional, Enterprise 패키지로 원하는 수준의 웹사이트를 제작하세요.",
  keywords: ["홈페이지 제작 비용", "홈페이지 제작 가격", "웹사이트 제작 비용", "쇼핑몰 제작 비용", "홈페이지 견적"],
  alternates: { canonical: "https://hsweb.pics/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
