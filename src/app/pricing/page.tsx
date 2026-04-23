import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";

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
    subtitle: "소규모 비즈니스",
    price: "249,000원",
    priceSuffix: "부터~",
    target: "개인사업자, 스타트업",
    pages: "5페이지",
    duration: "1~2주",
    maintenance: "1개월",
    features: [
      "반응형 디자인 (5페이지)",
      "기본 최적화 설정",
      "도메인 & 호스팅 가이드",
      "빠른 제작 진행",
      "1개월 무상 유지보수",
    ],
  },
  {
    name: "Professional",
    subtitle: "성장하는 비즈니스",
    price: "700,000원",
    priceSuffix: "부터~",
    target: "중소기업, 브랜드 운영",
    pages: "10페이지",
    duration: "2~3주",
    maintenance: "3개월",
    featured: true,
    features: [
      "맞춤형 디자인 (10페이지)",
      "고급 성능 최적화",
      "관리자 페이지",
      "빠른 제작 진행",
      "3개월 무상 유지보수",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "대규모 프로젝트",
    price: "상담 견적",
    priceSuffix: "",
    target: "쇼핑몰, 웹앱, 플랫폼",
    pages: "제한 없음",
    duration: "1~3개월",
    maintenance: "6개월",
    features: [
      "풀 커스텀 디자인 & 개발",
      "쇼핑몰 / 웹앱 / API 연동",
      "전담 PM 배정",
      "빠른 제작 진행",
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
  { q: "견적에 포함된 범위는 어디까지인가요?", a: "플랜별 명시된 페이지 수 이내의 디자인, 퍼블리싱, 기본 최적화, 1~6개월 유지보수가 포함됩니다. 서버/도메인 실비는 별도입니다." },
  { q: "결제는 어떻게 이루어지나요?", a: "계약 체결 시 50%, 최종 납품 후 잔금 50% 지급이 기본입니다. Enterprise 플랜은 단계별 정산이 가능합니다." },
  { q: "유지보수 기간이 지나면?", a: "추가 유지보수 계약 또는 건별 작업 기준 청구 중 선택하실 수 있습니다. 사소한 수정은 언제든지 문의해주세요." },
  { q: "환불 정책은?", a: "디자인 시안 전 단계에서는 전액 환불, 이후 단계에 따라 부분 환불이 가능합니다. 계약서에 명시되어 있습니다." },
];

export default function PricingPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "가격 안내" }]}
      title="홈페이지 제작 가격 안내"
      caption="프로젝트 규모에 맞는 합리적 견적. VAT 별도, 실비(도메인·호스팅) 제외."
      sidebar={<DefaultSidebar />}
    >
      <Section title="플랜 비교">
        <div className="overflow-x-auto">
          <table className="p-table min-w-[700px]">
            <thead>
              <tr>
                <th style={{ width: "140px" }}>플랜</th>
                <th>대상</th>
                <th style={{ width: "100px" }}>페이지</th>
                <th style={{ width: "100px" }}>제작기간</th>
                <th style={{ width: "120px" }}>무상 유지보수</th>
                <th style={{ width: "140px" }} className="text-right">가격</th>
                <th style={{ width: "80px" }} className="text-center">문의</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.name}>
                  <td>
                    <span className="font-semibold">{p.name}</span>
                    {p.featured && <span className="ml-1.5 p-chip p-chip-point">인기</span>}
                    <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{p.subtitle}</p>
                  </td>
                  <td className="text-[var(--color-text-2)]">{p.target}</td>
                  <td className="tnum">{p.pages}</td>
                  <td className="tnum">{p.duration}</td>
                  <td className="tnum">{p.maintenance}</td>
                  <td className="text-right">
                    <span className="font-bold tnum">{p.price}</span>
                    {p.priceSuffix && <span className="text-[11px] text-[var(--color-muted)] ml-0.5">{p.priceSuffix}</span>}
                  </td>
                  <td className="text-center">
                    <Link href="/contact" className="text-[12px] text-[var(--color-point)] font-semibold no-underline">신청 →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="플랜별 세부 구성">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)]">
          {plans.map((p) => (
            <div key={p.name} className="bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold tracking-widest text-[var(--color-point)]">{p.name.toUpperCase()}</span>
                {p.featured && <span className="p-chip p-chip-point">인기</span>}
              </div>
              <p className="text-[14px] font-bold mb-2">{p.subtitle}</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[20px] font-black tnum">{p.price}</span>
                <span className="text-[12px] text-[var(--color-muted)]">{p.priceSuffix}</span>
              </div>
              <ul className="list-none space-y-1.5 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px] text-[var(--color-text-2)]">
                    <svg className="w-3 h-3 text-[var(--color-point)] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`p-btn ${p.featured ? "p-btn-point" : ""} w-full no-underline`}>
                상담 신청
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section title="모든 플랜 공통 포함">
        <ul className="list-none grid grid-cols-2 md:grid-cols-4">
          {commonFeatures.map((f, idx) => (
            <li
              key={f}
              className={`flex items-center gap-2 px-4 h-10 text-[12px] text-[var(--color-text-2)] border-r border-b border-[var(--color-border)] ${idx % 4 === 3 ? "md:border-r-0" : ""}`}
            >
              <svg className="w-3 h-3 text-[var(--color-point)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="자주 묻는 질문">
        <div>
          {faqs.map((item, i) => (
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
      </Section>
    </PageShell>
  );
}
