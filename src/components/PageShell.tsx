import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <header className="mb-8">
      <h1 className="p-h1-xl mb-3">{title}</h1>
      {caption && <p className="text-[15px] text-[var(--c-sub)] leading-[1.7]">{caption}</p>}
    </header>
  );
}

export function DefaultSidebar_Legacy() {
  return null;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] text-[var(--c-sub)]">
      <Link href="/" className="no-underline hover:text-[var(--c-text)] flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        홈
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="no-underline hover:text-[var(--c-text)]">{item.label}</Link>
          ) : (
            <span className="text-[var(--c-text)] font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  overline,
  title,
  subtitle,
  stats,
  breadcrumb,
  actions,
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string; suffix?: string }[];
  breadcrumb: Crumb[];
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-[var(--c-line)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-50" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[var(--c-bg-1)] via-white to-white" />

      <div className="relative max-w-[1280px] mx-auto px-5 pt-10 pb-16 md:pt-14 md:pb-20">
        <Breadcrumb items={breadcrumb} />

        <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-[720px]">
            {overline && <p className="p-overline mb-3">{overline}</p>}
            <h1 className="p-h1-xl mb-4">{title}</h1>
            {subtitle && (
              <p className="text-[16px] md:text-[18px] text-[var(--c-sub)] leading-[1.7]">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 border-t border-[var(--c-line)]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 md:py-6 px-4 md:px-5 ${
                  i !== 0 ? "md:border-l" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""} ${
                  i % 2 === 1 ? "border-l" : ""
                } border-[var(--c-line)]`}
              >
                <p className="text-[11px] font-semibold text-[var(--c-sub)] mb-2 keep tracking-wider uppercase">{s.label}</p>
                <p className="p-stat text-[24px] md:text-[32px] leading-none nowrap">
                  {s.value}
                  {s.suffix && <span className="text-[14px] md:text-[16px] text-[var(--c-sub)] ml-1">{s.suffix}</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function PageShell({
  breadcrumb,
  title,
  overline,
  subtitle,
  stats,
  actions,
  children,
  sidebar,
  dense,
}: {
  breadcrumb: Crumb[];
  title: string;
  overline?: string;
  subtitle?: string;
  stats?: { label: string; value: string; suffix?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  dense?: boolean;
}) {
  return (
    <div>
      <PageHero
        breadcrumb={breadcrumb}
        title={title}
        overline={overline}
        subtitle={subtitle}
        stats={stats}
        actions={actions}
      />

      <div className={`max-w-[1280px] mx-auto px-5 ${dense ? "py-12" : "py-16 md:py-20"}`}>
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            <main className="min-w-0 space-y-12">{children}</main>
            <aside className="hidden lg:block space-y-4 lg:sticky lg:top-24 lg:self-start">{sidebar}</aside>
          </div>
        ) : (
          <main className="space-y-12">{children}</main>
        )}
      </div>

      {/* Bottom CTA band */}
      <section className="p-section-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none p-bg-grid-dots opacity-[0.08]" />
        <div className="relative max-w-[900px] mx-auto px-5 text-center">
          <h2 className="p-h1-xl text-white mb-4">
            프로젝트 상담 받아보세요.
          </h2>
          <p className="text-[16px] text-white/60 mb-8">첫 상담은 무료입니다. 24시간 이내 회신해드립니다.</p>
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 h-[52px] px-7 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[15px] no-underline hover:bg-[var(--c-bg-2)] transition-colors">
              상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="tel:010-3319-2509" className="inline-flex items-center gap-2 h-[52px] px-6 rounded-[10px] text-white font-semibold text-[15px] no-underline border border-white/20 hover:bg-white/5 transition-colors tnum">
              010-3319-2509
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DefaultSidebar() {
  return (
    <>
      <div className="p-6 rounded-[14px] bg-[var(--c-text)] text-white">
        <h3 className="text-[14px] font-bold mb-2">빠른 견적</h3>
        <p className="text-[13px] text-white/70 leading-[1.6] mb-5">
          24시간 이내 회신해드립니다. 첫 상담은 무료.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center w-full h-11 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
        >
          상담 신청
        </Link>
        <dl className="mt-5 pt-5 border-t border-white/10 space-y-2 text-[12px]">
          <div className="flex justify-between">
            <dt className="text-white/60">전화</dt>
            <dd className="text-white tnum font-semibold">010-3319-2509</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">운영</dt>
            <dd className="text-white font-medium">평일 10~19시</dd>
          </div>
        </dl>
      </div>

      <div className="p-5 rounded-[14px] bg-white border border-[var(--c-line)]">
        <h3 className="text-[13px] font-bold text-[var(--c-text)] mb-3">바로가기</h3>
        <ul className="list-none space-y-0">
          {[
            { href: "/services", label: "서비스" },
            { href: "/portfolio", label: "포트폴리오" },
            { href: "/pricing", label: "가격 안내" },
            { href: "/process", label: "제작 과정" },
            { href: "/domain-hosting", label: "도메인·호스팅" },
            { href: "/contact", label: "견적 문의" },
          ].map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className="flex items-center justify-between py-2 text-[13px] no-underline text-[var(--c-text-2)] hover:text-[var(--c-text)] group"
              >
                {it.label}
                <svg className="w-3 h-3 text-[var(--c-sub-2)] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Section({
  overline,
  title,
  subtitle,
  more,
  children,
  tone = "plain",
}: {
  overline?: string;
  title?: string;
  subtitle?: string;
  more?: { href: string; label: string };
  children: React.ReactNode;
  tone?: "plain" | "card";
}) {
  return (
    <section>
      {(title || overline) && (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div className="flex-1">
            {overline && <p className="p-overline mb-2">{overline}</p>}
            {title && <h2 className="p-h2">{title}</h2>}
            {subtitle && <p className="text-[14px] text-[var(--c-sub)] mt-2 leading-[1.6]">{subtitle}</p>}
          </div>
          {more && (
            <Link href={more.href} className="text-[13px] text-[var(--c-sub)] hover:text-[var(--c-text)] no-underline flex items-center gap-1 p-anim-link">
              {more.label}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Link>
          )}
        </div>
      )}
      {tone === "card" ? (
        <div className="p-card overflow-hidden">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
