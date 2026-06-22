import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";
import {
  CustomBuildIllustration,
  PlatformBoxIllustration,
  ScalesIllustration,
  OwnershipKey,
} from "./Illustrations";

export const metadata: Metadata = {
  title: "자체 개발 vs 플랫폼 - 왜 직접 코딩으로 만드는가",
  description:
    "자체 개발(코딩)과 플랫폼 솔루션(카페24·윅스·식스샵·워드프레스)의 차이와 장단점. HS WEB이 자체 개발을 고집하는 이유와 비즈니스에 미치는 영향을 정리했습니다.",
  keywords: [
    "자체 개발",
    "코딩 홈페이지 제작",
    "플랫폼 vs 코딩",
    "카페24 vs 자체개발",
    "윅스 vs 코딩",
    "워드프레스 vs 코딩",
    "맞춤형 웹사이트",
    "노코드 vs 코딩",
  ],
  alternates: { canonical: "https://hsweb.pics/custom-development" },
};

export default function CustomDevelopmentPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "자체 개발 vs 플랫폼" }]}
      overline="CUSTOM BUILD"
      title="자체 개발과 플랫폼, 무엇이 다를까요?"
      subtitle="기성 플랫폼(카페24·윅스·워드프레스)과 직접 코딩으로 만드는 자체 개발의 차이를 한 번에 정리했습니다."
      stats={[
        { label: "맞춤 제어", value: "100", suffix: "%" },
        { label: "월 구독료", value: "0", suffix: "원" },
        { label: "소스코드 소유", value: "100", suffix: "% 이전" },
        { label: "락인", value: "없음", suffix: "" },
      ]}
    >
      {/* Concept comparison */}
      <Section overline="CONCEPT" title="두 가지 방식, 어떻게 다른가" subtitle="홈페이지를 만드는 방식은 크게 두 가지입니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom build */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-gradient-to-br from-white to-[var(--c-main-bg)] overflow-hidden group hover:border-[var(--c-main)] transition-colors">
            <div className="relative z-[1]">
              <div className="flex items-center gap-2 mb-5">
                <span className="p-chip p-chip-point">방식 · 직접 코딩</span>
                <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">CUSTOM</span>
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">자체 개발 (코딩)</h3>
              <p className="text-[14px] text-[var(--c-text-2)] leading-[1.7] mb-6">
                Next.js·React 같은 최신 기술로 처음부터 직접 코딩해 만드는 방식.
                <br />
                기능과 디자인 모두 비즈니스에 맞춰 0부터 설계합니다.
              </p>

              <div className="my-6 -mx-2">
                <CustomBuildIllustration />
              </div>

              <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">예시</span>
                  <span className="font-semibold">HS WEB · 토스 · 당근마켓</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">초기 비용</span>
                  <span className="font-semibold tnum">상대적 높음</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">월 비용</span>
                  <span className="font-semibold text-emerald-700 tnum">없음 (호스팅 실비만)</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">맞춤 자유도</span>
                  <span className="font-semibold text-[var(--c-main)]">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-gradient-to-br from-white to-slate-50 overflow-hidden group hover:border-slate-400 transition-colors">
            <div className="relative z-[1]">
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">방식 · 기성 솔루션</span>
                <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">PLATFORM</span>
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">플랫폼 (서비스)</h3>
              <p className="text-[14px] text-[var(--c-text-2)] leading-[1.7] mb-6">
                카페24·윅스·식스샵·워드프레스처럼 기성 플랫폼 위에서
                <br />
                템플릿을 고르고 일부 수정해 사용하는 방식.
              </p>

              <div className="my-6 -mx-2">
                <PlatformBoxIllustration />
              </div>

              <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">예시</span>
                  <span className="font-semibold">카페24 · 윅스 · 워드프레스</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">초기 비용</span>
                  <span className="font-semibold tnum">상대적 낮음</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">월 비용</span>
                  <span className="font-semibold text-amber-700 tnum">월 구독료 지속</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--c-sub)]">맞춤 자유도</span>
                  <span className="font-semibold text-slate-600">제한적</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Detailed comparison table */}
      <Section overline="COMPARE" title="항목별 비교" subtitle="비즈니스에 직접 영향을 주는 8가지 기준으로 정리했습니다.">
        <div className="hidden md:block bg-gradient-to-br from-white to-[var(--c-main-bg)] rounded-[16px] border border-[var(--c-line)] p-4 md:p-6 mb-4">
          <ScalesIllustration />
        </div>

        <div className="p-card overflow-hidden overflow-x-auto">
          <table className="p-table md:min-w-[680px]">
            <thead>
              <tr>
                <th>항목</th>
                <th className="!text-center">자체 개발</th>
                <th className="!text-center">플랫폼</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  k: "초기 비용",
                  c: "상대적 높음 (1회성)",
                  p: "낮음 (시작은 저렴)",
                  cWin: false,
                  pWin: true,
                },
                {
                  k: "장기 비용 (3년+)",
                  c: "총 비용 낮음",
                  p: "월 구독료 누적",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "디자인·기능 자유도",
                  c: "100% 맞춤 가능",
                  p: "템플릿 범위 내 제한",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "성능 · 로딩 속도",
                  c: "최적화 가능 (LCP < 2s)",
                  p: "공통 코드로 무거움",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "SEO · 검색 노출",
                  c: "메타·구조·속도 완전 제어",
                  p: "플랫폼 정책 의존",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "확장성",
                  c: "API 연동·기능 추가 자유",
                  p: "플랜 업그레이드 또는 불가",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "소유권 · 이전",
                  c: "소스코드 100% 이전",
                  p: "플랫폼 종속 (락인)",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "유지보수 의존도",
                  c: "개발자 직접 수정",
                  p: "플랫폼 정책 변경에 영향",
                  cWin: true,
                  pWin: false,
                },
                {
                  k: "런칭 속도",
                  c: "1~4주 (제작 기간 필요)",
                  p: "당일~며칠 (즉시 시작)",
                  cWin: false,
                  pWin: true,
                },
                {
                  k: "보안 · 데이터",
                  c: "자체 통제, 책임 분리",
                  p: "플랫폼 정책에 위임",
                  cWin: true,
                  pWin: false,
                },
              ].map((row) => (
                <tr key={row.k}>
                  <td className="font-semibold">{row.k}</td>
                  <td className={`text-center ${row.cWin ? "font-semibold text-[var(--c-main)] bg-[var(--c-main-bg)]" : "text-[var(--c-text-2)]"}`}>
                    {row.cWin && <span className="mr-1">●</span>}
                    {row.c}
                  </td>
                  <td className={`text-center ${row.pWin ? "font-semibold text-amber-700 bg-amber-50/50" : "text-[var(--c-text-2)]"}`}>
                    {row.pWin && <span className="mr-1">●</span>}
                    {row.p}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Why HS WEB chooses custom */}
      <Section overline="WHY HS WEB" title="우리는 왜 자체 개발만 하는가" subtitle="플랫폼이 빠르고 저렴해 보이지만, 비즈니스 성장에 핵심이 되는 5가지를 양보할 수 없기 때문입니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              t: "검색 노출은 코드의 자유에서 나온다",
              d: "Lighthouse·Core Web Vitals·구조화 데이터를 직접 제어할 수 있어야 검색 상위가 가능합니다. 플랫폼은 공통 코드 위에 얹혀 한계가 분명합니다.",
              tag: "SEO · 성능",
            },
            {
              t: "월 구독료가 사라진다",
              d: "플랫폼은 5년 누적 시 자체 개발 비용을 추월합니다. 자체 개발은 1회 투자 + 호스팅 실비만으로 운영됩니다.",
              tag: "장기 비용",
            },
            {
              t: "소스코드는 고객의 자산",
              d: "납품 후 소스코드 100% 이전. 다른 개발자에게 맡기든, 사내에서 운영하든 자유롭게 옮길 수 있습니다. 플랫폼 종속(lock-in) 없음.",
              tag: "소유권",
            },
            {
              t: "기능 추가에 한계가 없다",
              d: "결제 게이트웨이·API 연동·맞춤 관리자 등 비즈니스가 자라는 만큼 기능을 더할 수 있습니다. 플랫폼은 정책이 허용하는 범위 안에서만 가능합니다.",
              tag: "확장성",
            },
            {
              t: "디자인이 브랜드의 차별점",
              d: "템플릿 변형으로는 차별화에 한계가 있습니다. 자체 개발은 0부터 브랜드에 맞춰 인터랙션·타이포·레이아웃을 설계할 수 있습니다.",
              tag: "브랜드",
            },
            {
              t: "장애·보안 책임이 명확하다",
              d: "플랫폼 장애 시 통제가 불가능합니다. 자체 개발 + 직접 호스팅(또는 검증된 호스팅 사용)은 장애 대응과 데이터 통제를 사용자가 직접 결정합니다.",
              tag: "안정성",
            },
          ].map((p, i) => (
            <div key={p.t} className="relative p-7 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-main)] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-[var(--c-main)] tracking-widest tnum">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 h-px bg-[var(--c-line)]" />
                <span className="p-chip">{p.tag}</span>
              </div>
              <h3 className="text-[18px] md:text-[19px] font-bold tracking-tight mb-2">{p.t}</h3>
              <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.75]">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Scenarios */}
      <Section overline="SCENARIOS" title="어떤 경우 자체 개발이 맞나요?" subtitle="모든 프로젝트가 자체 개발일 필요는 없습니다. 아래 조건 중 하나라도 해당하면 자체 개발을 권장합니다.">
        <div className="space-y-3">
          {[
            {
              title: "검색 유입이 핵심 채널일 때",
              desc: "Google·네이버 상위 노출이 매출과 직결되는 경우. 플랫폼은 SEO 한계가 명확합니다.",
              good: true,
            },
            {
              title: "독자적인 기능·UI가 필요할 때",
              desc: "결제·예약·맞춤 관리자·API 연동 등 템플릿으로 해결되지 않는 기능이 있는 경우.",
              good: true,
            },
            {
              title: "장기 운영 (3년 이상) 계획일 때",
              desc: "월 구독료 누적이 자체 개발 비용을 초과하는 시점부터는 자체 개발이 비용에서도 유리합니다.",
              good: true,
            },
            {
              title: "브랜드가 비즈니스 가치의 핵심일 때",
              desc: "디자인 차별화가 사업 성공에 직접 영향. 템플릿 변형으로는 도달하기 어려운 영역입니다.",
              good: true,
            },
            {
              title: "단발성 이벤트/임시 페이지일 때",
              desc: "1~3개월만 쓸 페이지라면 플랫폼이 더 빠르고 저렴할 수 있습니다.",
              good: false,
            },
          ].map((s) => (
            <div key={s.title} className="flex items-start gap-4 p-5 md:p-6 rounded-[12px] border border-[var(--c-line)] bg-white">
              <span className={`shrink-0 inline-flex items-center h-7 px-3 rounded-full text-[11px] font-bold tracking-wide ${s.good ? "bg-[var(--c-new-bg)] text-[var(--c-new)] border border-[var(--c-new)]/20" : "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                {s.good ? "자체 개발 권장" : "플랫폼 가능"}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-[var(--c-text)] mb-1">{s.title}</h4>
                <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.7]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HS WEB CTA — dark card with key illustration */}
      <Section overline="HS WEB" title="자체 개발만 합니다.">
        <div className="p-8 md:p-10 rounded-[16px] bg-[var(--c-text)] text-white overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-[0.06]" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-3">
                플랫폼이 아닌, 코드로.
              </h3>
              <p className="text-[14px] text-white/70 leading-[1.75] max-w-[620px]">
                HS WEB의 모든 프로젝트는 <strong className="text-white">Next.js · React · TypeScript</strong>로 처음부터 직접 코딩합니다.
                <br />
                완성 후 <strong className="text-white">소스코드 100% 이전</strong>, 월 구독료 없이 호스팅 실비만으로 운영됩니다.
              </p>
              <div className="flex flex-wrap gap-2 mt-5 mb-6">
                {["Next.js", "React", "TypeScript", "Tailwind", "Supabase", "Cloudflare"].map((t) => (
                  <span key={t} className="inline-flex items-center h-7 px-3 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/contact" className="inline-flex items-center justify-center h-12 px-6 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors">
                  상담 신청
                </Link>
                <Link href="/portfolio" className="inline-flex items-center justify-center h-12 px-6 rounded-[10px] border border-white/20 text-white font-semibold text-[14px] no-underline hover:bg-white/5 transition-colors">
                  포트폴리오 보기
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <OwnershipKey />
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {[
            {
              q: "플랫폼이 더 빠르고 저렴하지 않나요?",
              a: "단기적으로는 그렇습니다. 1~3개월짜리 임시 페이지라면 플랫폼이 적합합니다. 다만 3년 이상 운영하면 월 구독료 누적이 자체 개발 비용을 추월하고, 검색 노출·브랜드 디자인·확장성에서 한계가 명확해집니다.",
            },
            {
              q: "워드프레스도 코딩 아닌가요?",
              a: "워드프레스는 PHP 기반의 CMS로, 플러그인 조합 방식입니다. 자체 개발은 Next.js·React 같은 최신 프레임워크로 처음부터 직접 코딩하는 방식이라, 성능·SEO·보안에서 본질적인 차이가 있습니다.",
            },
            {
              q: "자체 개발하면 운영도 어렵지 않나요?",
              a: "HS WEB은 관리자 페이지를 함께 제작해 콘텐츠 수정·이미지 교체·게시물 관리는 비개발자도 직접 할 수 있습니다. 코드 수정이 필요한 작업만 의뢰하시면 됩니다. 간단한 텍스트·이미지 수정은 평생 무료로 지원합니다.",
            },
            {
              q: "기존 플랫폼 사이트를 자체 개발로 옮길 수 있나요?",
              a: "물론입니다. 콘텐츠와 디자인을 새 코드 기반으로 옮기고, 기존 URL은 301 리다이렉트로 SEO 자산을 보존합니다. 마이그레이션 사례를 보고 싶으시면 상담 시 사례를 공유해드립니다.",
            },
            {
              q: "결제·쇼핑몰 기능도 자체 개발이 가능한가요?",
              a: "네. PG 결제 연동(이니시스·KCP·토스페이먼츠 등), 회원/주문/배송 관리, 재고 관리 모두 자체 개발로 구축 가능합니다. 카페24 같은 쇼핑몰 플랫폼의 한계 없이 비즈니스에 맞춰 설계할 수 있습니다.",
            },
          ].map((faq, i) => (
            <details key={i} className="border-b border-[var(--c-line)] group">
              <summary className="flex items-start justify-between py-5 cursor-pointer list-none gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[13px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                  <span className="text-[15px] font-semibold text-[var(--c-text)] leading-[1.5]">{faq.q}</span>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="pb-5 pl-7 sm:pl-[40px] text-[14px] text-[var(--c-sub)] leading-[1.8]">{faq.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
