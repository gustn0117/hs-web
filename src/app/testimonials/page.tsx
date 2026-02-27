import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "고객 후기 - 홈페이지 제작 만족도 후기",
  description:
    "HS WEB에서 홈페이지를 제작한 고객님들의 생생한 후기를 확인하세요. 높은 만족도와 신뢰를 바탕으로 한 실제 프로젝트 후기입니다.",
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "웹에이전시 후기", "HS WEB 후기"],
  alternates: { canonical: "https://hsweb.pics/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <Testimonials />
      <CTA />
    </>
  );
}
