import type { Metadata } from "next";
import Link from "next/link";
import { REVIEWS, REVIEW_COUNT, REVIEW_AVERAGE, type Review } from "@/lib/reviews";
import { SITE_URL, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "고객이 직접 쓴 홈페이지 제작 후기",
  description: `하온에 홈페이지를 맡긴 고객이 직접 남긴 후기입니다. 맞춤법도 이모티콘도 고치지 않고 그대로 옮겼습니다. 평균 별점 ${REVIEW_AVERAGE} / 5.0.`,
  keywords: ["홈페이지 제작 후기", "웹사이트 제작 후기", "홈페이지 제작 업체 후기", "하온 후기"],
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

/** 어두운 바탕에서는 주황보다 호박색이 밝게 읽힌다. */
const STAR = "#f5a524";

function Stars({ score, size = 14 }: { score: number; size?: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      style={{ color: STAR }}
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
    <span className="shrink-0 inline-flex items-center h-[22px] px-2 border border-white/15 text-[11px] font-medium text-white/50 tnum">
      {range}
    </span>
  );
}

/** 상자를 두르지 않는다. 가로줄 하나로 나누면 흐를 때 리듬이 생긴다. */
function ReviewBlock({ review }: { review: Review }) {
  return (
    <article className="border-t border-white/12 pt-5">
      <Stars score={review.score} size={13} />
      <p className="mt-3.5 text-[15.5px] text-white/85 leading-[1.9] whitespace-pre-line">
        {review.comment}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-white/40">
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
 * 그래서 각 벌에 칸 간격만큼의 아래 여백(pb-7)을 똑같이 준다. 이게 어긋나면
 * 한 바퀴 돌 때마다 그 차이만큼 툭 튄다.
 */
function Column({ reviews, speed }: { reviews: Review[]; speed: string }) {
  return (
    <div className="review-col">
      <div className="review-track" style={{ "--speed": speed } as React.CSSProperties}>
        <div className="flex flex-col gap-7 pb-7">
          {reviews.map((r) => (
            <ReviewBlock key={r.id} review={r} />
          ))}
        </div>
        <div className="review-dup flex flex-col gap-7 pb-7" aria-hidden="true">
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
    // 사이트에서 이 페이지만 어둡다. 증명을 모아 둔 방이라는 뜻이다.
    <div className="bg-[#0a0f18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1280px] mx-auto px-5 pt-8 md:pt-10">
        <nav className="flex items-center gap-1.5 text-[12px] text-white/40">
          <Link href="/" className="no-underline text-white/40 hover:text-white transition-colors">
            홈
          </Link>
          <svg className="w-3 h-3 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-white/80 font-semibold">고객 후기</span>
        </nav>

        <h1 className="mt-9 text-[34px] md:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.15] text-white">
          고객이 직접 쓴 말.
        </h1>

        <div className="mt-7 border-t border-white/15" />

        <p className="mt-7 text-[16px] md:text-[18px] text-white/55 leading-[1.75] max-w-[640px]">
          맞춤법도, 오타도, 이모티콘도 그대로입니다. 한 글자도 고치지 않았습니다.
        </p>

        {lead && (
          <section className="mt-20 md:mt-28 max-w-[860px]">
            <div className="flex items-baseline gap-3">
              <Stars score={5} size={19} />
              <span className="text-[26px] md:text-[30px] font-extrabold tracking-[-0.03em] leading-none text-white tnum">
                {REVIEW_AVERAGE.toFixed(1)}
              </span>
              <span className="text-[13px] text-white/45">평균 별점</span>
            </div>

            <blockquote className="mt-8 text-[23px] md:text-[36px] font-extrabold tracking-[-0.035em] leading-[1.5] text-white whitespace-pre-line">
              {lead.comment}
            </blockquote>

            <p className="mt-7 flex items-center gap-2.5 text-[13px] text-white/45">
              <span>{lead.nickname}</span>
              {lead.priceRange && <PriceTag range={lead.priceRange} />}
            </p>
          </section>
        )}
      </div>

      <div className="max-w-[1280px] mx-auto px-5 mt-20 md:mt-28 pb-20 md:pb-28">
        <div className="review-wall">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-7 items-start">
            {columns.map((reviews, i) => (
              <Column key={i} reviews={reviews} speed={speeds[i]} />
            ))}
          </div>
        </div>
      </div>

      <section className="border-t border-white/10">
        <div className="max-w-[900px] mx-auto px-5 py-20 md:py-24 text-center">
          <h2 className="text-[26px] md:text-[38px] font-extrabold tracking-[-0.035em] leading-[1.3] text-white">
            프로젝트 상담 받아보세요.
          </h2>
          <p className="mt-4 text-[16px] text-white/50">
            첫 상담은 무료입니다. 24시간 이내 회신해드립니다.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-7 rounded-[10px] bg-white text-[#0a0f18] font-bold text-[15px] no-underline hover:bg-white/90 transition-colors"
            >
              상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="tel:010-3319-2509"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-6 rounded-[10px] text-white font-semibold text-[15px] no-underline border border-white/20 hover:bg-white/5 transition-colors tnum"
            >
              010-3319-2509
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
