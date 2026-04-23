"use client";

import Link from "next/link";
import type { ServiceItem } from "@/lib/services";
import { PageShell, Section } from "@/components/PageShell";

interface Props {
  service: ServiceItem;
  prevService: { slug: string; title: string } | null;
  nextService: { slug: string; title: string } | null;
}

const OTHER_SERVICES = [
  { slug: "responsive-web", title: "반응형 홈페이지" },
  { slug: "ecommerce", title: "쇼핑몰 구축" },
  { slug: "landing-page", title: "랜딩페이지" },
  { slug: "web-app", title: "웹 애플리케이션" },
  { slug: "cms", title: "CMS 시스템" },
  { slug: "enterprise", title: "기업 관리 시스템" },
  { slug: "marketing", title: "기술 마케팅" },
];

export default function ServiceDetailClient({ service, prevService, nextService }: Props) {
  return (
    <PageShell
      breadcrumb={[{ label: "서비스", href: "/services" }, { label: service.title }]}
      overline="SERVICE"
      title={service.title}
      subtitle={service.subtitle}
      stats={[
        { label: "주요 기능", value: String(service.features.length), suffix: "항목" },
        { label: "핵심 태그", value: String(service.tags.length), suffix: "개" },
        { label: "기술 스택", value: String(service.technologies?.length || 0), suffix: "종" },
        { label: "FAQ", value: String(service.faqs?.length || 0), suffix: "개" },
      ]}
      actions={
        <>
          <Link href="/contact" className="p-btn p-btn-dark">
            무료 상담 신청
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a href="tel:010-3319-2509" className="p-btn tnum hidden md:inline-flex">010-3319-2509</a>
        </>
      }
      sidebar={<ServiceSidebar currentSlug={service.slug} serviceTitle={service.title} />}
    >
      {/* Visual mockup hero */}
      <Section>
        <ServiceMockup service={service} />
      </Section>

      {/* Overview */}
      <Section overline="OVERVIEW" title="서비스 개요">
        <div className="p-card p-7 md:p-9">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {service.tags.map((t) => (
              <span key={t} className="p-chip">{t}</span>
            ))}
            {service.metric && <span className="p-chip p-chip-point">{service.metric}</span>}
          </div>
          <p className="text-[15px] md:text-[16px] text-[var(--c-text-2)] leading-[1.8]">
            {service.description}
          </p>
        </div>
      </Section>

      {/* Features */}
      <Section overline="FEATURES" title="주요 기능 및 특징" subtitle="이 서비스에 기본으로 포함되는 핵심 기능들입니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.features.map((f, i) => (
            <div
              key={f.title}
              className="flex items-start gap-4 p-6 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-line-3)] transition-colors"
            >
              <div className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-[10px] bg-[var(--c-main-bg)] text-[var(--c-main)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.iconPath} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-[11px] font-black text-[var(--c-sub-2)] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15.5px] font-bold tracking-tight text-[var(--c-text)]">
                    {f.title}
                  </h3>
                </div>
                <p className="text-[13.5px] text-[var(--c-sub)] leading-[1.7]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      {service.technologies && service.technologies.length > 0 && (
        <Section overline="TECH STACK" title="사용 기술" subtitle="검증된 최신 기술로 제작합니다.">
          <div className="p-card p-7 flex flex-wrap gap-2">
            {service.technologies.map((t) => (
              <span
                key={t}
                className="inline-flex items-center h-9 px-4 rounded-full border border-[var(--c-line-2)] bg-white text-[13px] font-semibold text-[var(--c-text-2)]"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <Section overline="FAQ" title="자주 묻는 질문">
          <div className="p-card overflow-hidden">
            {service.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[var(--c-line)] last:border-b-0">
                <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer list-none hover:bg-[var(--c-bg-1)] transition-colors">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-main-bg)] text-[var(--c-main)] text-[12px] font-black tnum">
                    Q{i + 1}
                  </span>
                  <span className="text-[14.5px] font-semibold text-[var(--c-text)] flex-1">{faq.q}</span>
                  <svg
                    className="w-4 h-4 text-[var(--c-sub-2)] shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pl-[76px] text-[13.5px] text-[var(--c-sub)] leading-[1.8] whitespace-pre-line">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* Prev / Next */}
      {(prevService || nextService) && (
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prevService ? (
              <Link
                href={`/services/${prevService.slug}`}
                className="group flex items-center gap-4 p-6 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors no-underline"
              >
                <svg className="w-5 h-5 text-[var(--c-sub-2)] shrink-0 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[var(--c-sub)] tracking-wider uppercase mb-1">이전 서비스</p>
                  <p className="text-[15px] font-bold text-[var(--c-text)] truncate">{prevService.title}</p>
                </div>
              </Link>
            ) : <div className="hidden md:block" />}

            {nextService ? (
              <Link
                href={`/services/${nextService.slug}`}
                className="group flex items-center gap-4 p-6 rounded-[14px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors no-underline md:justify-end md:text-right"
              >
                <div className="min-w-0 flex-1 md:order-1">
                  <p className="text-[11px] font-semibold text-[var(--c-sub)] tracking-wider uppercase mb-1">다음 서비스</p>
                  <p className="text-[15px] font-bold text-[var(--c-text)] truncate">{nextService.title}</p>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub-2)] shrink-0 group-hover:translate-x-0.5 transition-transform md:order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : null}
          </div>
        </Section>
      )}
    </PageShell>
  );
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const MOCKUP_THEMES: Record<
  string,
  { from: string; to: string; accent: string; label: string; photo: string }
> = {
  "responsive-web": {
    from: "#0a2a5e",
    to: "#2459b0",
    accent: "#7aa6f0",
    label: "responsive.tsx",
    photo: UNSPLASH("1498050108023-c5249f4df085"),
  },
  ecommerce: {
    from: "#134e4a",
    to: "#0d9488",
    accent: "#5eead4",
    label: "shop/index.tsx",
    photo: UNSPLASH("1563013544-824ae1b704d3"),
  },
  "landing-page": {
    from: "#7c2d12",
    to: "#ea580c",
    accent: "#fdba74",
    label: "landing.html",
    photo: UNSPLASH("1460925895917-afdab827c52f"),
  },
  "web-app": {
    from: "#4c1d95",
    to: "#7c3aed",
    accent: "#c4b5fd",
    label: "app.tsx",
    photo: UNSPLASH("1461749280684-dccba630e2f6"),
  },
  cms: {
    from: "#0f766e",
    to: "#06b6d4",
    accent: "#67e8f9",
    label: "admin.tsx",
    photo: UNSPLASH("1517694712202-14dd9538aa97"),
  },
  enterprise: {
    from: "#1e293b",
    to: "#475569",
    accent: "#94a3b8",
    label: "dashboard.tsx",
    photo: UNSPLASH("1551288049-bebda4e38f71"),
  },
  marketing: {
    from: "#9f1239",
    to: "#e11d48",
    accent: "#fda4af",
    label: "analytics.tsx",
    photo: UNSPLASH("1556742049-0cfed4f6a45d"),
  },
};

function ServiceMockup({ service }: { service: ServiceItem }) {
  const theme = MOCKUP_THEMES[service.slug] ?? MOCKUP_THEMES["responsive-web"];

  return (
    <div className="relative">
      {/* Ambient blur backdrop */}
      <div
        className="absolute -inset-6 md:-inset-10 rounded-[32px] blur-3xl opacity-30 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      />

      {/* Mac-style window frame */}
      <div className="relative rounded-[14px] md:rounded-[16px] border border-[var(--c-line)] bg-[#1a1d26] shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-3 h-9 md:h-10 px-4 border-b border-white/10 bg-[#12141b]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 h-6 px-3 rounded bg-white/5 border border-white/10 text-[11px] text-white/60 font-mono">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              hsweb.pics/services/{service.slug}
            </div>
          </div>
          <div className="w-12 shrink-0" />
        </div>

        {/* Content */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center overflow-hidden">
          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme.photo}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Brand color overlay */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
              opacity: 0.72,
            }}
          />

          {/* Dark vignette for legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Glow orbs */}
          <div
            className="absolute -top-20 -right-16 w-[320px] h-[320px] rounded-full blur-3xl opacity-30"
            style={{ background: theme.accent }}
          />
          <div
            className="absolute -bottom-24 -left-20 w-[360px] h-[360px] rounded-full blur-3xl opacity-25"
            style={{ background: theme.accent }}
          />

          {/* Left floating "code" card */}
          <div className="hidden md:block absolute top-6 left-6 w-[280px] bg-[#0c0e14]/85 backdrop-blur border border-white/10 rounded-[10px] p-4 shadow-xl font-mono text-[11px] leading-[1.7]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
              <span className="w-2 h-2 rounded-full" style={{ background: theme.accent }} />
              <span className="text-white/50">{theme.label}</span>
            </div>
            <p className="text-white/40">
              <span className="text-[#c792ea]">const</span>{" "}
              <span className="text-[#82aaff]">project</span> = {"{"}
            </p>
            <p className="pl-3 text-white/60">
              <span className="text-[#89ddff]">name</span>:{" "}
              <span style={{ color: theme.accent }}>{`"${service.title}"`}</span>,
            </p>
            <p className="pl-3 text-white/60">
              <span className="text-[#89ddff]">tags</span>: [
              <span className="text-[#c3e88d]">
                {service.tags.slice(0, 2).map((t, idx) => (
                  <span key={t}>
                    {idx > 0 && ", "}
                    {`"${t}"`}
                  </span>
                ))}
              </span>
              ],
            </p>
            <p className="pl-3 text-white/60">
              <span className="text-[#89ddff]">status</span>:{" "}
              <span className="text-[#c3e88d]">{'"ready"'}</span>,
            </p>
            <p className="text-white/40">{"}"}</p>
          </div>

          {/* Right floating "UI" card */}
          <div className="hidden lg:block absolute bottom-6 right-6 w-[240px] bg-white/95 backdrop-blur rounded-[10px] p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded-[8px]"
                style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[var(--c-text)] truncate">{service.title}</p>
                <p className="text-[10px] text-[var(--c-sub)]">active project</p>
              </div>
              <span className="inline-flex w-2 h-2 rounded-full bg-[var(--c-new)] animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-[var(--c-line)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "72%", background: theme.to }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--c-sub)]">
                <span>progress</span>
                <span className="font-bold text-[var(--c-text)]">72%</span>
              </div>
            </div>
          </div>

          {/* Center — big icon + title */}
          <div className="relative text-center px-5">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[20px] bg-white/10 backdrop-blur border border-white/20 mb-5 shadow-lg">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
              </svg>
            </div>
            <h3 className="text-[26px] md:text-[36px] font-black tracking-[-0.03em] text-white leading-tight mb-2">
              {service.title}
            </h3>
            <p className="text-[13px] md:text-[15px] text-white/75 max-w-[420px] mx-auto leading-[1.6]">
              {service.subtitle}
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between h-8 px-4 border-t border-white/10 bg-[#12141b] text-[10px] text-white/50 font-mono">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
              production ready
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">main</span>
          </div>
          <span className="tnum">{service.features.length} features · {service.technologies?.length || 0} stacks</span>
        </div>
      </div>
    </div>
  );
}

