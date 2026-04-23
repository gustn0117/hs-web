import type { Metadata } from "next";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "고객 후기 - 홈페이지 제작 만족도 후기",
  description:
    "HS WEB에서 홈페이지를 제작한 고객님들의 생생한 후기를 확인하세요.",
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "웹에이전시 후기", "HS WEB 후기"],
  alternates: { canonical: "https://hsweb.pics/testimonials" },
};

const reviews = [
  {
    id: "001",
    industry: "외식업",
    client: "○○ 카페",
    rating: 5,
    date: "2026.03",
    title: "초보 사장한테도 친절하게, 완성도 높게 만들어주셨어요",
    content: "홈페이지 제작이 처음이라 많이 부담스러웠는데, 매번 상세히 설명해주시고 요구사항 반영도 빠르셨습니다. 오픈 후 매장 문의가 눈에 띄게 늘었어요.",
  },
  {
    id: "002",
    industry: "교육",
    client: "○○ 학원",
    rating: 5,
    date: "2026.02",
    title: "관리자 페이지까지 포함된 풀 패키지, 매우 만족",
    content: "학원 수업 관리와 상담 신청 기능까지 모두 구현해주셔서 운영이 편해졌습니다. 디자인도 깔끔하고 모바일에서도 잘 보입니다.",
  },
  {
    id: "003",
    industry: "제조업",
    client: "○○ 테크",
    rating: 5,
    date: "2026.01",
    title: "기업 홈페이지에 적합한 고급스러운 디자인",
    content: "B2B 영업용 홈페이지가 필요했는데, 전문적이면서도 신뢰감 있게 잘 만들어주셨습니다. 제품 카탈로그도 잘 정리됐어요.",
  },
  {
    id: "004",
    industry: "서비스업",
    client: "○○ 스튜디오",
    rating: 5,
    date: "2025.12",
    title: "브랜드 컬러와 톤이 잘 반영된 포트폴리오 사이트",
    content: "저희 브랜드 톤을 잘 이해하시고 디자인에 녹여주셨어요. 포트폴리오 보는 고객들 반응이 좋습니다.",
  },
  {
    id: "005",
    industry: "쇼핑몰",
    client: "○○ 몰",
    rating: 5,
    date: "2025.11",
    title: "결제 연동까지 매끄럽게, 사후 관리도 꼼꼼",
    content: "PG 연동이 복잡한데 문제 없이 마무리해주셨고, 오픈 후 잔 이슈까지 빠르게 대응해주셨습니다.",
  },
];

export default function TestimonialsPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "고객 후기" }]}
      overline="TESTIMONIALS"
      title="실제 클라이언트 후기."
      subtitle={`${reviews.length}건의 실제 프로젝트 후기. 평균 만족도 4.9/5.0`}
      stats={[
        { label: "총 후기", value: String(reviews.length), suffix: "건" },
        { label: "평균 만족도", value: "4.9", suffix: "/ 5.0" },
        { label: "재의뢰율", value: "95", suffix: "%" },
        { label: "추천 의향", value: "98", suffix: "%" },
      ]}
    >
      <Section overline="REVIEWS" title="전체 후기">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-6 md:p-7 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-chip p-chip-point">{r.industry}</span>
                  <span className="text-[12px] text-[var(--c-sub)] tnum">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[var(--c-event)]">
                  {"★★★★★".split("").slice(0, r.rating).map((s, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <h3 className="text-[16px] md:text-[17px] font-bold tracking-tight mb-2 text-[var(--c-text)] leading-[1.45]">
                {r.title}
              </h3>
              <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75] mb-4 flex-1">{r.content}</p>
              <div className="pt-4 border-t border-[var(--c-line)] text-[12px] text-[var(--c-sub)]">
                — {r.client}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
