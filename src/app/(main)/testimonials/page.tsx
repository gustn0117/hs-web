import type { Metadata } from "next";
import { PageShell, Section } from "@/components/PageShell";
import { REVIEWS, REVIEW_COUNT, REVIEW_AVERAGE } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "고객 후기 - 홈페이지 제작 만족도 후기",
  description: `크몽에 올라온 실제 구매 후기 ${REVIEW_COUNT}건. 평균 별점 ${REVIEW_AVERAGE} / 5.0. 하온에 홈페이지를 맡긴 분들이 남긴 글을 그대로 옮겼습니다.`,
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "크몽 후기", "하온 후기"],
  alternates: { canonical: "https://hsweb.pics/testimonials" },
};

const SITE_URL = "https://hsweb.pics";

/** 2026-09-29 → 2026.09 */
function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}.${m}`;
}

function Stars({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[var(--c-event)]" aria-label={`별 ${score}점`}>
      {Array.from({ length: Math.round(score) }).map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function TestimonialsPage() {
  const latest = REVIEWS[0]?.date ?? "";

  // 검색 결과에 별점이 뜨도록 실제 집계를 그대로 싣는다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/testimonials#reviews`,
    name: "하온 홈페이지 제작",
    description: "홈페이지, 쇼핑몰, 업무 시스템 제작 서비스",
    brand: { "@type": "Brand", name: "하온" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_AVERAGE,
      reviewCount: REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    },
    review: REVIEWS.slice(0, 20).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.nickname },
      datePublished: r.date,
      reviewRating: { "@type": "Rating", ratingValue: r.score, bestRating: 5 },
      reviewBody: r.comment,
    })),
  };

  return (
    <PageShell
      breadcrumb={[{ label: "고객 후기" }]}
      overline="TESTIMONIALS"
      title="실제 구매 후기."
      subtitle={`크몽에 올라온 후기 ${REVIEW_COUNT}건을 손대지 않고 그대로 옮겼습니다.`}
      stats={[
        { label: "총 후기", value: String(REVIEW_COUNT), suffix: "건" },
        { label: "평균 별점", value: REVIEW_AVERAGE.toFixed(1), suffix: "/ 5.0" },
        { label: "최근 후기", value: fmtMonth(latest), suffix: "" },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section overline="REVIEWS" title="전체 후기">
        <p className="mb-7 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">
          크몽 구매 후기를 그대로 가져왔습니다. 작성자 이름은 크몽에서 가린 형태 그대로이고, 내용은
          한 글자도 고치지 않았습니다.{" "}
          <a
            href="https://kmong.com/gig/688507#gig-rate-evaluation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--c-main)] font-semibold underline underline-offset-2"
          >
            크몽에서 원문 보기
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="p-6 md:p-7 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <Stars score={r.score} />
                <span className="text-[12px] text-[var(--c-sub)] tnum shrink-0">{fmtMonth(r.date)}</span>
              </div>

              <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.85] mb-4 flex-1 whitespace-pre-line">
                {r.comment}
              </p>

              <div className="pt-4 border-t border-[var(--c-line)] flex items-center justify-between gap-3 text-[12px] text-[var(--c-sub)]">
                <span>{r.nickname}</span>
                {r.priceRange && <span className="shrink-0">{r.priceRange}</span>}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
