"use client";

import Link from "next/link";
import type { ServiceItem } from "@/lib/services";
import { Breadcrumb, PageHeader, Section } from "@/components/PageShell";

interface Props {
  service: ServiceItem;
  prevService: { slug: string; title: string } | null;
  nextService: { slug: string; title: string } | null;
}

export default function ServiceDetailClient({ service, prevService, nextService }: Props) {
  return (
    <div className="bg-[var(--color-bg-alt)] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <Breadcrumb items={[{ label: "서비스", href: "/services" }, { label: service.title }]} />
        <PageHeader title={service.title} caption={service.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
          <main className="min-w-0 space-y-4">
            {/* Overview */}
            <section className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>서비스 개요</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {service.tags.map((t) => (
                    <span key={t} className="p-chip">{t}</span>
                  ))}
                  <span className="p-chip p-chip-point">{service.metric}</span>
                </div>
                <p className="text-[13px] text-[var(--color-text-2)] leading-relaxed">{service.description}</p>
              </div>
            </section>

            {/* Features */}
            <Section title="주요 기능 및 특징">
              <div>
                <div className="hidden md:grid grid-cols-[40px_220px_1fr] px-4 py-2 text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                  <span className="text-center">#</span>
                  <span>항목</span>
                  <span>설명</span>
                </div>
                {service.features.map((f, i) => (
                  <div
                    key={f.title}
                    className="md:grid md:grid-cols-[40px_220px_1fr] flex flex-col md:flex-row md:items-center gap-2 md:gap-0 px-4 py-3 text-[13px] border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <span className="hidden md:inline text-center text-[11px] text-[var(--color-muted)] tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-semibold text-[var(--color-text)]">
                      <span className="md:hidden text-[11px] text-[var(--color-muted)] tnum mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                      {f.title}
                    </span>
                    <span className="text-[12px] text-[var(--color-text-2)] leading-relaxed">{f.desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Tech Stack */}
            {service.technologies && service.technologies.length > 0 && (
              <Section title="사용 기술">
                <div className="p-4 flex flex-wrap gap-1.5">
                  {service.technologies.map((t) => (
                    <span key={t} className="p-chip">{t}</span>
                  ))}
                </div>
              </Section>
            )}

            {/* FAQ */}
            {service.faqs && service.faqs.length > 0 && (
              <Section title="자주 묻는 질문">
                <div>
                  {service.faqs.map((faq, i) => (
                    <details key={i} className="border-b border-[var(--color-border)] last:border-b-0">
                      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-[var(--color-bg-alt)]">
                        <span className="text-[12px] font-bold text-[var(--color-point)] tnum">Q{i + 1}</span>
                        <span className="text-[13px] font-semibold flex-1">{faq.q}</span>
                        <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-3 pl-[52px] text-[12px] text-[var(--color-text-2)] leading-relaxed">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-0 border border-[var(--color-border)] bg-white">
              {prevService ? (
                <Link
                  href={`/services/${prevService.slug}`}
                  className="flex items-center gap-2 px-4 py-3 no-underline hover:bg-[var(--color-bg-alt)] border-r border-[var(--color-border)]"
                >
                  <span className="text-[var(--color-muted-2)]">‹</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[var(--color-muted)]">이전 서비스</p>
                    <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{prevService.title}</p>
                  </div>
                </Link>
              ) : <span className="border-r border-[var(--color-border)]" />}

              {nextService ? (
                <Link
                  href={`/services/${nextService.slug}`}
                  className="flex items-center justify-end gap-2 px-4 py-3 no-underline hover:bg-[var(--color-bg-alt)]"
                >
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] text-[var(--color-muted)]">다음 서비스</p>
                    <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{nextService.title}</p>
                  </div>
                  <span className="text-[var(--color-muted-2)]">›</span>
                </Link>
              ) : <span />}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>빠른 견적</h2>
              </div>
              <div className="p-4">
                <p className="text-[12px] text-[var(--color-text-2)] mb-3 leading-relaxed">
                  <strong className="text-[var(--color-point)]">{service.title}</strong> 프로젝트 견적을 받아보세요.
                </p>
                <Link href="/contact" className="p-btn p-btn-point w-full no-underline">상담 신청</Link>
                <a href="tel:010-3319-2509" className="p-btn w-full tnum mt-2 no-underline">010-3319-2509</a>
              </div>
            </div>

            <div className="border border-[var(--color-border)] bg-white">
              <div className="p-section-head">
                <h2>다른 서비스</h2>
              </div>
              <ul className="list-none">
                {[
                  { slug: "responsive-web", title: "반응형 홈페이지" },
                  { slug: "ecommerce", title: "쇼핑몰 구축" },
                  { slug: "landing-page", title: "랜딩페이지" },
                  { slug: "web-app", title: "웹 애플리케이션" },
                  { slug: "cms", title: "CMS 시스템" },
                  { slug: "marketing", title: "기술 마케팅" },
                ]
                  .filter((s) => s.slug !== service.slug)
                  .slice(0, 5)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="flex items-center justify-between px-4 h-9 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
                      >
                        {s.title}
                        <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
