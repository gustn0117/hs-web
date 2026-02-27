import type { Metadata } from "next";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "홈페이지 제작 과정 - 상담부터 런칭까지 체계적 프로세스",
  description:
    "HS WEB의 홈페이지 제작 과정을 확인하세요. 상담 & 기획, UI/UX 디자인, 프론트엔드 개발, 테스트, 런칭까지 체계적인 프로세스로 최상의 결과물을 만들어냅니다.",
  keywords: ["홈페이지 제작 과정", "홈페이지 제작 절차", "웹사이트 개발 프로세스", "홈페이지 제작 기간"],
  alternates: { canonical: "https://hsweb.pics/process" },
};

export default function ProcessPage() {
  return (
    <div className="pt-[72px]">
      <Process />
      <FAQ />
      <CTA />
    </div>
  );
}
