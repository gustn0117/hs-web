import type { Metadata } from "next";
import Process from "@/components/Process";

export const metadata: Metadata = {
  title: "제작 과정 | HS WEB - 웹사이트 제작 전문",
  description:
    "상담 & 기획부터 디자인, 개발, 런칭까지 체계적인 프로세스로 최상의 결과물을 만들어냅니다.",
};

export default function ProcessPage() {
  return <Process />;
}
