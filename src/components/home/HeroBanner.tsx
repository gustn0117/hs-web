import Image from "next/image";
import Link from "next/link";
import TypeLine from "@/components/TypeLine";

const HEADLINE = "쓰임에 맞는\n웹 솔루션";

/**
 * 첫 화면. 사진 없이 글자만으로 간다.
 *
 * 움직임은 제목이 찍히는 것 하나뿐이다 — 하나만 움직여야 그게 눈에 걸린다.
 * 바로 아래 카드가 이 구간 밑단에 겹쳐 올라오니 아래 여백을 넉넉히 둔다.
 */
export default function HeroBanner() {
  return (
    <section className="bg-[var(--c-main)] text-white" aria-label="하온 소개">
      <div className="hero-enter max-w-[760px] mx-auto px-5 pt-20 pb-40 text-center md:pt-28 md:pb-48">
        <Image
          src="/brand/haon-logo-white.png"
          alt="하온 HAON Software Solutions"
          width={751}
          height={240}
          priority
          className="h-[34px] md:h-[42px] w-auto mx-auto"
        />

        {/* 두 줄 높이를 미리 잡아 둔다. 안 그러면 찍히는 동안 아래 글이 밀린다. */}
        <h1 className="mt-8 min-h-[2.3em] text-[38px] md:text-[64px] font-extrabold leading-[1.15] tracking-[-0.035em] whitespace-pre-line">
          <TypeLine text={HEADLINE} />
        </h1>

        <p className="mt-5 text-[15px] md:text-[18px] leading-[1.7] text-white/75">
          홈페이지 제작부터 쇼핑몰, 랜딩페이지, CRM, 관리자 시스템까지 직접 설계하고 만듭니다.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-[52px] px-7 bg-white text-[var(--c-main)] text-[15px] font-extrabold no-underline transition-colors hover:bg-white/90"
          >
            상담 신청
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center h-[52px] px-7 border border-white/40 text-[15px] font-bold no-underline transition-colors hover:bg-white/10"
          >
            제작 사례 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
