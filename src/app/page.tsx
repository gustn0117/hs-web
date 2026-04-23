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

  const featuredPortfolio = portfolio.slice(0, 6);
  const latestPortfolio = portfolio.slice(0, 10);

  return (
    <div className="bg-[var(--color-bg-alt)] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] mb-3">
          <Link href="/" className="no-underline hover:text-[var(--color-point)]">홈</Link>
          <span>›</span>
          <span>전체 안내</span>
        </div>

        {/* Top banner — refined hero */}
        <section className="bg-white border border-[var(--color-border)] rounded-md overflow-hidden mb-4 p-hero-shadow">
          {/* Notice strip with dot */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-point-soft)]">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="p-ribbon">NOTICE</span>
              <span className="text-[var(--color-point-dark)] font-semibold">홈페이지 제작 249,000원부터 · 무료 유지보수 포함</span>
              <span className="text-[var(--color-muted)] hidden sm:inline">빠른 제작 · 반응형 기본</span>
            </div>
            <Link href="/contact" className="text-[12px] text-[var(--color-point-dark)] font-bold no-underline hover:underline">
              견적 문의 →
            </Link>
          </div>

          {/* Hero body */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-0">
            <div className="px-5 py-7 md:py-9 md:px-8 relative">
              {/* Subtle accent line */}
              <div className="absolute top-0 left-0 w-12 h-0.5 bg-[var(--color-point)]" />

              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <span className="p-chip p-chip-solid">HS WEB</span>
                <span className="p-chip">Web Agency</span>
                <span className="p-chip">반응형</span>
                <span className="p-chip">SEO</span>
                <span className="p-chip">무료 유지보수</span>
              </div>

              <h1 className="p-h1-xl mb-3">
                <span className="text-[var(--color-text)]">홈페이지 제작은</span>
                <br />
                <span className="text-[var(--color-point)]">정보가 보이는 사이트</span>
                <span className="text-[var(--color-text)]">로.</span>
              </h1>

              <p className="text-[13.5px] text-[var(--color-text-2)] leading-[1.75] mb-6 max-w-[560px]">
                한국형 포털 UI 기반으로 설계합니다. 기획부터 디자인, 개발, 유지보수까지
                <span className="font-semibold text-[var(--color-text)]"> 원스톱</span>으로 제공하며,
                <span className="font-semibold text-[var(--color-text)]"> 합리적 가격</span>과
                <span className="font-semibold text-[var(--color-text)]"> 빠른 납기</span>로
                작은 사업자부터 대형 프로젝트까지 대응합니다.
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/contact" className="p-btn p-btn-point p-btn-lg no-underline">
                  무료 상담 신청
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="/portfolio" className="p-btn p-btn-lg no-underline">포트폴리오 보기</Link>
                <a href="tel:010-3319-2509" className="hidden sm:inline-flex p-btn p-btn-lg p-btn-ghost tnum no-underline">
                  <svg className="w-3.5 h-3.5 text-[var(--color-point)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  010-3319-2509
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-7 pt-5 border-t border-[var(--color-border-soft)] flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-[var(--color-muted)]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[var(--color-point)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  소스코드 100% 제공
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[var(--color-point)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  전자계약 체결
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[var(--color-point)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  SSL · SEO 기본 적용
                </span>
              </div>
            </div>

            {/* Stats panel */}
            <div className="border-l-0 md:border-l border-t md:border-t-0 border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-alt)] to-white">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-white">
                <p className="text-[11px] font-bold text-[var(--color-muted)] tracking-widest uppercase">AT A GLANCE</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1">
                <StatCell label="기본 제작가" value="249,000" suffix="원~" />
                <StatCell label="평균 제작기간" value="1~2" suffix="주" />
                <StatCell label="유지보수" value="무상" suffix=" 1개월~" />
                <StatCell label="반응형 적용" value="100" suffix="%" />
              </div>
            </div>
          </div>
        </section>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-4">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block space-y-4">
            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>카테고리</h2>
              </div>
              <ul className="list-none">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="flex items-center justify-between px-4 h-9 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]"
                    >
                      {s.title}
                      <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>바로가기</h2>
              </div>
              <ul className="list-none">
                <QuickLink href="/pricing" label="가격 안내" />
                <QuickLink href="/process" label="제작 과정" />
                <QuickLink href="/domain-hosting" label="도메인·호스팅" />
                <QuickLink href="/contact" label="견적 문의" point />
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="space-y-4 min-w-0">
            {/* Services — dense list */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>제공 서비스</h2>
                <Link href="/services" className="more">전체 보기 →</Link>
              </div>
              <div>
                {services.map((s, i) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="p-row no-underline text-[var(--color-text)]"
                  >
                    <span className="w-6 text-[11px] text-[var(--color-muted)] tnum text-center">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{s.title}</span>
                        {s.tags.slice(0, 2).map((t) => (
                          <span key={t} className="p-chip">{t}</span>
                        ))}
                      </div>
                      <p className="text-[12px] text-[var(--color-muted)] mt-0.5 truncate">{s.subtitle}</p>
                    </div>
                    <span className="hidden md:inline text-[12px] text-[var(--color-text-2)] tnum shrink-0">{s.metric}</span>
                    <svg className="w-3.5 h-3.5 text-[var(--color-muted-2)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>

            {/* Portfolio — compact rows */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>최근 작업물</h2>
                <Link href="/portfolio" className="more">전체 보기 →</Link>
              </div>

              {latestPortfolio.length === 0 ? (
                <div className="p-4">
                  <div className="p-empty">
                    포트폴리오가 곧 업데이트됩니다. <Link href="/contact" className="text-[var(--color-point)] font-semibold">견적 문의하기</Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="hidden md:grid grid-cols-[40px_70px_1fr_120px_80px_70px] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                    <span className="text-center">번호</span>
                    <span>분류</span>
                    <span>프로젝트명</span>
                    <span>클라이언트</span>
                    <span className="text-right">등록일</span>
                    <span className="text-center">상세</span>
                  </div>
                  {latestPortfolio.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/portfolio/${p.id}`}
                      className="md:grid md:grid-cols-[40px_70px_1fr_120px_80px_70px] flex items-center gap-2 px-4 py-2.5 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
                    >
                      <span className="hidden md:inline text-center text-[11px] text-[var(--color-muted)] tnum">{String(i + 1).padStart(2, "0")}</span>
                      <span className="hidden md:inline"><span className="p-chip">{p.category || "기타"}</span></span>
                      <span className="font-semibold truncate flex-1 min-w-0">
                        {p.title}
                        {p.featured && <span className="ml-1.5 p-chip p-chip-point">HOT</span>}
                      </span>
                      <span className="hidden md:inline text-[12px] text-[var(--color-text-2)] truncate">{p.client || "-"}</span>
                      <span className="hidden md:inline text-right text-[11px] text-[var(--color-muted)] tnum">{fmtDate(p.createdAt)}</span>
                      <span className="hidden md:inline text-center text-[12px] text-[var(--color-point)]">보기 →</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Featured 2-col strip */}
            {featuredPortfolio.length > 0 && (
              <section className="border border-[var(--color-border)] bg-white">
                <div className="p-section-head">
                  <h2>추천 프로젝트</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--color-border)]">
                  {featuredPortfolio.slice(0, 6).map((p) => (
                    <Link
                      key={p.id}
                      href={`/portfolio/${p.id}`}
                      className="bg-white p-3 no-underline hover:bg-[var(--color-bg-alt)]"
                    >
                      <div className="aspect-[4/3] bg-[var(--color-bg-alt)] border border-[var(--color-border)] mb-2 overflow-hidden">
                        {p.thumbnail && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="p-chip">{p.category || "기타"}</span>
                      </div>
                      <p className="text-[12px] font-semibold text-[var(--color-text)] truncate">{p.title}</p>
                      <p className="text-[11px] text-[var(--color-muted)] truncate">{p.client || "-"}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Pricing table */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>가격 안내</h2>
                <Link href="/pricing" className="more">상세 안내 →</Link>
              </div>
              <table className="p-table">
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>플랜</th>
                    <th>설명</th>
                    <th style={{ width: "130px" }} className="text-right">가격</th>
                    <th style={{ width: "90px" }} className="text-center">문의</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold">Basic</td>
                    <td className="text-[var(--color-text-2)]">반응형 5페이지 · 기본 최적화 · 1개월 무상 유지보수</td>
                    <td className="text-right font-bold tnum">249,000원~</td>
                    <td className="text-center">
                      <Link href="/contact" className="text-[12px] text-[var(--color-point)] font-semibold no-underline">신청</Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">
                      Professional
                      <span className="ml-1 p-chip p-chip-point">인기</span>
                    </td>
                    <td className="text-[var(--color-text-2)]">맞춤 디자인 10페이지 · 관리자 페이지 · 3개월 무상 유지보수</td>
                    <td className="text-right font-bold tnum">700,000원~</td>
                    <td className="text-center">
                      <Link href="/contact" className="text-[12px] text-[var(--color-point)] font-semibold no-underline">신청</Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Enterprise</td>
                    <td className="text-[var(--color-text-2)]">풀 커스텀 · 쇼핑몰/웹앱 · 전담 PM · 6개월 무상 유지보수</td>
                    <td className="text-right font-bold text-[var(--color-text-2)]">상담 후 견적</td>
                    <td className="text-center">
                      <Link href="/contact" className="text-[12px] text-[var(--color-point)] font-semibold no-underline">문의</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Process */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>제작 과정</h2>
                <Link href="/process" className="more">상세 보기 →</Link>
              </div>
              <ol className="list-none">
                {[
                  { n: "01", t: "상담·기획", d: "요구사항 파악 및 프로젝트 범위 확정" },
                  { n: "02", t: "디자인", d: "브랜드에 맞는 UI/UX 설계 및 시안 제작" },
                  { n: "03", t: "개발", d: "반응형 퍼블리싱 및 기능 구현" },
                  { n: "04", t: "테스트·런칭", d: "QA 후 도메인 연결 및 배포" },
                  { n: "05", t: "유지보수", d: "런칭 후 무상 유지보수 지원" },
                ].map((step) => (
                  <li key={step.n} className="p-row">
                    <span className="w-8 text-[12px] font-bold text-[var(--color-point)] tnum">{step.n}</span>
                    <span className="font-semibold w-24">{step.t}</span>
                    <span className="flex-1 text-[12px] text-[var(--color-text-2)] truncate">{step.d}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>자주 묻는 질문</h2>
              </div>
              <div>
                {[
                  { q: "제작 기간은 얼마나 걸리나요?", a: "프로젝트 규모에 따라 다르지만 Basic 플랜 기준 1~2주 내외입니다. 자료 전달이 완료된 시점부터 일정이 시작됩니다." },
                  { q: "유지보수는 어떻게 진행되나요?", a: "플랜별 무상 유지보수 기간 동안 텍스트, 이미지, 간단한 기능 수정을 무료로 지원합니다." },
                  { q: "도메인과 호스팅도 제공되나요?", a: "도메인/호스팅은 고객사 명의로 개설하며 HS WEB이 실비 기준으로 대행·관리합니다." },
                  { q: "수정은 몇 번까지 가능한가요?", a: "시안 단계에서 2~3회 수정을 기본 제공하며, 이후 변경은 범위에 따라 추가 상담 후 진행합니다." },
                ].map((item, i) => (
                  <details key={i} className="border-b border-[var(--color-border)] last:border-b-0">
                    <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-[var(--color-bg-alt)]">
                      <span className="text-[12px] font-bold text-[var(--color-point)] tnum">Q{i + 1}</span>
                      <span className="text-[13px] font-semibold flex-1">{item.q}</span>
                      <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-3 pl-[52px] text-[12px] text-[var(--color-text-2)] leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Contact CTA strip */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4">
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-text)] mb-0.5">지금 바로 문의하세요</p>
                  <p className="text-[12px] text-[var(--color-muted)]">영업시간 내 1시간 이내 회신 · 무료 상담</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a href="tel:010-3319-2509" className="p-btn tnum no-underline">010-3319-2509</a>
                  <Link href="/contact" className="p-btn p-btn-point no-underline">견적 상담</Link>
                </div>
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block space-y-4">
            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>빠른 견적</h2>
              </div>
              <div className="p-4">
                <p className="text-[12px] text-[var(--color-text-2)] mb-3 leading-relaxed">
                  필요한 정보만 입력하면 <strong className="text-[var(--color-point)]">24시간 내 회신</strong>해드립니다.
                </p>
                <Link href="/contact" className="p-btn p-btn-point w-full no-underline">상담 신청</Link>
                <div className="mt-3 pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted)] space-y-1">
                  <div className="flex justify-between"><span>전화</span><span className="tnum text-[var(--color-text-2)]">010-3319-2509</span></div>
                  <div className="flex justify-between"><span>운영</span><span className="text-[var(--color-text-2)]">평일 10~19시</span></div>
                </div>
              </div>
            </div>

            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>최근 공지</h2>
              </div>
              <ul className="list-none text-[12px]">
                <li className="flex items-center justify-between px-3 h-8 border-b border-[var(--color-border)]">
                  <span className="truncate text-[var(--color-text-2)]">Basic 플랜 가격 개편</span>
                  <span className="tnum text-[var(--color-muted)] ml-2 shrink-0">04.10</span>
                </li>
                <li className="flex items-center justify-between px-3 h-8 border-b border-[var(--color-border)]">
                  <span className="truncate text-[var(--color-text-2)]">도메인·호스팅 안내 페이지 오픈</span>
                  <span className="tnum text-[var(--color-muted)] ml-2 shrink-0">04.05</span>
                </li>
                <li className="flex items-center justify-between px-3 h-8">
                  <span className="truncate text-[var(--color-text-2)]">포트폴리오 업데이트</span>
                  <span className="tnum text-[var(--color-muted)] ml-2 shrink-0">03.28</span>
                </li>
              </ul>
            </div>

            <div className="border border-[var(--color-border)] bg-[var(--color-point-bg)]">
              <div className="p-3">
                <p className="text-[11px] font-semibold text-[var(--color-point-dark)] mb-1">이벤트</p>
                <p className="text-[12px] text-[var(--color-text)] leading-relaxed mb-2">
                  신규 프로젝트 <strong>최대 10% 할인</strong>
                </p>
                <Link href="/contact" className="text-[11px] font-semibold text-[var(--color-point-dark)] no-underline hover:underline">자세히 →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="px-5 py-3.5 border-b border-[var(--color-border-soft)] last:border-b-0 md:border-b md:[&:last-child]:border-b-0 group">
      <p className="text-[10.5px] font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-[20px] p-stat leading-none">
        <span className="text-[var(--color-text)]">{value}</span>
        <span className="text-[12px] font-semibold text-[var(--color-point)] ml-0.5">{suffix}</span>
      </p>
    </div>
  );
}

function QuickLink({ href, label, point }: { href: string; label: string; point?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center justify-between px-4 h-9 text-[13px] no-underline border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)] ${
          point ? "text-[var(--color-point)] font-semibold" : "text-[var(--color-text)]"
        }`}
      >
        {label}
        <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
      </Link>
    </li>
  );
}
