import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "가격 안내 | HS WEB - 웹사이트 제작 전문",
  description:
    "프로젝트 규모와 요구사항에 맞는 합리적인 가격을 제안합니다. Basic, Professional, Enterprise 패키지.",
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
