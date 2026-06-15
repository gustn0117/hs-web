import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "검색엔진 최적화(SEO) 안내",
  description:
    "HS WEB의 검색엔진 최적화(SEO) 작업 범위와 비용을 안내합니다. 내부 코드 SEO는 모든 프로젝트에 기본 포함, 플랫폼별 본격 SEO 작업은 플랫폼당 50,000원의 별도 옵션입니다.",
  keywords: [
    "검색엔진 최적화",
    "SEO",
    "Google SEO",
    "네이버 SEO",
    "사이트 등록",
    "사이트맵 제출",
    "메타 태그",
    "구조화 데이터",
  ],
  alternates: { canonical: "https://hsweb.pics/seo" },
};

export default function SeoInfoPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "검색엔진 최적화" }]}
      overline="SEO · SEARCH ENGINE OPTIMIZATION"
      title="검색엔진 최적화, 어디까지 해드릴까요?"
      subtitle="코드 단의 기본 SEO는 모든 프로젝트에 기본 포함됩니다. 본격적인 플랫폼별 SEO 작업은 플랫폼당 50,000원의 별도 옵션으로 진행합니다."
      stats={[
        { label: "내부 코드 SEO", value: "기본", suffix: " 포함" },
        { label: "검색엔진 등록", value: "기본", suffix: " 포함" },
        { label: "플랫폼별 작업", value: "50,000", suffix: "원~" },
        { label: "상위 노출", value: "마케팅", suffix: " 영역" },
      ]}
    >
      {/* CONCEPT — what SEO is and isn't */}
      <Section
        overline="CONCEPT"
        title="SEO와 마케팅, 분명히 다릅니다"
        subtitle="둘을 혼동하면 비용은 비용대로 쓰고 결과가 안 나옵니다. 명확하게 구분해 두세요."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEO card */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-gradient-to-br from-white to-[var(--c-main-bg)] overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
              <span className="p-chip p-chip-point">기술 · 구조</span>
              <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">SEO</span>
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight mb-3">SEO = 검색엔진이 사이트를 잘 읽도록</h3>
            <p className="text-[14px] text-[var(--c-text-2)] leading-[1.75] mb-6">
              검색엔진(Google·Naver 등)의 <strong>크롤러가 사이트를 정확히 이해하고 색인</strong>하도록 만드는 기술 작업입니다.
              메타 태그, 사이트맵, 구조화 데이터, 페이지 속도, 모바일 호환 등이 여기에 들어갑니다.
            </p>
            <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">목적</span>
                <span className="font-semibold text-right">검색 결과에 노출될 수 있는 자격 확보</span>
              </div>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">성격</span>
                <span className="font-semibold">1회성 기술 작업</span>
              </div>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">결과</span>
                <span className="font-semibold">검색에 노출 가능 + 자연 유입 기반</span>
              </div>
            </div>
          </div>

          {/* Marketing card */}
          <div className="relative p-8 rounded-[16px] border border-[var(--c-line)] bg-white overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-[var(--c-bg-2)] text-[var(--c-text-2)] text-[11px] font-bold tracking-wider">마케팅 · 운영</span>
              <span className="text-[11px] text-[var(--c-sub)] tracking-widest uppercase">MARKETING</span>
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight mb-3">마케팅 = 검색 결과 상단에 노출되도록</h3>
            <p className="text-[14px] text-[var(--c-text-2)] leading-[1.75] mb-6">
              특정 키워드에서 <strong>경쟁사보다 위에 노출되도록 하는 운영</strong> 영역입니다.
              백링크 구축, 콘텐츠 마케팅, 광고 운영, 키워드 추적 등 지속적인 작업과 비용이 듭니다.
            </p>
            <div className="pt-5 border-t border-[var(--c-line)] space-y-2">
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">목적</span>
                <span className="font-semibold text-right">특정 키워드 상위 노출</span>
              </div>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">성격</span>
                <span className="font-semibold">지속 운영 · 월 단위 비용</span>
              </div>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--c-sub)]">담당</span>
                <span className="font-semibold">별도 마케팅 업체 영역</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-5 md:p-6 rounded-[12px] bg-[var(--c-bg-1)] border border-[var(--c-line)]">
          <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75]">
            <strong className="text-[var(--c-text)]">HS WEB은 SEO(기술) 영역까지 진행합니다.</strong>{" "}
            상위 노출이나 특정 키워드 노출은 SEO가 아닌 <strong>마케팅 영역</strong>으로,
            별도 마케팅 업체를 통해 진행하셔야 합니다. SEO 작업이 잘 되어 있어야 마케팅 효율도 올라가기 때문에,
            두 영역은 분리되어 있지만 서로 연결됩니다.
          </p>
        </div>
      </Section>

      {/* SCOPE — what's free vs paid add-on */}
      <Section
        overline="SCOPE"
        title="작업 범위와 비용"
        subtitle="모든 프로젝트에 기본 포함되는 SEO와 옵션으로 진행하는 본격 SEO를 명확히 구분합니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Included — Free */}
          <div className="p-7 md:p-8 rounded-[16px] border border-[var(--c-line)] bg-white">
            <div className="flex items-baseline justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-2">INCLUDED · 기본 포함</p>
                <h3 className="text-[20px] font-bold tracking-tight text-[var(--c-text)]">내부 코드 단의 SEO</h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[24px] font-bold text-[var(--c-text)] leading-none">무료</p>
                <p className="text-[11px] text-[var(--c-sub)] mt-1">모든 플랜 공통</p>
              </div>
            </div>

            <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.75] mb-5">
              어떤 플랜을 선택하셔도, 자체 개발 프로젝트에는 검색엔진 친화적인 코드가 기본 적용됩니다.
            </p>

            <ul className="list-none space-y-2.5">
              {[
                "시맨틱 HTML 구조 (heading 계층, alt 텍스트)",
                "메타 태그 · Open Graph · Twitter Card",
                "robots.txt · sitemap.xml 자동 생성",
                "구조화 데이터 (Schema.org · JSON-LD)",
                "canonical URL · 모바일 viewport",
                "Core Web Vitals 기본 최적화 (LCP·CLS)",
                "Google Search Console · Naver Webmaster 사이트 등록",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-[var(--c-text-2)] leading-[1.6]">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Add-on — Paid */}
          <div className="p-7 md:p-8 rounded-[16px] border-2 border-[var(--c-text)] bg-[var(--c-text)] text-white">
            <div className="flex items-baseline justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/70 mb-2">ADD-ON · 옵션</p>
                <h3 className="text-[20px] font-bold tracking-tight">플랫폼별 본격 SEO 작업</h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[24px] font-bold leading-none tnum">50,000<span className="text-[14px] font-semibold text-white/60 ml-0.5">원</span></p>
                <p className="text-[11px] text-white/60 mt-1">플랫폼당 · 1회</p>
              </div>
            </div>

            <p className="text-[13.5px] text-white/75 leading-[1.75] mb-5">
              Google · Naver 등 검색 플랫폼 단위로 진행하는 등록·인증·점검 작업입니다.
              플랫폼이 추가될 때마다 비용이 추가됩니다.
            </p>

            <ul className="list-none space-y-2.5">
              {[
                "Search Console / Webmaster Tools 인증 완료",
                "사이트맵 제출 · 인덱싱 요청 수행",
                "주요 페이지 메타 태그 검토 및 최적화",
                "구조화 데이터(JSON-LD) 추가 점검",
                "모바일·페이지 속도 진단 보고",
                "초기 색인 결과 확인 및 회신 (1회)",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-white/90 leading-[1.6]">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-white/15 text-[12.5px] text-white/65 leading-[1.65]">
              예시 비용 · Google + Naver 2개 플랫폼 진행 시{" "}
              <strong className="text-white tnum">100,000원</strong>
            </div>
          </div>
        </div>

        {/* Excluded — Marketing */}
        <div className="mt-4 p-6 md:p-7 rounded-[16px] border border-[var(--c-line)] bg-[var(--c-bg-1)]">
          <div className="flex items-start gap-4">
            <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--c-bg-2)] border border-[var(--c-line)]">
              <svg className="w-4 h-4 text-[var(--c-sub)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-sub)] mb-2">NOT INCLUDED · 마케팅 영역</p>
              <h3 className="text-[18px] font-bold text-[var(--c-text)] mb-2">상위 노출 · 키워드 노출은 SEO가 아닙니다</h3>
              <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75] mb-3">
                "○○○으로 검색하면 우리 사이트가 1위에 뜨도록" 같은 작업은 SEO가 아닌{" "}
                <strong className="text-[var(--c-text)]">마케팅 영역</strong>입니다.
                지속적인 콘텐츠·백링크·광고 운영이 필요해 별도 마케팅 업체를 통해 진행하셔야 합니다.
              </p>
              <ul className="list-none grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-3">
                {["특정 키워드 상위 노출", "광고 운영 · 백링크 구축", "콘텐츠 마케팅 · SNS"].map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13px] text-[var(--c-sub)] line-through decoration-[var(--c-sub-2)] decoration-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--c-sub-2)] shrink-0 mt-2" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* PROCESS — how it works */}
      <Section overline="HOW IT WORKS" title="SEO 작업이 어떻게 진행되나요?">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { n: "01", t: "기본 코드 SEO", d: "프로젝트 개발 중 자동으로 적용됩니다. 별도 비용·요청 불필요." },
            { n: "02", t: "플랫폼 선택", d: "본격 SEO를 진행할 플랫폼을 선택합니다. (Google, Naver, Bing 등)" },
            { n: "03", t: "등록·인증·제출", d: "선택한 플랫폼별로 사이트 등록과 인증, 사이트맵 제출을 진행합니다." },
            { n: "04", t: "점검 보고", d: "메타·구조화 데이터·속도 진단 결과와 초기 색인 결과를 회신합니다." },
          ].map((s) => (
            <div key={s.n} className="p-6 rounded-[14px] border border-[var(--c-line)] bg-white">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] tnum mb-3">STEP {s.n}</p>
              <h4 className="text-[15px] font-bold text-[var(--c-text)] mb-2">{s.t}</h4>
              <p className="text-[13px] text-[var(--c-sub)] leading-[1.7]">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {[
            {
              q: "기본 포함되는 SEO만 해도 검색에 잡히나요?",
              a: "네, 코드 단의 SEO가 잘 되어 있으면 시간이 지나면서 검색엔진이 자연스럽게 색인합니다. 다만 색인 속도와 정확도를 빠르게 높이려면 플랫폼별 본격 SEO 작업(등록·인증·사이트맵 제출)을 진행하시는 것을 권장합니다.",
            },
            {
              q: "한 플랫폼만 진행해도 되나요?",
              a: "물론입니다. 타겟 사용자가 주로 사용하는 플랫폼만 우선 진행하셔도 됩니다. 한국 시장 위주라면 Google + Naver 2개, 글로벌 타겟이라면 Google 1개로 시작하시는 분들이 많습니다.",
            },
            {
              q: "상위 노출을 보장해주시나요?",
              a: "보장하지 않습니다. 상위 노출은 검색엔진 알고리즘과 경쟁 사이트 상황에 따라 달라지는 마케팅 영역으로, SEO 작업의 범위 밖입니다. 상위 노출을 원하시면 별도 마케팅 업체를 통해 지속적인 운영을 진행하셔야 합니다.",
            },
            {
              q: "마케팅 업체 추천도 가능한가요?",
              a: "직접 운영하지는 않지만 협력하는 마케팅 업체가 있어 연결해드릴 수 있습니다. 단, 마케팅 비용은 별도이며 HS WEB과 무관하게 진행됩니다.",
            },
            {
              q: "워드프레스 같은 플랫폼도 SEO 작업이 가능한가요?",
              a: "플랫폼 솔루션은 코드 단의 SEO 자유도가 제한적이라 본격 SEO 작업이 어렵습니다. 자체 개발 프로젝트의 경우에만 SEO 옵션을 제공해드립니다.",
            },
          ].map((item, i) => (
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

      {/* CTA */}
      <Section>
        <div className="p-8 md:p-10 rounded-[18px] bg-[var(--c-text)] text-white text-center">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.15em] uppercase mb-3">CONTACT</p>
          <h3 className="text-[24px] md:text-[30px] font-bold tracking-tight mb-3">SEO 옵션 추가나 상담이 필요하신가요?</h3>
          <p className="text-[14px] text-white/70 leading-[1.7] mb-7 max-w-[560px] mx-auto">
            프로젝트 견적에 SEO 작업을 추가하거나, 어떤 플랫폼을 우선 진행할지 함께 정해드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white/10 text-white font-bold text-[14px] no-underline hover:bg-white/15 transition-colors border border-white/15"
            >
              가격 안내 보기
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
