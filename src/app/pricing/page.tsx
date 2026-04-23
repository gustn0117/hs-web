import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "홈페이지 제작 가격 안내 - 합리적인 맞춤 견적",
  description:
    "홈페이지 제작 비용이 궁금하신가요? HS WEB은 프로젝트 규모에 맞는 합리적인 가격을 제안합니다. Basic, Professional, Enterprise 패키지로 원하는 수준의 웹사이트를 제작하세요.",
  keywords: ["홈페이지 제작 비용", "홈페이지 제작 가격", "웹사이트 제작 비용", "쇼핑몰 제작 비용", "홈페이지 견적"],
  alternates: { canonical: "https://hsweb.pics/pricing" },
};

const plans = [
  {
    name: "Basic",
    subtitle: "소규모 사업자",
    desc: "개인사업자·스타트업을 위한 합리적 시작점.",
    price: "249,000",
    suffix: "원~",
    target: "개인사업자, 스타트업",
    pages: "5페이지",
    maintenance: "1개월",
    features: [
      "반응형 웹 디자인 (5P)",
      "기본 SEO 최적화",
      "도메인·호스팅 가이드",
      "빠른 제작 · 납품",
      "1개월 무상 유지보수",
    ],
  },
  {
    name: "Professional",
    subtitle: "성장하는 브랜드",
    desc: "브랜딩과 기능 모두 잡는 중소기업 전문 패키지.",
    price: "700,000",
    suffix: "원~",
    target: "중소기업, 브랜드 운영",
    pages: "10페이지",
    maintenance: "3개월",
    featured: true,
    features: [
      "맞춤 디자인 (10P)",
      "고급 성능 · SEO 최적화",
      "관리자 페이지 포함",
      "우선 상담 · 제작 일정",
      "3개월 무상 유지보수",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "대규모 프로젝트",
    desc: "쇼핑몰·웹앱·플랫폼 등 풀 커스텀 솔루션.",
    price: "상담",
    suffix: " 맞춤",
    target: "쇼핑몰, 웹앱, 플랫폼",
    pages: "제한 없음",
    maintenance: "6개월",
    features: [
      "풀 커스텀 디자인 · 개발",
      "쇼핑몰 / 웹앱 / API 연동",
      "전담 PM 배정",
      "단계별 일정 · 정산",
      "6개월 무상 유지보수",
    ],
  },
];

const commonFeatures = [
  "SSL 보안 인증서",
  "Google Analytics 연동",
  "반응형 모바일 최적화",
  "크로스 브라우저 테스트",
  "소스코드 100% 제공",
  "CDN 성능 최적화",
  "웹 표준 & 접근성 준수",
  "무료 기본 SEO 설정",
];

const faqs = [
  { q: "견적에 포함된 범위는 어디까지인가요?", a: "플랜별 명시된 페이지 수 이내의 디자인, 퍼블리싱, 기본 최적화, 1~6개월 유지보수가 포함됩니다. 서버·도메인 실비는 별도입니다." },
  { q: "결제는 어떻게 이루어지나요?", a: "계약 체결 시 50%, 최종 납품 후 잔금 50% 지급이 기본입니다. Enterprise는 단계별 정산이 가능합니다." },
  { q: "유지보수 기간이 지나면?", a: "추가 유지보수 계약 또는 건별 작업 청구 중 선택하실 수 있습니다. 사소한 수정은 언제든지 문의해주세요." },
  { q: "환불 정책은 어떻게 되나요?", a: "디자인 시안 전 단계에서는 전액 환불, 이후 단계에 따라 부분 환불이 가능합니다. 계약서에 명시되어 있습니다." },
];

export default function PricingPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "가격 안내" }]}
      overline="PRICING"
      title="투명한 가격, 합리적인 시작."
      subtitle="프로젝트 규모에 맞춰 선택하세요. VAT 별도, 실비(도메인·호스팅) 제외."
      stats={[
        { label: "최저가", value: "249,000", suffix: "원~" },
        { label: "최대 유지보수", value: "6", suffix: "개월" },
        { label: "수정 횟수", value: "2~3", suffix: "회 포함" },
        { label: "소스코드", value: "100", suffix: "% 제공" },
      ]}
    >
      {/* Plans — bento cards */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative p-8 rounded-[18px] border ${
                p.featured
                  ? "bg-[var(--c-text)] text-white border-[var(--c-text)]"
                  : "bg-white border-[var(--c-line)]"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center h-6 px-3 rounded-full bg-white text-[var(--c-text)] text-[11px] font-bold tracking-[0.12em]">
                  MOST POPULAR
                </span>
              )}

              <div className="mb-6">
                <p className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5 ${p.featured ? "text-white/70" : "text-[var(--c-main)]"}`}>
                  {p.name}
                </p>
                <h3 className={`text-[22px] font-bold tracking-tight mb-2 ${p.featured ? "text-white" : "text-[var(--c-text)]"}`}>
                  {p.subtitle}
                </h3>
                <p className={`text-[13px] leading-[1.6] ${p.featured ? "text-white/60" : "text-[var(--c-sub)]"}`}>
                  {p.desc}
                </p>
              </div>

              <div className={`mb-6 flex items-baseline gap-1 nowrap pb-6 border-b border-dashed ${p.featured ? "border-white/20" : "border-[var(--c-line-2)]"}`}>
                <span className={`p-stat text-[44px] leading-none ${p.featured ? "!text-white" : ""}`}>{p.price}</span>
                <span className={`text-[14px] font-semibold ${p.featured ? "text-white/60" : "text-[var(--c-sub)]"}`}>{p.suffix}</span>
              </div>

              <dl className={`space-y-2 mb-6 text-[13px] ${p.featured ? "text-white/80" : "text-[var(--c-text-2)]"}`}>
                <div className="flex justify-between">
                  <dt className={p.featured ? "text-white/50" : "text-[var(--c-sub)]"}>페이지</dt>
                  <dd className="font-semibold">{p.pages}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={p.featured ? "text-white/50" : "text-[var(--c-sub)]"}>유지보수</dt>
                  <dd className="font-semibold">{p.maintenance}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={p.featured ? "text-white/50" : "text-[var(--c-sub)]"}>타깃</dt>
                  <dd className="font-semibold">{p.target}</dd>
                </div>
              </dl>

              <ul className="list-none space-y-2.5 mb-8">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-[13.5px] ${p.featured ? "text-white/85" : "text-[var(--c-text-2)]"}`}>
                    <svg className={`w-4 h-4 shrink-0 mt-0.5 ${p.featured ? "text-white" : "text-[var(--c-main)]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center w-full h-12 rounded-[10px] font-bold text-[14px] no-underline transition-colors ${
                  p.featured
                    ? "bg-white text-[var(--c-text)] hover:bg-[var(--c-bg-2)]"
                    : "bg-[var(--c-text)] text-white hover:bg-black"
                }`}
              >
                상담 신청
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison table */}
      <Section overline="COMPARE" title="플랜 비교" subtitle="기능별 차이를 한눈에 확인하세요.">
        <div className="p-card overflow-hidden overflow-x-auto">
          <table className="p-table min-w-[680px]">
            <thead>
              <tr>
                <th>항목</th>
                <th className="text-center">Basic</th>
                <th className="text-center">
                  <span className="inline-flex items-center gap-1.5">
                    Professional
                    <span className="b-hot">인기</span>
                  </span>
                </th>
                <th className="text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { k: "시작 가격", b: "249,000원~", p: "700,000원~", e: "상담" },
                { k: "페이지 수", b: "5 페이지", p: "10 페이지", e: "제한 없음" },
                { k: "디자인 수정", b: "2회", p: "3회", e: "협의" },
                { k: "관리자 페이지", b: "—", p: "✓", e: "✓ 풀 커스텀" },
                { k: "쇼핑몰 · 결제 연동", b: "—", p: "—", e: "✓" },
                { k: "전담 PM", b: "—", p: "—", e: "✓" },
                { k: "무상 유지보수", b: "1개월", p: "3개월", e: "6개월" },
                { k: "소스코드 제공", b: "✓", p: "✓", e: "✓ 저작권 이전" },
              ].map((row) => (
                <tr key={row.k}>
                  <td className="font-semibold">{row.k}</td>
                  <td className="text-center text-[var(--c-text-2)]">{row.b}</td>
                  <td className="text-center font-semibold text-[var(--c-text)] bg-[var(--c-bg-1)]">{row.p}</td>
                  <td className="text-center text-[var(--c-text-2)]">{row.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Common features */}
      <Section overline="INCLUDED" title="모든 플랜 공통 포함">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2.5 p-4 rounded-[10px] bg-[var(--c-bg-1)] border border-[var(--c-line)]">
              <svg className="w-4 h-4 text-[var(--c-main)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-[13px] font-semibold text-[var(--c-text-2)]">{f}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {faqs.map((item, i) => (
            <details key={i} className="border-b border-[var(--c-line)] group">
              <summary className="flex items-start justify-between py-5 cursor-pointer list-none gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[13px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                  <span className="text-[15px] font-semibold text-[var(--c-text)] leading-[1.5]">{item.q}</span>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="pb-5 pl-[40px] text-[14px] text-[var(--c-sub)] leading-[1.75]">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
