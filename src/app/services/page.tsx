import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { PageShell, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "서비스 안내 - 홈페이지 제작, 쇼핑몰 구축, 랜딩페이지",
  description:
    "HS WEB이 제공하는 홈페이지 제작 서비스를 확인하세요. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션, CMS, 기술 마케팅까지 원스톱 솔루션을 제공합니다.",
  keywords: ["홈페이지 제작 서비스", "웹사이트 제작 서비스", "쇼핑몰 구축", "랜딩페이지 제작", "웹 개발 서비스"],
  alternates: { canonical: "https://hsweb.pics/services" },
};

const COMMON_FEATURES = [
  { label: "반응형 웹디자인", desc: "PC·태블릿·모바일 전 기기 최적화" },
  { label: "SEO 기본 최적화", desc: "검색엔진 친화적 구조" },
  { label: "SSL 보안 인증서", desc: "https 암호화 통신 기본" },
  { label: "Google Analytics", desc: "방문자 분석 툴 연동" },
  { label: "CDN 성능 최적화", desc: "전세계 빠른 로딩 속도" },
  { label: "크로스 브라우저 호환", desc: "Chrome · Safari · Edge 등" },
  { label: "소스코드 100% 제공", desc: "모든 결과물 저작권 이전" },
  { label: "웹 표준 · 접근성", desc: "W3C 기준 준수" },
];

export default function ServicesPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "서비스" }]}
      overline="SERVICES"
      title="필요한 모든 웹 서비스, 한 곳에서."
      subtitle="홈페이지 제작부터 쇼핑몰 구축, 기술 마케팅까지. 브랜드의 시작과 성장에 필요한 모든 웹 솔루션을 제공합니다."
      stats={[
        { label: "서비스", value: String(services.length), suffix: "종" },
        { label: "평균 제작기간", value: "1~4", suffix: "주" },
        { label: "무상 유지보수", value: "1~6", suffix: "개월" },
        { label: "소스코드", value: "100", suffix: "% 제공" },
      ]}
    >
      {/* Bento grid services */}
      <Section overline="ALL SERVICES" title="서비스 목록">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {services.map((s, i) => {
            const isLarge = i === 0 || i === 3;
            const isDark = i === 1;
            const span = isLarge ? "md:col-span-3" : "md:col-span-2";
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`p-bento ${isDark ? "p-bento-dark" : ""} ${span} no-underline flex flex-col group ${isLarge ? "min-h-[280px]" : "min-h-[200px]"}`}
              >
                <div className="flex items-start justify-between mb-auto">
                  <div className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] ${isDark ? "text-white/60" : "text-[var(--c-main)]"}`}>
                    <span className="tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span>SERVICE</span>
                  </div>
                  <svg className={`w-5 h-5 ${isDark ? "text-white/80" : "text-[var(--c-sub-2)]"} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <div className="mt-auto pt-8">
                  <h3 className={`${isLarge ? "text-[24px] md:text-[28px]" : "text-[18px]"} font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-[var(--c-text)]"}`}>
                    {s.title}
                  </h3>
                  <p className={`text-[13.5px] leading-[1.65] mb-3 ${isDark ? "text-white/70" : "text-[var(--c-sub)]"} ${isLarge ? "" : "line-clamp-2"}`}>
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className={`p-chip ${isDark ? "!border-white/20 !bg-white/5 !text-white" : ""}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Common features */}
      <Section overline="INCLUDED" title="모든 플랜 공통 포함" subtitle="어떤 서비스를 선택해도 기본으로 포함되는 항목입니다.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMMON_FEATURES.map((f) => (
            <div key={f.label} className="p-5 rounded-[12px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors">
              <div className="w-9 h-9 rounded-[8px] bg-[var(--c-main-bg)] flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h4 className="text-[14px] font-bold text-[var(--c-text)] mb-1">{f.label}</h4>
              <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech stack band */}
      <Section overline="TECH STACK" title="검증된 최신 기술로 제작합니다">
        <div className="p-card overflow-hidden bg-[var(--c-bg-1)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--c-line)]">
            {[
              { cat: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
              { cat: "Backend", items: ["Node.js", "Supabase", "PostgreSQL", "REST API"] },
              { cat: "Infra", items: ["Docker", "Cloudflare", "CDN", "SSL"] },
              { cat: "Tools", items: ["Figma", "GitHub", "GA4", "Vercel"] },
            ].map((group) => (
              <div key={group.cat} className="bg-white p-6">
                <p className="text-[11px] font-bold text-[var(--c-main)] tracking-widest uppercase mb-4">{group.cat}</p>
                <ul className="list-none space-y-2">
                  {group.items.map((it) => (
                    <li key={it} className="text-[14px] font-semibold text-[var(--c-text-2)]">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
