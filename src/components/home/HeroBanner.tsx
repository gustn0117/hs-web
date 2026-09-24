import Link from "next/link";

/** 사진을 넣을 때만 채우면 된다. 비어 있으면 빗금 자리표시자가 보인다. */
const HERO_IMAGE = "";

export default function HeroBanner() {
  return (
    <section className="relative bg-[#0b1220] text-white overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center">
      <div
        className="absolute inset-0"
        style={
          HERO_IMAGE
            ? { backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {
                backgroundImage:
                  "repeating-linear-gradient(45deg, #101a2e 0px, #101a2e 14px, #16223a 14px, #16223a 28px)",
              }
        }
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/95 via-[#0b1220]/70 to-[#0b1220]/40" />

      <div className="relative w-full max-w-[1280px] mx-auto px-5 pt-16 pb-32 md:pt-24 md:pb-44">
        <div className="max-w-[820px]">
          <p className="text-[13px] md:text-[15px] font-bold text-white/75">
            300건 이상 제작 · 검증된 업체
          </p>
          <h1 className="mt-3 md:mt-4 text-[38px] md:text-[64px] font-extrabold leading-[1.15] tracking-[-0.035em]">
            홈페이지, 프로그램 제작
          </h1>
          <p className="mt-5 text-[15px] md:text-[18px] text-white/75 leading-[1.7]">
            기획부터 디자인, 개발, 배포까지 한 곳에서.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-[52px] px-7 bg-white text-[#0b1220] text-[15px] font-extrabold no-underline hover:bg-white/90 transition-colors"
            >
              상담 신청
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center h-[52px] px-7 border border-white/40 text-white text-[15px] font-bold no-underline hover:bg-white/10 transition-colors"
            >
              제작 사례 보기
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
