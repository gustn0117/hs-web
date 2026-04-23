import Link from "next/link";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";
import { services } from "@/lib/services";

export const revalidate = 60;

function fmtDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const TRUST_BRANDS = [
  "제조", "쇼핑몰", "병원·의료", "교육", "부동산", "F&B", "스타트업",
  "전문직", "커뮤니티", "브랜드몰", "엔터테인먼트", "IT 서비스",
];

export default async function Home() {
  let portfolio: PortfolioItem[] = [];
  try {
    portfolio = await getPortfolioItems();
  } catch {
    /* build-time fallback */
  }

  const featured = portfolio[0];
  const rest = portfolio.slice(1, 5);

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-60" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-white/95 to-transparent" />

        <div className="relative max-w-[1280px] mx-auto px-5">
          <div className="mb-8">
            <span className="p-eyebrow">
              <span className="keep">2026 업데이트</span>
              <span className="text-[var(--c-sub)] font-normal ml-1">· 무료 유지보수 포함</span>
            </span>
          </div>

          <h1 className="p-display mb-8 max-w-[1100px]">
            <span className="block">비즈니스의 시작,</span>
            <span className="block">
              <span className="relative inline-block">
                제대로 된 홈페이지
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-[-6px] h-[8px] md:h-[12px] bg-[var(--c-main)]/18"
                />
              </span>
              <wbr />
              부터.
            </span>
          </h1>

          <p className="text-[17px] md:text-[20px] text-[var(--c-text-2)] max-w-[640px] leading-[1.7] mb-12">
            기획 · 디자인 · 개발 · 운영까지.
            <br className="hidden md:block" />
            10분 상담으로 견적·일정을 확인하세요.
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-16">
            <Link href="/contact" className="p-btn p-btn-dark p-btn-xl">
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/portfolio" className="p-btn p-btn-xl">
              포트폴리오 보기
            </Link>
            <a href="tel:010-3319-2509" className="hidden sm:inline-flex items-center gap-2 h-[60px] px-4 text-[var(--c-text-2)] hover:text-[var(--c-text)] no-underline tnum text-[15px] font-semibold">
              <svg className="w-4 h-4 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              010-3319-2509
            </a>
          </div>

          {/* Stats in a row — big numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-b border-[var(--c-line)]">
            {[
              { num: "249,000", unit: "원~", label: "제작 시작가" },
              { num: "1~2", unit: "주", label: "평균 제작 기간" },
              { num: "1+", unit: "개월", label: "무상 유지보수" },
              { num: "100", unit: "%", label: "반응형 적용" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`py-8 md:py-10 px-4 md:px-6 ${
                  i !== 0 ? "md:border-l" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""} ${
                  i % 2 === 1 ? "border-l" : ""
                } border-[var(--c-line)]`}
              >
                <p className="text-[12px] text-[var(--c-sub)] font-medium mb-3 keep">{s.label}</p>
                <p className="p-number nowrap">
                  <span>{s.num}</span>
                  <span className="text-[16px] md:text-[20px] text-[var(--c-sub)] font-bold ml-1">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ Trust band — marquee ═════════ */}
      <section className="border-t border-b border-[var(--c-line)] bg-[var(--c-bg-1)] py-8">
        <div className="flex items-center gap-6 max-w-[1280px] mx-auto px-5 mb-5">
          <span className="text-[12px] font-bold text-[var(--c-sub)] tracking-wider uppercase keep">Trusted by</span>
          <div className="flex-1 h-px bg-[var(--c-line)]" />
          <span className="text-[12px] text-[var(--c-sub)] keep">다양한 업종의 브랜드와 함께합니다</span>
        </div>
        <div className="p-marquee-wrap">
          {[0, 1].map((k) => (
            <div key={k} className="p-marquee-track" aria-hidden={k === 1}>
              {TRUST_BRANDS.map((b, i) => (
                <span key={i} className="flex items-center gap-3 text-[20px] md:text-[26px] font-bold text-[var(--c-text-2)] tracking-tight keep">
                  {b}
                  <span className="text-[var(--c-line-3)] text-[16px]">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═════════ Services — Bento grid ═════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-[720px]">
              <p className="p-overline mb-3">SERVICES</p>
              <h2 className="p-h1-xl mb-4">
                필요한 모든 웹 서비스,
                <br />
                HS WEB 한 곳에서.
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

          {/* Bento — first card is large */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {services.slice(0, 6).map((s, i) => {
              const isLarge = i === 0;
              const isDark = i === 3;
              const span = isLarge ? "md:col-span-3 md:row-span-2" : "md:col-span-2";
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className={`p-bento ${isDark ? "p-bento-dark" : ""} ${span} no-underline flex flex-col group ${isLarge ? "min-h-[340px]" : "min-h-[180px]"}`}
                >
                  <div className="flex items-start justify-between mb-auto">
                    <span className={`text-[11px] font-bold tracking-[0.14em] ${isDark ? "text-white/60" : "text-[var(--c-sub)]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <svg className={`w-5 h-5 ${isDark ? "text-white/80" : "text-[var(--c-sub-2)]"} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className={`${isLarge ? "text-[28px] md:text-[36px]" : "text-[20px]"} font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-[var(--c-text)]"}`}>
                      {s.title}
                    </h3>
                    <p className={`text-[14px] leading-[1.6] ${isDark ? "text-white/70" : "text-[var(--c-sub)]"} ${isLarge ? "max-w-[420px]" : "line-clamp-2"}`}>
                      {s.subtitle}
                    </p>
                    {isLarge && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {s.tags.slice(0, 4).map((t) => (
                          <span key={t} className={`p-chip ${isDark ? "!border-white/20 !bg-white/5 !text-white" : ""}`}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden mt-6 text-center">
            <Link href="/services" className="p-btn">전체 서비스 보기</Link>
          </div>
        </div>
      </section>

      {/* ═════════ Portfolio — Magazine ═════════ */}
      <section className="p-section-dark py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="p-overline mb-3 text-[var(--c-main-l)]">PORTFOLIO</p>
              <h2 className="p-h1-xl text-white mb-4">
                숫자로 증명하는
                <br />
                프로젝트 성과.
              </h2>
              <p className="text-[16px] text-white/60 leading-[1.7] max-w-[560px]">
                {portfolio.length > 0
                  ? `총 ${portfolio.length}개의 프로젝트를 성공적으로 런칭했습니다.`
                  : "곧 새로운 프로젝트들을 공개합니다."}
              </p>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[14px] font-semibold no-underline text-white p-anim-link">
              전체 보기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {portfolio.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 mb-4">포트폴리오가 곧 업데이트됩니다.</p>
              <Link href="/contact" className="p-btn">
                <span className="text-[var(--c-text)]">첫 프로젝트 상담 신청</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
              {featured && (
                <Link href={`/portfolio/${featured.id}`} className="group no-underline block">
                  <div className="p-showcase p-showcase-wide !rounded-[16px] mb-4 relative">
                    {featured.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.thumbnail} alt={featured.title} />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1c]" />
                    )}
                    {featured.featured && (
                      <span className="absolute top-4 left-4 b-hot">FEATURED</span>
                    )}
                    <div className="absolute bottom-4 right-4 p-arrow-btn !bg-white !text-[var(--c-text)]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-[12px] text-white/60">
                    <span className="p-chip !border-white/15 !bg-white/5 !text-white/80">{featured.category || "프로젝트"}</span>
                    <span className="tnum">{fmtDate(featured.createdAt)}</span>
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-1 text-white">{featured.title}</h3>
                  <p className="text-[14px] text-white/60 line-clamp-2 max-w-[560px]">{featured.description || featured.client}</p>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-3">
                {rest.map((p) => (
                  <Link key={p.id} href={`/portfolio/${p.id}`} className="group no-underline block">
                    <div className="p-showcase !rounded-[12px] mb-2 relative bg-[#1a1a1c]">
                      {p.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                      <span>{p.category || "프로젝트"}</span>
                      <span>·</span>
                      <span className="tnum">{fmtDate(p.createdAt)}</span>
                    </div>
                    <h4 className="text-[15px] font-semibold tracking-tight text-white line-clamp-1">{p.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═════════ Process — Timeline ═════════ */}
      <section className="py-24 md:py-32 border-b border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="p-overline mb-3">HOW IT WORKS</p>
              <h2 className="p-h1-xl mb-5">
                상담부터 런칭까지,
                <br />
                단계별 진행.
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
                { n: "05", t: "유지보수", d: "런칭 후 플랜별 무상 유지보수 지원", dur: "1~6개월" },
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
              { name: "Basic", subtitle: "소규모 사업자", price: "249,000", suffix: "원~", features: ["반응형 5페이지", "기본 SEO 최적화", "1개월 유지보수", "도메인·호스팅 가이드"] },
              { name: "Professional", subtitle: "성장하는 브랜드", price: "700,000", suffix: "원~", features: ["맞춤 디자인 10P", "고급 성능 최적화", "관리자 페이지 포함", "3개월 유지보수"], featured: true },
              { name: "Enterprise", subtitle: "대규모 프로젝트", price: "상담", suffix: " 맞춤", features: ["풀 커스텀 개발", "쇼핑몰 / 웹앱 / API", "전담 PM 배정", "6개월 유지보수"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-[18px] border ${
                  plan.featured
                    ? "bg-[var(--c-text)] text-white border-[var(--c-text)]"
                    : "bg-white border-[var(--c-line)]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center h-6 px-3 rounded-full bg-white text-[var(--c-text)] text-[11px] font-bold tracking-[0.12em]">
                    MOST POPULAR
                  </span>
                )}
                <div className="mb-6">
                  <p className={`text-[12px] font-bold uppercase tracking-[0.15em] mb-1 ${plan.featured ? "text-white/70" : "text-[var(--c-main)]"}`}>
                    {plan.name}
                  </p>
                  <h3 className={`text-[22px] font-bold tracking-tight ${plan.featured ? "text-white" : "text-[var(--c-text)]"}`}>
                    {plan.subtitle}
                  </h3>
                </div>

                <div className="mb-8 flex items-baseline gap-1 nowrap">
                  <span className={`p-stat text-[44px] leading-none ${plan.featured ? "text-white" : ""}`}>{plan.price}</span>
                  <span className={`text-[14px] font-semibold ${plan.featured ? "text-white/60" : "text-[var(--c-sub)]"}`}>{plan.suffix}</span>
                </div>

                <ul className="list-none space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-[14px] ${plan.featured ? "text-white/85" : "text-[var(--c-text-2)]"}`}>
                      <svg className={`w-4 h-4 shrink-0 mt-0.5 ${plan.featured ? "text-white" : "text-[var(--c-main)]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center w-full h-12 rounded-[10px] font-bold text-[14px] no-underline transition-colors ${
                    plan.featured
                      ? "bg-white text-[var(--c-text)] hover:bg-[var(--c-bg-2)]"
                      : "bg-[var(--c-text)] text-white hover:bg-black"
                  }`}
                >
                  상담 신청
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="py-24 md:py-32 border-b border-[var(--c-line)]">
        <div className="max-w-[1080px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-14">
            <div>
              <p className="p-overline mb-3">FAQ</p>
              <h2 className="p-h1-xl mb-5">
                궁금한 점이
                <br />
                있으신가요?
              </h2>
              <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] mb-8">
                자주 묻는 질문을 모아뒀습니다.
                <br />더 궁금하신 사항은 편하게 연락 주세요.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a href="tel:010-3319-2509" className="p-btn tnum">010-3319-2509</a>
                <Link href="/contact" className="p-btn p-btn-dark">견적 문의</Link>
              </div>
            </div>

            <div className="border-t border-[var(--c-line)]">
              {[
                { q: "제작 기간은 얼마나 걸리나요?", a: "Basic 플랜 기준 1~2주 내외입니다. 자료 전달 완료 시점부터 일정이 시작되며, 실시간으로 진행 상황을 공유드립니다." },
                { q: "유지보수는 어떻게 진행되나요?", a: "플랜별 무상 유지보수 기간 동안 텍스트·이미지·간단한 기능 수정을 무료로 지원합니다. 기간 종료 후에도 건별 또는 월 단위 계약이 가능합니다." },
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

      {/* ═════════ Final CTA — big dark ═════════ */}
      <section className="p-section-dark py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-[0.08]" />
        <div className="relative max-w-[1000px] mx-auto px-5 text-center">
          <p className="p-overline mb-4 text-[var(--c-main-l)]">GET STARTED</p>
          <h2 className="p-display text-white mb-6">
            이제,
            <br />
            당신의 차례입니다.
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
