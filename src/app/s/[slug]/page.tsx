import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { getPortfolioItems } from "@/lib/portfolio";
import ContactForm from "@/app/(main)/contact/ContactForm";
import { ServiceHeader, ServiceFooter } from "./SiteChrome";
import { Hatch, DeviceFrames } from "./Placeholders";

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICE_SITES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service) return {};

  const url = serviceSiteUrl(slug);
  const title = `${site.titleLead} — ${site.heroTitle}`;
  const description = `${site.heroLead} ${service.description}`.slice(0, 155);

  return {
    // 본 사이트의 " | HS WEB" 꼬리표가 붙지 않도록 제목을 그대로 쓴다.
    title: { absolute: title },
    description,
    keywords: site.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: site.siteName,
      locale: "ko_KR",
    },
    robots: { index: true, follow: true },
  };
}

function Section({
  id,
  overline,
  title,
  children,
}: {
  id?: string;
  overline?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-14 md:py-20 border-b border-[var(--c-line)] last:border-b-0">
      <div className="max-w-[1100px] mx-auto px-5">
        {overline && (
          <p className="text-[12px] font-bold text-[var(--c-main)] mb-2">{overline}</p>
        )}
        <h2 className="text-[22px] md:text-[28px] font-extrabold tracking-[-0.03em] text-[var(--c-text)]">
          {title}
        </h2>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

export default async function ServiceSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service) notFound();

  const url = serviceSiteUrl(slug);
  const faqs = [...service.faqs, ...site.extraFaqs];

  // 보여줄 분류가 지정된 사이트만 실제 제작 사례를 가져온다.
  const showcase = site.showcaseCategories
    ? (await getPortfolioItems())
        .filter((it) => site.showcaseCategories!.includes(it.category))
        .slice(0, 6)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}/#service`,
        name: site.titleLead,
        serviceType: service.title,
        description: service.description,
        url,
        areaServed: { "@type": "Country", name: "KR" },
        provider: {
          "@type": "ProfessionalService",
          name: "HS WEB",
          url: "https://hsweb.pics",
          telephone: "+82-10-3319-2509",
          address: { "@type": "PostalAddress", addressLocality: "서울", addressCountry: "KR" },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: site.siteName,
        url,
        inLanguage: "ko-KR",
        publisher: { "@type": "Organization", name: "HS WEB", url: "https://hsweb.pics" },
      },
      {
        // 본 사이트 서비스 페이지와 같은 문답이 양쪽에 색인되지 않도록
        // 구조화 데이터는 이 사이트에만 있는 문답으로 좁힌다.
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: site.extraFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceHeader siteName={site.siteName} />

      {/* 첫 화면 */}
      <section className="bg-[#0b1220] text-white">
        <div className="max-w-[1100px] mx-auto px-5 py-16 md:py-24">
          <p className="text-[13px] font-bold text-white/55">{service.title}</p>
          <h1 className="mt-3 text-[30px] md:text-[46px] font-extrabold leading-[1.22] tracking-[-0.035em] max-w-[780px]">
            {site.heroTitle}
          </h1>
          <p className="mt-5 text-[15px] md:text-[17px] text-white/70 leading-[1.8] max-w-[640px]">
            {site.heroLead}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-[50px] px-7 bg-white text-[#0b1220] text-[15px] font-extrabold no-underline hover:bg-white/90 transition-colors"
            >
              상담 신청
            </a>
            <a
              href="tel:010-3319-2509"
              className="inline-flex items-center justify-center h-[50px] px-7 border border-white/40 text-white text-[15px] font-bold no-underline hover:bg-white/10 transition-colors tnum"
            >
              010-3319-2509
            </a>
          </div>
          <ul className="list-none m-0 p-0 mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {service.tags.map((t) => (
              <li key={t} className="text-[13px] text-white/55">
                {t}
              </li>
            ))}
          </ul>

          {site.concept && (
            <div className="mt-14">
              <DeviceFrames tone="dark" />
            </div>
          )}
        </div>
      </section>

      {site.concept && (
        <Section overline="먼저 알아두기" title={`${site.concept.plain}`}>
          <p className="text-[13px] font-semibold text-[var(--c-main)]">
            이걸 업계에서는 {site.concept.term}이라고 부릅니다
          </p>
          <p className="mt-3 text-[15px] md:text-[16px] text-[var(--c-text-2)] leading-[1.9] max-w-[720px]">
            {site.concept.detail}
          </p>
          <ul className="list-none m-0 p-0 mt-8 grid gap-px bg-[var(--c-line)] border border-[var(--c-line)] md:grid-cols-3">
            {site.concept.points.map((pt) => (
              <li key={pt.label} className="bg-white px-5 py-5">
                <p className="text-[14.5px] font-bold text-[var(--c-text)]">{pt.label}</p>
                <p className="mt-2 text-[13px] text-[var(--c-sub)] leading-[1.8]">{pt.desc}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section overline="이런 경우에" title="이럴 때 필요한 작업입니다">
        <ul className="list-none m-0 p-0 grid gap-4 md:grid-cols-3">
          {site.audience.map((a) => (
            <li key={a.title} className="border border-[var(--c-line)] bg-white px-5 py-5">
              <p className="text-[15px] font-bold text-[var(--c-text)]">{a.title}</p>
              <p className="mt-2 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">{a.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section overline="작업 범위" title="무엇을 해드리는지">
        <ul className="list-none m-0 p-0 grid gap-4 md:grid-cols-2">
          {site.deliverables.map((d) => (
            <li key={d.title} className="border border-[var(--c-line)] bg-white px-5 py-5">
              <p className="text-[15px] font-bold text-[var(--c-text)]">{d.title}</p>
              <p className="mt-2 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">{d.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      {site.steps && (
        <Section overline="진행 순서" title="이런 순서로 진행합니다">
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
        </Section>
      )}

      <Section overline="포함 사항" title="기본으로 들어가는 것들">
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

        <div className="mt-8">
          <p className="text-[12px] font-bold text-[var(--c-main)] mb-2.5">사용하는 기술</p>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
            {service.technologies.map((t) => (
              <li
                key={t}
                className="inline-flex items-center h-7 px-2.5 bg-[var(--c-bg-2)] text-[12px] font-semibold text-[var(--c-text-2)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {showcase.length > 0 && (
        <Section overline="제작 사례" title="이렇게 만들어 드렸습니다">
          <ul className="list-none m-0 p-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((it) => (
              <li key={it.id}>
                <a
                  href={`https://hsweb.pics/portfolio/${it.seq}`}
                  className="flex flex-col h-full border border-[var(--c-line)] bg-white no-underline group hover:border-[var(--c-main)] transition-colors"
                >
                  <Hatch className="aspect-[16/10] border-b border-[var(--c-line)]" />
                  <span className="flex-1 px-5 py-4">
                    <span className="block text-[12px] font-semibold text-[var(--c-main)]">
                      {it.category}
                    </span>
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
          <p className="mt-5 text-[13.5px] text-[var(--c-sub)]">
            <a
              href="https://hsweb.pics/portfolio"
              className="text-[var(--c-main)] font-semibold underline underline-offset-2"
            >
              전체 제작 사례 보기
            </a>
          </p>
        </Section>
      )}

      {site.glossary && (
        <Section overline="용어 풀이" title="상담하면서 자주 나오는 말들">
          <p className="text-[14px] text-[var(--c-sub)] leading-[1.8] mb-6">
            몰라도 진행에는 문제없습니다. 다만 알고 계시면 견적서를 읽기가 훨씬 수월합니다.
          </p>
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
        </Section>
      )}

      <Section overline="비용" title="금액은 이렇게 정해집니다">
        <div className="border-l-4 border-[var(--c-main)] bg-[var(--c-main-bg)] px-5 py-5 md:px-7">
          <p className="text-[15px] md:text-[16px] text-[var(--c-text)] leading-[1.85]">{site.priceNote}</p>
        </div>
        <p className="mt-4 text-[13.5px] text-[var(--c-sub)] leading-[1.8]">
          정확한 금액은 페이지 수와 기능에 따라 달라집니다.{" "}
          <a
            href="https://hsweb.pics/pricing"
            className="text-[var(--c-main)] font-semibold underline underline-offset-2"
          >
            전체 가격 기준
          </a>
          도 함께 확인해보세요.
        </p>
      </Section>

      <Section overline="자주 묻는 질문" title="미리 알아두면 좋은 것들">
        <ul className="list-none m-0 p-0 border-t border-[var(--c-line)]">
          {faqs.map((f) => (
            <li key={f.q} className="border-b border-[var(--c-line)] py-5">
              <p className="text-[15px] font-bold text-[var(--c-text)]">{f.q}</p>
              <p className="mt-2 text-[14px] text-[var(--c-sub)] leading-[1.85]">{f.a}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" overline="문의" title="어떤 작업이 필요한지 알려주세요">
        <p className="text-[14px] text-[var(--c-sub)] leading-[1.8] mb-7">
          연락처와 필요한 내용을 남겨주시면 영업일 기준 24시간 안에 회신드립니다. 바로 통화를 원하시면
          평일 10시부터 19시 사이에 전화 주셔도 됩니다.
        </p>
        <ContactForm defaultCategory={slug} />
      </Section>

      <ServiceFooter siteName={site.siteName} />
    </>
  );
}
