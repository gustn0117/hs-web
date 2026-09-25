import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/home-hero-studio-v2.webp";

export default function HeroBanner() {
  return (
    <section className="relative bg-[#0b1220] text-white overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/95 via-[#0b1220]/70 to-[#0b1220]/40" />

      <div className="relative w-full max-w-[1280px] mx-auto px-5 pt-16 pb-32 md:pt-24 md:pb-44">
        <div className="max-w-[820px]">
          <h1 className="text-[38px] md:text-[64px] font-extrabold leading-[1.15] tracking-[-0.035em]">
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
