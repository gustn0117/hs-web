import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { PageShell, DefaultSidebar, Section } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "서비스 안내 - 홈페이지 제작, 쇼핑몰 구축, 랜딩페이지",
  description:
    "HS WEB이 제공하는 홈페이지 제작 서비스를 확인하세요. 반응형 웹디자인, 쇼핑몰 구축, 랜딩페이지, 웹 애플리케이션, CMS, 기술 마케팅까지 원스톱 솔루션을 제공합니다.",
  keywords: [
    "홈페이지 제작 서비스",
    "웹사이트 제작 서비스",
    "쇼핑몰 구축",
    "랜딩페이지 제작",
    "웹 개발 서비스",
  ],
  alternates: { canonical: "https://hsweb.pics/services" },
};

export default function ServicesPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "서비스" }]}
      title="서비스 안내"
      caption="홈페이지 제작부터 쇼핑몰 구축, 기술 마케팅까지 웹 전반의 솔루션을 제공합니다."
      sidebar={<DefaultSidebar />}
    >
      <Section title={`제공 서비스 (${services.length})`}>
        <div>
          <div className="hidden md:grid grid-cols-[40px_1fr_240px_100px_80px] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
            <span className="text-center">#</span>
            <span>서비스명</span>
            <span>주요 기능</span>
            <span className="text-right">특징</span>
            <span className="text-center">상세</span>
          </div>
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="md:grid md:grid-cols-[40px_1fr_240px_100px_80px] flex items-start gap-3 md:items-center px-4 py-3 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
            >
              <span className="hidden md:inline text-center text-[11px] text-[var(--color-muted)] tnum">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold">{s.title}</span>
                  <span className="p-chip">{s.subtitle}</span>
                </div>
                <p className="text-[12px] text-[var(--color-muted)] truncate">{s.description}</p>
              </div>
              <div className="hidden md:flex flex-wrap gap-1">
                {s.tags.slice(0, 3).map((t) => (
                  <span key={t} className="p-chip">{t}</span>
                ))}
              </div>
              <span className="hidden md:inline text-right text-[12px] text-[var(--color-text-2)]">{s.metric}</span>
              <span className="hidden md:inline text-center text-[12px] text-[var(--color-point)] font-semibold">보기 →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="모든 서비스 공통 포함">
        <ul className="list-none grid grid-cols-2 md:grid-cols-3">
          {[
            "반응형 웹디자인",
            "SEO 기본 최적화",
            "SSL 보안 인증서",
            "Google Analytics 연동",
            "CDN 성능 최적화",
            "웹 표준 준수",
            "소스코드 100% 제공",
            "크로스 브라우저 호환",
            "기본 관리자 기능",
          ].map((t) => (
            <li
              key={t}
              className="flex items-center gap-2 px-4 h-10 border-b border-r border-[var(--color-border)] text-[13px] text-[var(--color-text-2)] last-of-type:border-b-0"
            >
              <svg className="w-3.5 h-3.5 text-[var(--color-point)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
