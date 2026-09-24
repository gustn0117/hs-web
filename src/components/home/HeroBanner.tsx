import Link from "next/link";

/** 사진을 넣을 때만 채우면 된다. 비어 있으면 빗금 자리표시자가 보인다. */
const HERO_IMAGE = "";

const POINTS = [
  { value: "300건+", label: "제작 실적" },
  { value: "249,000원~", label: "시작 가격" },
  { value: "평생 무료", label: "간단 수정" },
];

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
            300건 이상 제작 · 검증된 웹에이전시
          </p>
          <h1 className="mt-3 md:mt-4 text-[34px] md:text-[60px] font-extrabold leading-[1.15] tracking-[-0.03em]">
            300번의 경험이
            <br />
            결과로 증명합니다
          </h1>
          <p className="mt-5 text-[15px] md:text-[18px] text-white/75 leading-[1.7] max-w-[620px]">
            홈페이지부터 쇼핑몰, 관리 시스템까지 300건 넘게 만들어 왔습니다.
            기획·디자인·개발·배포를 한 곳에서 맡고, 만든 뒤에도 계속 봐드립니다.
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

          <dl className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
            {POINTS.map((p) => (
              <div key={p.label}>
                <dt className="text-[12px] text-white/55">{p.label}</dt>
                <dd className="mt-1 text-[20px] md:text-[24px] font-extrabold tracking-[-0.02em] tnum">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
