import type { Metadata } from "next";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "고객 후기 - 홈페이지 제작 만족도 후기",
  description:
    "HS WEB에서 홈페이지를 제작한 고객님들의 생생한 후기를 확인하세요. 높은 만족도와 신뢰를 바탕으로 한 실제 프로젝트 후기입니다.",
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
    content:
      "홈페이지 제작이 처음이라 많이 부담스러웠는데, 매번 상세히 설명해주시고 요구사항 반영도 빠르셨습니다. 오픈 후 매장 문의가 눈에 띄게 늘었어요.",
  },
  {
    id: "002",
    industry: "교육",
    client: "○○ 학원",
    rating: 5,
    date: "2026.02",
    title: "관리자 페이지까지 포함된 풀 패키지, 매우 만족",
    content:
      "학원 수업 관리와 상담 신청 기능까지 모두 구현해주셔서 운영이 편해졌습니다. 디자인도 깔끔하고 모바일에서도 잘 보입니다.",
  },
  {
    id: "003",
    industry: "제조업",
    client: "○○ 테크",
    rating: 5,
    date: "2026.01",
    title: "기업 홈페이지에 적합한 고급스러운 디자인",
    content:
      "B2B 영업용 홈페이지가 필요했는데, 전문적이면서도 신뢰감 있게 잘 만들어주셨습니다. 제품 카탈로그도 잘 정리됐어요.",
  },
  {
    id: "004",
    industry: "서비스업",
    client: "○○ 스튜디오",
    rating: 5,
    date: "2025.12",
    title: "브랜드 컬러와 톤이 잘 반영된 포트폴리오 사이트",
    content:
      "저희 브랜드 톤을 잘 이해하시고 디자인에 녹여주셨어요. 포트폴리오 보는 고객들 반응이 좋습니다.",
  },
  {
    id: "005",
    industry: "쇼핑몰",
    client: "○○ 몰",
    rating: 5,
    date: "2025.11",
    title: "결제 연동까지 매끄럽게, 사후 관리도 꼼꼼",
    content:
      "PG 연동이 복잡한데 문제 없이 마무리해주셨고, 오픈 후 잔 이슈까지 빠르게 대응해주셨습니다.",
  },
];

export default function TestimonialsPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "고객 후기" }]}
      title="고객 후기"
      caption={`${reviews.length}건의 실제 프로젝트 후기. 평균 만족도 4.9 / 5.0`}
      sidebar={<DefaultSidebar />}
    >
      <Section title="후기 요약">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { label: "총 후기", value: reviews.length, suffix: "건" },
            { label: "평균 만족도", value: "4.9", suffix: "/ 5.0" },
            { label: "재의뢰 의향", value: "95", suffix: "%" },
            { label: "추천 의향", value: "98", suffix: "%" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 py-3 ${i !== 3 ? "md:border-r" : ""} border-[var(--color-border)] ${i < 2 ? "border-b md:border-b-0" : ""}`}
            >
              <p className="text-[11px] text-[var(--color-muted)] mb-0.5">{stat.label}</p>
              <p className="text-[20px] font-bold text-[var(--color-text)] tnum">
                {stat.value}
                <span className="text-[12px] font-medium text-[var(--color-muted)] ml-1">{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`전체 후기 (${reviews.length})`}>
        <div>
          <div className="hidden md:grid grid-cols-[50px_80px_1fr_90px_100px_80px] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
            <span className="text-center">번호</span>
            <span>업종</span>
            <span>제목</span>
            <span className="text-center">만족도</span>
            <span className="text-right">날짜</span>
            <span className="text-center">상세</span>
          </div>
          {reviews.map((r) => (
            <details key={r.id} className="border-b border-[var(--color-border)] last:border-b-0">
              <summary className="md:grid md:grid-cols-[50px_80px_1fr_90px_100px_80px] flex items-center gap-3 px-4 py-2.5 text-[13px] cursor-pointer list-none hover:bg-[var(--color-bg-alt)]">
                <span className="hidden md:inline text-center text-[11px] text-[var(--color-muted)] tnum">{r.id}</span>
                <span className="hidden md:inline"><span className="p-chip">{r.industry}</span></span>
                <span className="font-semibold truncate flex-1 min-w-0">
                  {r.title}
                  <span className="ml-1 text-[11px] text-[var(--color-muted)]">— {r.client}</span>
                </span>
                <span className="hidden md:inline text-center text-[var(--color-point)] font-bold tnum">
                  {"★".repeat(r.rating)}
                </span>
                <span className="hidden md:inline text-right text-[11px] text-[var(--color-muted)] tnum">{r.date}</span>
                <span className="hidden md:inline text-center text-[12px] text-[var(--color-point)] font-semibold">펼치기 ↓</span>
              </summary>
              <div className="px-4 pb-3 pt-1 md:pl-[150px] text-[12px] text-[var(--color-text-2)] leading-relaxed">
                {r.content}
              </div>
            </details>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