function ServiceSidebar({ currentSlug, serviceTitle }: { currentSlug: string; serviceTitle: string }) {
  return (
    <>
      {/* Quick estimate card */}
      <div className="p-6 rounded-[14px] bg-[var(--c-text)] text-white">
        <p className="text-[11px] font-bold text-white/60 tracking-wider uppercase mb-2">QUICK ESTIMATE</p>
        <h3 className="text-[16px] font-bold mb-2 leading-[1.4]">
          {serviceTitle}
          <br />
          <span className="text-white/70">프로젝트 견적</span>
        </h3>
        <p className="text-[12.5px] text-white/70 leading-[1.6] mb-5">
          24시간 이내 회신 · 첫 상담 무료
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center w-full h-11 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors mb-2"
        >
          상담 신청
        </Link>
        <a
          href="tel:010-3319-2509"
          className="inline-flex items-center justify-center w-full h-11 rounded-[10px] border border-white/20 text-white font-semibold text-[13.5px] no-underline hover:bg-white/5 transition-colors tnum"
        >
          010-3319-2509
        </a>
      </div>

      {/* Other services */}
      <div className="p-5 rounded-[14px] bg-white border border-[var(--c-line)]">
        <h3 className="text-[13px] font-bold text-[var(--c-text)] mb-3">다른 서비스</h3>
        <ul className="list-none space-y-0">
          {OTHER_SERVICES.filter((s) => s.slug !== currentSlug).map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="flex items-center justify-between py-2 text-[13px] no-underline text-[var(--c-text-2)] hover:text-[var(--c-text)] group"
              >
                {s.title}
                <svg
                  className="w-3 h-3 text-[var(--c-sub-2)] group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
