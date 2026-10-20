import Link from "next/link";
import type { ServiceItem } from "@/lib/services";
import type { ServiceSite } from "@/lib/service-sites";
import type { PortfolioItem } from "@/lib/portfolio";
import { Hatch } from "./Placeholders";

/** 하위 페이지 머리 부분. 본 사이트 PageShell과 같은 결. */
export function PageHead({
  breadcrumb,
  overline,
  title,
  lead,
}: {
  breadcrumb: string;
  overline?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-[var(--c-line)] bg-white">
      <div className="max-w-[1280px] mx-auto px-5 pt-8 pb-10 md:pt-12 md:pb-14">
        <nav className="flex items-center gap-1.5 text-[12px] text-[var(--c-sub)]">
          <Link href="/" className="no-underline text-[var(--c-sub)] hover:text-[var(--c-main)]">
            홈
          </Link>
          <span className="text-[var(--c-sub-2)]">›</span>
          <span className="font-semibold text-[var(--c-text-2)]">{breadcrumb}</span>
        </nav>
        {overline && <p className="mt-6 text-[12px] font-bold text-[var(--c-main)]">{overline}</p>}
        <h1 className="mt-2 text-[26px] md:text-[38px] font-extrabold tracking-[-0.035em] text-[var(--c-text)]">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 text-[14.5px] md:text-[16px] text-[var(--c-sub)] leading-[1.85] max-w-[720px]">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}

export function Band({
  id,
  overline,
  title,
  lead,
  tone = "white",
  children,
}: {
  id?: string;
  overline?: string;
  title?: string;
  lead?: string;
  tone?: "white" | "soft";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-14 md:py-20 border-b border-[var(--c-line)] ${
        tone === "soft" ? "bg-[var(--c-bg-1)]" : "bg-white"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5">
        {overline && <p className="text-[12px] font-bold text-[var(--c-main)] mb-2">{overline}</p>}
        {title && (
          <h2 className="text-[22px] md:text-[28px] font-extrabold tracking-[-0.03em] text-[var(--c-text)]">
            {title}
          </h2>
        )}
        {lead && (
          <p className="mt-3 text-[14.5px] text-[var(--c-sub)] leading-[1.85] max-w-[720px]">{lead}</p>
        )}
        <div className={title || lead ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function AudienceCards({ site }: { site: ServiceSite }) {
  return (
    <ul className="list-none m-0 p-0 grid gap-4 md:grid-cols-3">
      {site.audience.map((a) => (
        <li key={a.title} className="border border-[var(--c-line)] bg-white px-5 py-5">
          <p className="text-[15px] font-bold text-[var(--c-text)]">{a.title}</p>
          <p className="mt-2 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">{a.desc}</p>
        </li>
      ))}
    </ul>
  );
}

export function DeliverableCards({ site }: { site: ServiceSite }) {
  return (
    <ul className="list-none m-0 p-0 grid gap-4 md:grid-cols-2">
      {site.deliverables.map((d) => (
        <li key={d.title} className="border border-[var(--c-line)] bg-white px-5 py-5">
          <p className="text-[15px] font-bold text-[var(--c-text)]">{d.title}</p>
          <p className="mt-2 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">{d.desc}</p>
        </li>
      ))}
    </ul>
  );
}

export function FeatureGrid({ service }: { service: ServiceItem }) {
  return (
    <ul className="list-none m-0 p-0 grid gap-px bg-[var(--c-line)] border border-[var(--c-line)] md:grid-cols-2">
      {service.features.map((f) => (
        <li key={f.title} className="bg-white px-5 py-5">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 shrink-0 text-[var(--c-main)] mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={f.iconPath} />
            </svg>
            <div>
              <p className="text-[14.5px] font-bold text-[var(--c-text)]">{f.title}</p>
              <p className="mt-1.5 text-[13px] text-[var(--c-sub)] leading-[1.8]">{f.desc}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StepList({ site }: { site: ServiceSite }) {
  if (!site.steps) return null;
  return (
    <ol className="list-none m-0 p-0 grid gap-px bg-[var(--c-line)] border border-[var(--c-line)] md:grid-cols-2 lg:grid-cols-3">
      {site.steps.map((st, i) => (
        <li key={st.title} className="bg-white px-5 py-6">
          <span className="block text-[12px] font-bold text-[var(--c-main)] tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-[15px] font-bold text-[var(--c-text)]">{st.title}</p>
          <p className="mt-2 text-[13px] text-[var(--c-sub)] leading-[1.8]">{st.desc}</p>
        </li>
      ))}
    </ol>
  );
}

export function CaseGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.id}>
          <a
            href={`https://hsweb.pics/portfolio/${it.seq}`}
            className="flex flex-col h-full border border-[var(--c-line)] bg-white no-underline group hover:border-[var(--c-main)] transition-colors"
          >
            <Hatch className="aspect-[16/10] border-b border-[var(--c-line)]" />
            <span className="flex-1 px-5 py-4">
              <span className="block text-[12px] font-semibold text-[var(--c-main)]">{it.category}</span>
              <span className="block mt-1.5 text-[15px] font-bold text-[var(--c-text)] group-hover:text-[var(--c-main)] transition-colors">
                {it.title}
              </span>
              {it.client && it.client !== it.title && (
                <span className="block mt-1 text-[12.5px] text-[var(--c-sub)]">{it.client}</span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function GlossaryList({ site }: { site: ServiceSite }) {
  if (!site.glossary) return null;
  return (
    <dl className="m-0 border-t border-[var(--c-line)]">
      {site.glossary.map((g) => (
        <div
          key={g.term}
          className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-6 border-b border-[var(--c-line)] py-4"
        >
          <dt className="text-[14.5px] font-bold text-[var(--c-text)]">
            {g.term}
            <span className="ml-2 text-[12px] font-semibold text-[var(--c-sub-2)]">{g.en}</span>
          </dt>
          <dd className="m-0 text-[13.5px] text-[var(--c-sub)] leading-[1.85]">{g.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <ul className="list-none m-0 p-0 border-t border-[var(--c-line)]">
      {faqs.map((f) => (
        <li key={f.q} className="border-b border-[var(--c-line)] py-5">
          <p className="text-[15px] font-bold text-[var(--c-text)]">{f.q}</p>
          <p className="mt-2 text-[14px] text-[var(--c-sub)] leading-[1.85]">{f.a}</p>
        </li>
      ))}
    </ul>
  );
}

/** 페이지 끝마다 두는 상담 유도 띠 */
export function CtaBand({ siteName }: { siteName: string }) {
  return (
    <section className="bg-[#0b1220] text-white">
      <div className="max-w-[1280px] mx-auto px-5 py-14 md:py-16 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-[20px] md:text-[26px] font-extrabold tracking-[-0.03em]">
            어떤 작업이 필요한지 알려주세요
          </p>
          <p className="mt-2 text-[14px] text-white/65 leading-[1.8]">
            {siteName} · 영업일 기준 24시간 안에 회신드립니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-[50px] px-7 bg-white text-[#0b1220] text-[15px] font-extrabold no-underline hover:bg-white/90 transition-colors"
          >
            상담 신청
          </Link>
          <a
            href="tel:010-3319-2509"
            className="inline-flex items-center justify-center h-[50px] px-7 border border-white/40 text-white text-[15px] font-bold no-underline hover:bg-white/10 transition-colors tnum"
          >
            010-3319-2509
          </a>
        </div>
      </div>
    </section>
  );
}
