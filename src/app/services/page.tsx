import type { Metadata } from "next";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "서비스 안내 - 홈페이지 제작, 쇼핑몰 구축, 랜딩페이지",
  description:
    "HS WEB이 제공하는 홈페이지 제작 서비스를 확인하세요. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션, CMS, 기술 마케팅까지 원스톱 솔루션을 제공합니다.",
  keywords: [
    "홈페이지 제작 서비스",
    "웹사이트 제작 서비스",
    "쇼핑몰 구축",
    "랜딩페이지 제작",
    "웹 개발 서비스",
  ],
  alternates: { canonical: "https://hsweb.pics/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Services />
      <TechStack />
      <CTA />
    </>
  );
}
