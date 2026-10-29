import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { REVIEWS, REVIEW_COUNT, REVIEW_AVERAGE, type Review } from "@/lib/reviews";
import { SITE_URL, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "고객 후기 - 홈페이지 제작 만족도 후기",
  description: `크몽에서 하온에 홈페이지를 맡긴 분들이 남긴 구매 후기를 손대지 않고 그대로 옮겼습니다. 평균 별점 ${REVIEW_AVERAGE} / 5.0.`,
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "크몽 후기", "하온 후기"],
  alternates: { canonical: abs("/testimonials") },
};

/** 맨 위에 크게 올릴 후기 하나. 한눈에 읽히면서 내용은 있는 길이를 고른다. */
const LEAD_LENGTH = 95;

function pickLead(): Review | undefined {
  return [...REVIEWS]
    .filter((r) => r.score === 5)
    .sort(
      (a, b) =>
        Math.abs(a.comment.length - LEAD_LENGTH) - Math.abs(b.comment.length - LEAD_LENGTH)
    )[0];
}

function Stars({ score, size = 16 }: { score: number; size?: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-[var(--c-event)]"
      aria-label={`별 ${score}점`}
    >
      {Array.from({ length: Math.round(score) }).map((_, i) => (
        <svg
          key={i}
          style={{ width: size, height: size }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/** 금액대. 장식이 아니라 "내 예산대 사람도 만족했나"를 알려주는 정보다. */
function PriceTag({ range }: { range: string }) {
  return (
    <span className="shrink-0 inline-flex items-center h-[22px] px-2 bg-white border border-[var(--c-line)] text-[11px] font-medium text-[var(--c-sub)] tnum">
      {range}
    </span>
  );
}

function ReviewBlock({ review }: { review: Review }) {
  return (
    <article className="bg-[var(--c-bg-1)] border-l-2 border-[var(--c-main)] px-5 py-5">
      <Stars score={review.score} size={14} />
      <p className="mt-3.5 text-[15px] text-[var(--c-text-2)] leading-[1.85] whitespace-pre-line">
        {review.comment}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-[var(--c-sub)]">
        <span className="truncate">{review.nickname}</span>
        {review.priceRange && <PriceTag range={review.priceRange} />}
      </div>
    </article>
  );
}

/**
 * 끊김 없이 돌려면 같은 목록을 한 벌 더 깔아야 한다. 뒷벌은 읽히지 않게 숨긴다.
 *
 * 두 벌의 높이가 정확히 반반이어야 -50% 지점이 뒷벌 첫 칸과 맞물린다.
 * 그래서 각 벌에 칸 간격만큼의 아래 여백(pb-4)을 똑같이 준다. 이게 어긋나면
 * 한 바퀴 돌 때마다 그 차이만큼 툭 튄다.
 */
function Column({ reviews, speed }: { reviews: Review[]; speed: string }) {
  return (
    <div className="review-col">
      <div className="review-track" style={{ "--speed": speed } as React.CSSProperties}>
        <div className="flex flex-col gap-4 pb-4">
          {reviews.map((r) => (
            <ReviewBlock key={r.id} review={r} />
          ))}
        </div>
        <div className="review-dup flex flex-col gap-4 pb-4" aria-hidden="true">
          {reviews.map((r) => (
            <ReviewBlock key={`dup-${r.id}`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const lead = pickLead();
  const wall = REVIEWS.filter((r) => r.id !== lead?.id);
  const columns = [0, 1, 2].map((c) => wall.filter((_, i) => i % 3 === c));
  const speeds = ["188s", "232s", "206s"];

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
      subtitle="크몽에서 받은 후기를 하나도 손대지 않고 그대로 옮겼습니다."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {lead && (
        <section className="max-w-[780px]">
          <div className="flex items-baseline gap-3">
            <Stars score={5} size={20} />
            <span className="p-stat text-[26px] md:text-[30px] leading-none">
              {REVIEW_AVERAGE.toFixed(1)}
            </span>
            <span className="text-[13px] text-[var(--c-sub)]">평균 별점</span>
          </div>

          <blockquote className="mt-7 text-[21px] md:text-[31px] font-extrabold tracking-[-0.03em] leading-[1.55] text-[var(--c-text)] whitespace-pre-line">
            {lead.comment}
          </blockquote>

          <p className="mt-6 flex items-center gap-2.5 text-[13px] text-[var(--c-sub)]">
            <span>{lead.nickname}</span>
            {lead.priceRange && <PriceTag range={lead.priceRange} />}
          </p>
        </section>
      )}

      <div className="review-wall">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {columns.map((reviews, i) => (
            <Column key={i} reviews={reviews} speed={speeds[i]} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
