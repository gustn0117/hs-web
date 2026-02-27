import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "무료 상담 · 문의하기 - 홈페이지 제작 견적 문의",
  description:
    "홈페이지 제작, 쇼핑몰 구축, 랜딩페이지 제작 무료 상담을 받아보세요. 프로젝트 규모에 맞는 맞춤 견적을 24시간 내 안내드립니다.",
  keywords: ["홈페이지 제작 문의", "홈페이지 제작 견적", "웹사이트 제작 상담", "홈페이지 제작 비용"],
  alternates: { canonical: "https://hsweb.pics/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
