import type { Metadata } from "next";
import { BottomCTA } from "@/components/PageShell";
import TypingQuote from "@/components/testimonials/TypingQuote";
import ReviewStars from "@/components/testimonials/ReviewStars";
import ReviewWall from "@/components/testimonials/ReviewWall";
import { REVIEWS, REVIEW_COUNT, REVIEW_AVERAGE } from "@/lib/reviews";
import { SITE_URL, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "고객이 직접 쓴 홈페이지 제작 후기",
  description: `하온에 홈페이지를 맡긴 고객이 직접 남긴 후기입니다. 맞춤법도 이모티콘도 고치지 않고 그대로 옮겼습니다. 평균 별점 ${REVIEW_AVERAGE} / 5.0.`,
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "홈페이지 제작 업체 후기", "하온 후기"],
  alternates: { canonical: abs("/testimonials") },
};

/**
 * 맨 위에서 돌려 가며 찍을 후기.
 *
 * 너무 짧으면 금방 끝나고 너무 길면 한 건 쓰는 데만 한참이라 길이로 추린다.
 * 최신 것부터 15건.
 */
const TYPING_MIN = 40;
const TYPING_MAX = 120;
const TYPING_COUNT = 15;

const typingReviews = REVIEWS.filter(
  (r) => r.score === 5 && r.comment.length >= TYPING_MIN && r.comment.length <= TYPING_MAX
).slice(0, TYPING_COUNT);

export default function TestimonialsPage() {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1280px] mx-auto px-5 py-12 md:py-16">
        <main className="space-y-12">
          <section className="max-w-[860px] mx-auto">
            <div className="flex items-baseline justify-center gap-3">
              <ReviewStars score={REVIEW_AVERAGE} size={20} />
              <span className="p-stat text-[26px] md:text-[30px] leading-none">
                {REVIEW_AVERAGE.toFixed(1)}
              </span>
              <span className="text-[13px] text-[var(--c-sub)]">평균 별점</span>
            </div>

            <div className="mt-8">
              <TypingQuote reviews={typingReviews} />
            </div>
          </section>

          <ReviewWall reviews={REVIEWS} average={REVIEW_AVERAGE} />
        </main>
      </div>

      <BottomCTA />
    </>
  );
}
