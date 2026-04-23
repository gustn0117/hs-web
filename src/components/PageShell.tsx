import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] mb-3">
      <Link href="/" className="no-underline hover:text-[var(--color-point)]">홈</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span>›</span>
          {item.href ? (
            <Link href={item.href} className="no-underline hover:text-[var(--color-point)]">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <header className="mb-5 pb-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-block w-1 h-4 bg-[var(--color-point)] rounded-sm" />
        <span className="text-[11px] font-bold text-[var(--color-point)] tracking-[0.18em] uppercase">
          HS WEB
        </span>
      </div>
      <h1 className="p-h1 mb-1">{title}</h1>
      {caption && <p className="text-[12.5px] text-[var(--color-muted)] leading-relaxed">{caption}</p>}
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
    <div className="bg-[var(--color-bg-alt)] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <Breadcrumb items={breadcrumb} />
        <PageHeader title={title} caption={caption} />
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4">
            <main className="min-w-0 space-y-4">{children}</main>
            <aside className="hidden lg:block space-y-4">{sidebar}</aside>
          </div>
        ) : (
          <main className="space-y-4">{children}</main>
        )}
      </div>
    </div>
  );
}

export function DefaultSidebar() {
  return (
    <>
      <div className="border border-[var(--color-border)] bg-white">
        <div className="p-section-head">
          <h2>빠른 견적</h2>
        </div>
        <div className="p-4">
          <p className="text-[12px] text-[var(--color-text-2)] mb-3 leading-relaxed">
            필요한 정보만 입력하면{" "}
            <strong className="text-[var(--color-point)]">24시간 내 회신</strong>해드립니다.
          </p>
          <Link href="/contact" className="p-btn p-btn-point w-full no-underline">상담 신청</Link>
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted)] space-y-1">
            <div className="flex justify-between">
              <span>전화</span>
              <span className="tnum text-[var(--color-text-2)]">010-3319-2509</span>
            </div>
            <div className="flex justify-between">
              <span>운영</span>
              <span className="text-[var(--color-text-2)]">평일 10~19시</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[var(--color-border)] bg-white">
        <div className="p-section-head">
          <h2>바로가기</h2>
        </div>
        <ul className="list-none">
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
                className="flex items-center justify-between px-4 h-9 text-[13px] no-underline text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)]"
              >
                {it.label}
                <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
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
    <section className="border border-[var(--color-border)] bg-white">
      <div className="p-section-head">
        <h2>{title}</h2>
        {more && <Link href={more.href} className="more">{more.label} →</Link>}
      </div>
      {children}
    </section>
  );
}
