import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] text-[var(--c-sub)] mb-5">
      <Link href="/" className="no-underline hover:text-[var(--c-text)]">홈</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="no-underline hover:text-[var(--c-text)]">{item.label}</Link>
          ) : (
            <span className="text-[var(--c-text)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <header className="mb-10">
      <h1 className="p-h1-xl mb-3">{title}</h1>
      {caption && <p className="text-[15px] text-[var(--c-sub)] leading-[1.7]">{caption}</p>}
    </header>
  );
}

export function PageShell({
  breadcrumb,
  title,
  caption,
  children,
  sidebar,
}: {
  breadcrumb: Crumb[];
  title: string;
  caption?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 pt-10 pb-24">
        <Breadcrumb items={breadcrumb} />
        <PageHeader title={title} caption={caption} />
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            <main className="min-w-0 space-y-8">{children}</main>
            <aside className="hidden lg:block space-y-4">{sidebar}</aside>
          </div>
        ) : (
          <main className="space-y-8">{children}</main>
        )}
      </div>
    </div>
  );
}

export function DefaultSidebar() {
  return (
    <>
      <div className="p-card-elevated p-5">
        <h3 className="text-[14px] font-bold text-[var(--c-text)] mb-2">빠른 견적</h3>
        <p className="text-[13px] text-[var(--c-sub)] leading-[1.6] mb-4">
          필요한 정보만 입력하면 <strong className="text-[var(--c-text)]">24시간 이내 회신</strong>해드립니다.
        </p>
        <Link href="/contact" className="p-btn p-btn-dark w-full">상담 신청</Link>
        <dl className="mt-5 pt-4 border-t border-[var(--c-line)] space-y-2 text-[12px]">
          <div className="flex justify-between">
            <dt className="text-[var(--c-sub)]">전화</dt>
            <dd className="text-[var(--c-text)] tnum font-medium">010-3319-2509</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--c-sub)]">운영</dt>
            <dd className="text-[var(--c-text)] font-medium">평일 10~19시</dd>
          </div>
        </dl>
      </div>

      <div className="p-card p-5">
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
                className="flex items-center justify-between py-2 text-[13px] no-underline text-[var(--c-text-2)] hover:text-[var(--c-text)]"
              >
                {it.label}
                <svg className="w-3 h-3 text-[var(--c-sub-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Section({ title, more, children }: { title: string; more?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <h2 className="p-h2">{title}</h2>
        {more && (
          <Link href={more.href} className="text-[13px] text-[var(--c-sub)] hover:text-[var(--c-text)] no-underline flex items-center gap-1">
            {more.label}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </Link>
        )}
      </div>
      <div className="p-card">
        {children}
      </div>
    </section>
  );
}
