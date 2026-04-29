import Link from "next/link";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";
import { services } from "@/lib/services";

export const revalidate = 60;

function fmtDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const WHY_POINTS = [
  {
    t: "합리적인 가격",
    d: "249,000원부터 시작. 불필요한 오버헤드 없이 실속 있게.",
    stat: "249,000원~",
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    large: true,
  },
  {
    t: "무료 유지보수",
    d: "간단한 텍스트·이미지·콘텐츠 수정은 계속 무료로 지원합니다.",
    stat: "기간 제한 없음",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    t: "소스코드 100% 제공",
    d: "납품 후 모든 저작권 이전. 원하는 어디든 이전 가능.",
    stat: "100% 이전",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
  {
    t: "전자 계약",
    d: "모든 프로젝트는 전자 계약서 기반. 범위·일정 명확히.",
    stat: "법적 효력",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    dark: true,
  },
  {
    t: "실제 대표가 직접 응대",
    d: "디자이너 + 엔지니어 대표가 모든 프로젝트를 직접 관리.",
    stat: "대표 직접",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

const MICRO_TESTIMONIALS = [
  {
    quote: "초보 사장인데 매번 친절히 설명해주시고, 요구사항 반영이 빨랐어요. 오픈 후 매장 문의가 확 늘었습니다.",
    by: "외식업 · ○○ 카페",
    rating: 5,
  },
  {
    quote: "관리자 기능까지 풀 패키지. 학원 운영이 확실히 편해졌고 모바일 최적화도 완벽합니다.",
    by: "교육 · ○○ 학원",
    rating: 5,
  },
  {
    quote: "B2B 영업용 사이트가 필요했는데 전문적이면서 신뢰감 있게 잘 만들어주셨어요.",
    by: "제조업 · ○○ 테크",
    rating: 5,
  },
];

export default async function Home() {
  let portfolio: PortfolioItem[] = [];
  try {
    portfolio = await getPortfolioItems();
  } catch {}

  const featured = portfolio[0];
  const rest = portfolio.slice(1, 5);

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-50" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-white/95 to-transparent" />

        {/* Ambient radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(10, 42, 94, 0.07) 0%, transparent 60%)"
        }} />

        <div className="relative max-w-[900px] mx-auto px-5 text-center">
          <h1 className="p-display mb-7">
            <span className="block hero-blur-in" style={{ animationDelay: "0.05s" }}>
              비즈니스의 시작,
            </span>
            <span className="block hero-blur-in" style={{ animationDelay: "0.25s" }}>
              <span className="hero-word-rotator align-baseline">
                <span className="hero-word-rotator-track">
                  <span>제대로 된</span>
                  <span>빠르고 정확한</span>
                  <span>감각적인</span>
                  <span>실속 있는</span>
                  <span>제대로 된</span>
                </span>
              </span>{" "}
              <span className="relative inline-block">
                <span
                  className="hero-gradient-text hero-text-shimmer"
                  data-text="웹 서비스"
                >
                  웹 서비스
                </span>
                <span
                  aria-hidden
                  className="hero-scribble absolute left-0 right-0 bottom-[-4px] md:bottom-[-6px] h-[8px] md:h-[12px] bg-[var(--c-main)]/15 rounded-sm"
                />
              </span>
              <wbr />
              부터.
            </span>
          </h1>

          <p
            className="text-[16px] md:text-[19px] text-[var(--c-text-2)] max-w-[560px] mx-auto leading-[1.7] mb-10 hero-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            기획 · 디자인 · 개발 · 운영까지.<br className="hidden md:block" />
            10분 상담으로 견적·일정을 확인하세요
            <span className="hero-cursor" aria-hidden />
          </p>

          <div
            className="flex items-center gap-3 justify-center flex-wrap mb-8 hero-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Link href="/contact" className="p-btn p-btn-dark p-btn-xl hero-pulse-glow">
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/portfolio" className="p-btn p-btn-xl">
              포트폴리오 보기
            </Link>
          </div>

          <div
            className="flex items-center gap-5 justify-center flex-wrap text-[12px] text-[var(--c-sub)] hero-fade-up"
            style={{ animationDelay: "0.65s" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-flex w-2 h-2 rounded-full bg-[var(--c-new)] animate-pulse" />
              <span>지금 상담 접수 가능</span>
            </div>
            <span className="p-sep" />
            <a href="tel:010-3319-2509" className="tnum font-semibold text-[var(--c-text)] hover:text-[var(--c-main)] no-underline keep">010-3319-2509</a>
            <span className="p-sep" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[var(--c-event)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              평균 만족도 <strong className="text-[var(--c-text)]">5.0/5.0</strong>
            </span>
          </div>

          {/* hidden fallback to keep portfolio count reference */}
          <span className="hidden" aria-hidden>{portfolio.length || 12}</span>
        </div>

        {/* Stats bar — compact, full width inside hero */}
        <div className="relative max-w-[1280px] mx-auto px-5">
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-b border-[var(--c-line)]">
            {[
              { num: "249,000", unit: "원~", label: "제작 시작가", numSize: "text-[28px] md:text-[34px] lg:text-[40px]" },
              { num: "100", unit: "%", label: "소스코드 제공", numSize: "text-[32px] md:text-[42px] lg:text-[52px]" },
              { num: "95", unit: "%", label: "재의뢰율", numSize: "text-[32px] md:text-[42px] lg:text-[52px]" },
              { num: "100", unit: "%", label: "반응형 적용", numSize: "text-[32px] md:text-[42px] lg:text-[52px]" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`py-7 md:py-9 px-4 md:px-6 ${i !== 0 ? "md:border-l" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} ${i % 2 === 1 ? "border-l" : ""} border-[var(--c-line)]`}
              >
                <p className="text-[11px] text-[var(--c-sub)] font-semibold mb-3 keep tracking-wider uppercase">{s.label}</p>
                <p className="p-stat nowrap flex items-baseline">
                  <span className={`${s.numSize} leading-none`}>{s.num}</span>
                  <span className="text-[13px] md:text-[15px] text-[var(--c-sub)] font-bold ml-1">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═════════ Why HS WEB — Bento ═════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-[680px]">
              <p className="p-overline mb-3">WHY HS WEB</p>
              <h2 className="p-h1-xl mb-4">
                다른 에이전시와<br />
                6가지가 다릅니다.
              </h2>
              <p className="text-[16px] text-[var(--c-sub)] leading-[1.7]">
                작은 팀이지만 투명하고 빠르게. 합리적 가격으로 최고의 결과를 만듭니다.
              </p>
            </div>
          </div>

          {/* Horizontal split list — big stat left, title/desc right */}
          <div className="border-t border-[var(--c-line)]">
            {WHY_POINTS.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_1fr] md:grid-cols-[90px_280px_1fr_60px] gap-4 md:gap-8 items-center py-7 md:py-9 border-b border-[var(--c-line)] group"
              >
                {/* Number */}
                <div className="text-[28px] md:text-[36px] font-black tracking-tight text-[var(--c-line-3)] group-hover:text-[var(--c-text)] transition-colors tnum">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-[18px] md:text-[22px] font-bold tracking-tight text-[var(--c-text)]">
                    {p.t}
                  </h3>
                </div>

                {/* Description */}
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[14px] md:text-[15px] text-[var(--c-sub)] leading-[1.7]">
                    {p.d}
                  </p>
                </div>

                {/* Stat highlight */}
                <div className="col-span-2 md:col-span-1 hidden md:flex justify-end">
                  <span className="inline-flex items-center h-8 px-3 rounded-full bg-[var(--c-main-bg)] text-[var(--c-main)] text-[12.5px] font-bold tracking-wide tnum keep">
                    {p.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ Services — Bento ═════════ */}
      <section className="py-24 md:py-32 border-t border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-[680px]">
              <p className="p-overline mb-3">SERVICES</p>
              <h2 className="p-h1-xl mb-4">
                필요한 모든 웹 서비스,<br />
                한 곳에서.
              </h2>
              <p className="text-[16px] text-[var(--c-sub)] leading-[1.7]">
                단순한 홈페이지 제작을 넘어 브랜드 성장에 필요한 전반을 지원합니다.
              </p>
            </div>
            <Link href="/services" className="hidden md:inline-flex items-center gap-2 text-[14px] font-semibold no-underline text-[var(--c-text)] p-anim-link">
              전체 서비스 보기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Horizontal list — same pattern as Why */}
          <div className="border-t border-[var(--c-line)]">
            {services.slice(0, 6).map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="grid grid-cols-[60px_1fr_24px] md:grid-cols-[90px_260px_1fr_auto_24px] gap-4 md:gap-6 items-center py-7 md:py-9 border-b border-[var(--c-line)] group no-underline hover:bg-[var(--c-bg-1)] -mx-5 px-5 md:-mx-6 md:px-6 transition-colors"
              >
                {/* Number */}
                <div className="text-[28px] md:text-[36px] font-black tracking-tight text-[var(--c-line-3)] group-hover:text-[var(--c-text)] transition-colors tnum">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Title */}
                <div className="min-w-0">
                  <h3 className="text-[18px] md:text-[22px] font-bold tracking-tight text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                    {s.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="hidden md:block">
                  <p className="text-[15px] text-[var(--c-sub)] leading-[1.6] line-clamp-2">
                    {s.subtitle}
                  </p>
                </div>

                {/* Tag */}
                <div className="hidden md:flex justify-end">
                  <span className="p-chip whitespace-nowrap">{s.tags[0]}</span>
                </div>

                {/* Arrow */}
                <div className="flex justify-end">
                  <svg className="w-4 h-4 text-[var(--c-sub-2)] group-hover:text-[var(--c-text)] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="md:hidden mt-6 text-center">
            <Link href="/services" className="p-btn">전체 서비스 보기</Link>
          </div>
        </div>
      </section>

      {/* ═════════ Portfolio ═════════ */}
      <section className="py-24 md:py-32 border-t border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="p-overline mb-3">PORTFOLIO</p>
              <h2 className="p-h1-xl mb-4">
                숫자로 증명하는<br />프로젝트 성과.
              </h2>
              <p className="text-[16px] text-[var(--c-sub)] leading-[1.7] max-w-[560px]">
                {portfolio.length > 0
                  ? "실제 클라이언트와 함께한 최근 작업물입니다."
                  : "곧 새로운 프로젝트들을 공개합니다."}
              </p>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[14px] font-semibold no-underline text-[var(--c-text)] p-anim-link">
              전체 보기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {portfolio.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--c-sub)] mb-4">포트폴리오가 곧 업데이트됩니다.</p>
              <Link href="/contact" className="p-btn p-btn-dark">첫 프로젝트 상담 신청</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
              {featured && (
                <Link href={`/portfolio/${featured.id}`} className="group no-underline block">
                  <div className="p-showcase !aspect-square !rounded-[16px] mb-4 relative">
                    {featured.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.thumbnail} alt={featured.title} />
                    ) : (
                      <div className="w-full h-full bg-[var(--c-bg-2)]" />
                    )}
                    {featured.featured && (
                      <span className="absolute top-4 left-4 b-hot">FEATURED</span>
                    )}
                    <div className="absolute bottom-4 right-4 p-arrow-btn">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-[12px] text-[var(--c-sub)]">
                    <span className="p-chip">{featured.category || "프로젝트"}</span>
                    <span className="tnum">{fmtDate(featured.createdAt)}</span>
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-1 text-[var(--c-text)]">{featured.title}</h3>
                  <p className="text-[14px] text-[var(--c-sub)] line-clamp-2 max-w-[560px]">{featured.description || featured.client}</p>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-3">
                {rest.map((p) => (
                  <Link key={p.id} href={`/portfolio/${p.id}`} className="group no-underline block">
                    <div className="p-showcase !aspect-square !rounded-[12px] mb-2 relative bg-[var(--c-bg-2)]">
                      {p.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--c-sub)] mb-0.5">
                      <span>{p.category || "프로젝트"}</span>
                      <span>·</span>
                      <span className="tnum">{fmtDate(p.createdAt)}</span>
                    </div>
                    <h4 className="text-[15px] font-semibold tracking-tight text-[var(--c-text)] line-clamp-1">{p.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═════════ Process ═════════ */}
      <section className="py-24 md:py-32 border-b border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="p-overline mb-3">HOW IT WORKS</p>
              <h2 className="p-h1-xl mb-5">
                상담부터 런칭까지,<br />단계별 진행.
              </h2>
              <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] mb-8">
                모든 프로젝트는 동일한 체계로 진행됩니다. 각 단계마다 고객과 공유하며 투명하게.
              </p>
              <Link href="/process" className="p-btn">자세히 보기</Link>
            </div>

            <div className="border-t border-[var(--c-line)]">
              {[
                { n: "01", t: "상담 · 기획", d: "요구사항 파악 및 프로젝트 범위·일정 확정", dur: "1~2일" },
                { n: "02", t: "디자인", d: "브랜드에 맞는 UI/UX 시안 2~3종 제공, 2~3회 수정 포함", dur: "3~7일" },
                { n: "03", t: "개발 · 퍼블리싱", d: "반응형 코드 작성, 관리자 기능 개발", dur: "5~14일" },
                { n: "04", t: "테스트 · 런칭", d: "QA 후 도메인 연결, 실 서비스 배포", dur: "1~3일" },
                { n: "05", t: "유지보수", d: "간단한 텍스트·이미지·콘텐츠 수정은 평생 무료 지원", dur: "평생" },
              ].map((step) => (
                <div key={step.n} className="grid grid-cols-[60px_1fr_100px] md:grid-cols-[80px_1fr_120px] gap-4 py-8 border-b border-[var(--c-line)] last:border-b-0">
                  <div className="text-[44px] md:text-[56px] font-black leading-none tracking-tight text-[var(--c-line-3)]">{step.n}</div>
                  <div>
                    <h3 className="text-[18px] md:text-[22px] font-bold tracking-tight mb-2">{step.t}</h3>
                    <p className="text-[14px] text-[var(--c-sub)] leading-[1.65]">{step.d}</p>
                  </div>
                  <div className="text-right text-[13px] text-[var(--c-sub)] keep pt-1">{step.dur}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Pricing ═════════ */}
      <section className="py-24 md:py-32 bg-[var(--c-bg-1)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-center mb-14">
            <p className="p-overline mb-3">PRICING</p>
            <h2 className="p-h1-xl mb-4">투명한 가격, 합리적인 시작.</h2>
            <p className="text-[16px] text-[var(--c-sub)] leading-[1.7]">규모에 맞는 플랜을 선택하세요. VAT 별도.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1080px] mx-auto">
            {[
              { name: "Basic", subtitle: "소규모 사업자", price: "249,000", suffix: "원~", features: ["반응형 5페이지", "기본 SEO 최적화", "간단 수정 평생 무료", "도메인·호스팅 가이드"] },
              { name: "Professional", subtitle: "성장하는 브랜드", price: "700,000", suffix: "원~", features: ["맞춤 디자인 10P", "고급 성능 최적화", "관리자 페이지 포함", "간단 수정 평생 무료"], featured: true },
              { name: "Enterprise", subtitle: "대규모 프로젝트", price: "상담", suffix: " 맞춤", features: ["풀 커스텀 개발", "쇼핑몰 / 웹앱 / API", "전담 PM 배정", "간단 수정 평생 무료"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-[18px] border ${plan.featured ? "bg-[var(--c-text)] text-white border-[var(--c-text)]" : "bg-white border-[var(--c-line)]"}`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center h-6 px-3 rounded-full bg-white text-[var(--c-text)] text-[11px] font-bold tracking-[0.12em]">
                    MOST POPULAR
                  </span>
                )}
                <div className="mb-6">
                  <p className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${plan.featured ? "text-white/70" : "text-[var(--c-sub)]"}`}>{plan.name}</p>
                  <h3 className={`text-[18px] font-bold ${plan.featured ? "text-white" : "text-[var(--c-text)]"}`}>{plan.subtitle}</h3>
                </div>
                <div className="mb-8 flex items-baseline gap-1 nowrap">
                  <span className={`p-stat text-[44px] leading-none ${plan.featured ? "!text-white" : ""}`}>{plan.price}</span>
                  <span className={`text-[14px] font-semibold ${plan.featured ? "text-white/60" : "text-[var(--c-sub)]"}`}>{plan.suffix}</span>
                </div>
                <ul className="list-none space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-[13.5px] ${plan.featured ? "text-white/85" : "text-[var(--c-text-2)]"}`}>
                      <svg className={`w-4 h-4 shrink-0 mt-0.5 ${plan.featured ? "text-white" : "text-[var(--c-main)]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center w-full h-12 rounded-[10px] font-bold text-[14px] no-underline transition-colors ${plan.featured ? "bg-white text-[var(--c-text)] hover:bg-[var(--c-bg-2)]" : "bg-[var(--c-text)] text-white hover:bg-black"}`}
                >
                  상담 신청
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ Testimonials ═════════ */}
      <section className="py-24 md:py-32 border-t border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-center mb-14">
            <p className="p-overline mb-3">TESTIMONIALS</p>
            <h2 className="p-h1-xl mb-4">
              고객이 직접 남긴<br />후기로 증명합니다.
            </h2>
            <p className="text-[16px] text-[var(--c-sub)] leading-[1.7]">평균 만족도 5.0/5.0 · 재의뢰율 95%</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MICRO_TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-7 rounded-[14px] border border-[var(--c-line)] bg-white flex flex-col">
                <div className="flex items-center gap-0.5 text-[var(--c-event)] mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[15px] text-[var(--c-text)] leading-[1.7] mb-5 flex-1">
                  <span className="text-[var(--c-main)] text-[18px] font-bold">“</span>
                  {t.quote}
                  <span className="text-[var(--c-main)] text-[18px] font-bold">”</span>
                </p>
                <p className="text-[12.5px] text-[var(--c-sub)] pt-4 border-t border-[var(--c-line)]">— {t.by}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/testimonials" className="p-btn">전체 후기 보기</Link>
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="py-24 md:py-32 bg-[var(--c-bg-1)] border-t border-[var(--c-line)]">
        <div className="max-w-[1080px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-14">
            <div>
              <p className="p-overline mb-3">FAQ</p>
              <h2 className="p-h1-xl mb-5">
                궁금한 점이<br />있으신가요?
              </h2>
              <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] mb-8">
                자주 묻는 질문을 모아뒀습니다.<br />더 궁금하신 사항은 편하게 연락 주세요.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a href="tel:010-3319-2509" className="p-btn tnum">010-3319-2509</a>
                <Link href="/contact" className="p-btn p-btn-dark">견적 문의</Link>
              </div>
            </div>

            <div className="border-t border-[var(--c-line)]">
              {[
                { q: "유지보수는 어떻게 진행되나요?", a: "간단한 텍스트·이미지·콘텐츠 수정은 기간 제한 없이 계속 무료로 지원합니다. 신규 기능 추가나 대규모 구조 변경은 범위에 따라 별도 견적으로 진행됩니다." },
                { q: "도메인과 호스팅도 제공되나요?", a: "도메인·호스팅은 고객사 명의로 개설하며, HS WEB이 실비 기준으로 대행·관리합니다. 추가 수수료는 없습니다." },
                { q: "수정은 몇 번까지 가능한가요?", a: "시안 단계에서 2~3회 수정을 기본 제공합니다. 이후 대규모 변경이 필요하면 범위에 따라 추가 상담 후 진행합니다." },
                { q: "결제는 어떻게 진행되나요?", a: "계약 시 50%, 최종 납품 시 잔금 50% 지급이 기본입니다. 엔터프라이즈는 단계별 정산도 가능합니다." },
              ].map((item, i) => (
                <details key={i} className="border-b border-[var(--c-line)] group">
                  <summary className="flex items-start justify-between py-6 cursor-pointer list-none gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-[14px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                      <span className="text-[16px] font-semibold text-[var(--c-text)] leading-[1.5]">{item.q}</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="pb-6 pl-[42px] text-[14px] text-[var(--c-sub)] leading-[1.8]">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Final CTA ═════════ */}
      <section className="p-section-dark py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-[0.08]" />
        <div className="relative max-w-[1000px] mx-auto px-5 text-center">
          <p className="p-overline mb-4 text-[var(--c-main-l)]">GET STARTED</p>
          <h2 className="p-display text-white mb-6">
            이제,<br />당신의 차례입니다.
          </h2>
          <p className="text-[18px] text-white/70 mb-10 max-w-[520px] mx-auto leading-[1.7]">
            첫 상담은 무료입니다. 어떤 프로젝트든 편하게 문의해주세요.
          </p>
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-[60px] px-8 rounded-[12px] bg-white text-[var(--c-text)] font-bold text-[16px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="tel:010-3319-2509"
              className="inline-flex items-center gap-2 h-[60px] px-6 rounded-[12px] text-white font-semibold text-[16px] no-underline border border-white/20 hover:bg-white/5 transition-colors tnum"
            >
              010-3319-2509
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
