import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "문의하기 | HS WEB - 웹사이트 제작 전문",
  description:
    "프로젝트에 대해 자유롭게 상담해주세요. 홈페이지 제작, 리뉴얼, 유지보수 등 24시간 내 답변드립니다.",
};

export default function ContactPage() {
  return <Contact />;
}
