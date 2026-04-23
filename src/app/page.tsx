import Link from "next/link";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";
import { services } from "@/lib/services";

export const revalidate = 60;

function fmtDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function Home() {
  let portfolio: PortfolioItem[] = [];
  try {
    portfolio = await getPortfolioItems();
  } catch {
    /* build-time fallback */
  }

  const latestPortfolio = portfolio.slice(0, 6);

  return (
    <>
      {/* ═════════ HERO — Toss-like bold ═════════ */}
      <section className="p-bg-hero">
        <div className="max-w-[1200px] mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-chip p-chip-solid">2026 업데이트</span>
            <span className="text-[13px] text-[var(--c-sub)]">홈페이지 제작 249,000원부터</span>
          </div>

          <h1 className="p-h1-2xl max-w-[840px] mb-6">
            비즈니스의 시작은<br />
            <span className="gradient-text">제대로 된 홈페이지</span>부터.
          </h1>

          <p className="text-[17px] md:text-[19px] text-[var(--c-text-2)] max-w-[580px] leading-[1.6] mb-10">
            기획부터 디자인, 개발, 유지보수까지.<br />
            원스톱으로 제공하는 홈페이지 제작 전문 웹에이전시.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/contact" className="p-btn p-btn-dark p-btn-xl">
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/portfolio" className="p-btn p-btn-xl">포트폴리오 보기</Link>
          </div>

          {/* Stats pill bar */}
          <div className="mt-16 inline-flex flex-wrap items-stretch gap-0 bg-white border border-[var(--c-line)] rounded-[16px] overflow-hidden p-card-elevated">
            {[
              { label: "제작 시작가", value: "249,000", suffix: "원" },
              { label: "평균 제작 기간", value: "1~2", suffix: "주" },
              { label: "무상 유지보수", value: "1", suffix: "개월+" },
              { label: "반응형 적용", value: "100", suffix: "%" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-4 ${i !== 0 ? "border-l border-[var(--c-line)]" : ""}`}
              >
                <p className="text-[11px] text-[var(--c-sub)] font-medium mb-1">{s.label}</p>
                <p className="p-stat text-[22px] leading-none">
                  <span>{s.value}</span>
                  <span className="text-[13px] text-[var(--c-sub)] ml-0.5">{s.suffix}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ SERVICES — Modern grid ═════════ */}
      <section className="py-20 md:py-28 border-t border-[var(--c-line)]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[13px] font-semibold text-[var(--c-main)] mb-2">Services</p>
              <h2 className="p-h1-xl">제공하는 서비스</h2>
            </div>
            <Link href="/services" className="p-btn hidden md:inline-flex">전체 보기</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="p-card p-lift p-6 no-underline group relative block"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-[10px] bg-[var(--c-bg-2)] flex items-center justify-center group-hover:bg-[var(--c-main)] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} />
                    </svg>
                  </div>
                  <span className="text-[12px] text-[var(--c-sub-2)] font-mono tnum">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[17px] font-bold text-[var(--c-text)] mb-1.5 tracking-tight">{s.title}</h3>
                <p className="text-[13px] text-[var(--c-sub)] leading-[1.6] mb-4 line-clamp-2">{s.subtitle}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.tags.slice(0, 2).map((t) => (
                    <span key={t} className="p-chip">{t}</span>
                  ))}
                </div>
                <div className="flex items-center text-[13px] text-[var(--c-main)] font-semibold">
                  자세히 보기
                  <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ PORTFOLIO — Magazine grid ═════════ */}
      <section className="py-20 md:py-28 bg-[var(--c-bg-1)] border-t border-[var(--c-line)]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[13px] font-semibold text-[var(--c-main)] mb-2">Portfolio</p>
              <h2 className="p-h1-xl">최근 작업물</h2>
            </div>
            <Link href="/portfolio" className="p-btn hidden md:inline-flex">전체 보기</Link>
          </div>

          {latestPortfolio.length === 0 ? (
            <div className="p-empty">
              포트폴리오가 곧 업데이트됩니다.{" "}
              <Link href="/contact" className="p-link">견적 문의하기</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestPortfolio.map((p) => (
                <Link
                  key={p.id}
                  href={`/portfolio/${p.id}`}
                  className="group no-underline block"
                >
                  <div className="aspect-[4/3] bg-[var(--c-bg-2)] border border-[var(--c-line)] rounded-[12px] overflow-hidden mb-3 relative">
                    {p.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--c-sub-2)] text-[12px]">no image</div>
                    )}
                    {p.featured && (
                      <span className="absolute top-3 left-3 b-hot">HOT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="p-chip">{p.category || "기타"}</span>
                    <span className="text-[11px] text-[var(--c-sub-2)] tnum">{fmtDate(p.createdAt)}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[var(--c-text)] mb-0.5 tracking-tight line-clamp-1 group-hover:text-[var(--c-main)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-[var(--c-sub)] line-clamp-1">{p.client || "-"}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════ PRICING — Simple 3 col ═════════ */}
      <section className="py-20 md:py-28 border-t border-[var(--c-line)]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[13px] font-semibold text-[var(--c-main)] mb-2">Pricing</p>
            <h2 className="p-h1-xl mb-3">합리적인 가격</h2>
            <p className="text-[15px] text-[var(--c-sub)]">프로젝트 규모에 맞춰 선택하세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Basic",
                subtitle: "소규모 사업자",
                price: "249,000",
                suffix: "원~",
                features: ["반응형 5페이지", "기본 최적화", "1개월 유지보수", "도메인·호스팅 가이드"],
              },
              {
                name: "Professional",
                subtitle: "성장하는 브랜드",
                price: "700,000",
                suffix: "원~",
                features: ["맞춤 디자인 10P", "고급 성능 최적화", "관리자 페이지", "3개월 유지보수"],
                featured: true,
              },
              {
                name: "Enterprise",
                subtitle: "대규모 프로젝트",
                price: "상담",
                suffix: " 맞춤 견적",
                features: ["풀 커스텀 개발", "쇼핑몰 / 웹앱", "전담 PM 배정", "6개월 유지보수"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-7 rounded-[14px] border ${
                  plan.featured
                    ? "bg-[var(--c-text)] text-white border-[var(--c-text)]"
                    : "bg-white border-[var(--c-line)]"
                } relative`}
              >
                {plan.featured && (
                  <span className="absolute top-4 right-4 inline-flex items-center h-5 px-2 rounded-full bg-white text-[var(--c-text)] text-[10.5px] font-bold tracking-wider">
                    MOST POPULAR
                  </span>
                )}
                <p className={`text-[12px] font-semibold uppercase tracking-wider mb-1 ${plan.featured ? "text-white/70" : "text-[var(--c-sub)]"}`}>
                  {plan.name}
                </p>
                <h3 className={`text-[18px] font-bold mb-5 ${plan.featured ? "text-white" : "text-[var(--c-text)]"}`}>
                  {plan.subtitle}
                </h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className={`p-stat text-[36px] leading-none ${plan.featured ? "text-white" : ""}`}>{plan.price}</span>
                  <span className={`text-[13px] font-medium ${plan.featured ? "text-white/70" : "text-[var(--c-sub)]"}`}>{plan.suffix}</span>
                </div>
                <ul className="list-none space-y-2.5 mb-7">
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
                  className={`inline-flex items-center justify-center w-full h-11 rounded-[10px] font-semibold text-[14px] no-underline transition-colors ${
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

      {/* ═════════ PROCESS — Horizontal steps ═════════ */}
      <section className="py-20 md:py-28 bg-[var(--c-bg-1)] border-t border-[var(--c-line)]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="mb-12">
            <p className="text-[13px] font-semibold text-[var(--c-main)] mb-2">Process</p>
            <h2 className="p-h1-xl mb-3">상담부터 런칭까지</h2>
            <p className="text-[15px] text-[var(--c-sub)]">체계적인 5단계 프로세스로 진행합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { n: "01", t: "상담 · 기획", d: "요구사항 파악 및 프로젝트 범위 확정" },
              { n: "02", t: "디자인", d: "브랜드에 맞는 UI/UX 시안 제작" },
              { n: "03", t: "개발", d: "반응형 퍼블리싱 및 기능 구현" },
              { n: "04", t: "테스트·런칭", d: "QA 후 도메인 연결 및 배포" },
              { n: "05", t: "유지보수", d: "런칭 후 무상 유지보수 지원" },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                <div className="text-[40px] font-black tracking-tight text-[var(--c-main)] leading-none mb-3">{step.n}</div>
                <h4 className="text-[15px] font-bold mb-1.5 tracking-tight">{step.t}</h4>
                <p className="text-[13px] text-[var(--c-sub)] leading-[1.6]">{step.d}</p>
                {i < 4 && (
                  <svg className="hidden md:block absolute top-3 right-[-10px] w-4 h-4 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ FAQ + CTA ═════════ */}
      <section className="py-20 md:py-28 border-t border-[var(--c-line)]">
        <div className="max-w-[1000px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10">
            <div>
              <p className="text-[13px] font-semibold text-[var(--c-main)] mb-2">FAQ</p>
              <h2 className="p-h1-xl mb-5">자주 묻는 질문</h2>
              <p className="text-[15px] text-[var(--c-sub)] leading-[1.7] mb-7">
                더 궁금하신 사항은 전화 또는 견적 문의를 통해 답변드립니다.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a href="tel:010-3319-2509" className="p-btn tnum">010-3319-2509</a>
                <Link href="/contact" className="p-btn p-btn-dark">견적 문의</Link>
              </div>
            </div>

            <div className="space-y-0 border-t border-[var(--c-line)]">
              {[
                { q: "제작 기간은 얼마나 걸리나요?", a: "Basic 플랜 기준 1~2주 내외입니다. 자료 전달 완료 시점부터 일정이 시작됩니다." },
                { q: "유지보수는 어떻게 진행되나요?", a: "플랜별 무상 유지보수 기간 동안 텍스트, 이미지, 간단한 기능 수정을 무료로 지원합니다." },
                { q: "도메인과 호스팅도 제공되나요?", a: "도메인/호스팅은 고객사 명의로 개설하며 HS WEB이 실비 기준으로 대행·관리합니다." },
                { q: "수정은 몇 번까지 가능한가요?", a: "시안 단계에서 2~3회 수정을 기본 제공하며, 이후 변경은 범위에 따라 추가 상담 후 진행합니다." },
              ].map((item, i) => (
                <details key={i} className="border-b border-[var(--c-line)] group">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                    <span className="text-[15px] font-semibold text-[var(--c-text)] pr-4">{item.q}</span>
                    <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="pb-5 text-[14px] text-[var(--c-sub)] leading-[1.75]">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Closing CTA ═════════ */}
      <section className="bg-[var(--c-text)] text-white py-20">
        <div className="max-w-[1000px] mx-auto px-5 text-center">
          <h2 className="p-h1-xl text-white mb-4">
            지금 시작하세요.
          </h2>
          <p className="text-[16px] text-white/70 mb-8 max-w-[480px] mx-auto">
            첫 상담은 무료입니다. 어떤 프로젝트든 편하게 문의해주세요.
          </p>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-[12px] bg-white text-[var(--c-text)] font-bold text-[15px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="tel:010-3319-2509"
              className="inline-flex items-center gap-2 h-14 px-6 rounded-[12px] text-white font-semibold text-[15px] no-underline hover:bg-white/10 transition-colors tnum"
            >
              010-3319-2509
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
