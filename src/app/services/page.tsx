import type { Metadata } from "next";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "서비스 | HS WEB - 웹사이트 제작 전문",
  description:
    "반응형 홈페이지, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션 등 다양한 웹 솔루션을 제공합니다.",
};

export default function ServicesPage() {
  return <Services />;
}
