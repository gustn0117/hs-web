import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "고객 후기 | HS WEB - 웹사이트 제작 전문",
  description:
    "HS WEB과 함께한 고객님들의 이야기를 들어보세요. 높은 만족도와 신뢰를 바탕으로 한 후기입니다.",
};

export default function TestimonialsPage() {
  return <Testimonials />;
}
