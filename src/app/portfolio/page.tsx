import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "포트폴리오 | HS WEB - 웹사이트 제작 전문",
  description:
    "다양한 산업군의 클라이언트와 함께한 프로젝트들을 소개합니다. 카페, 쇼핑몰, 클리닉, SaaS 등.",
};

export default function PortfolioPage() {
  return <Portfolio />;
}
