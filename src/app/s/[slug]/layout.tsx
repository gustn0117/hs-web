import { notFound } from "next/navigation";
import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";
import { getServiceBySlug } from "@/lib/services";
import ServiceNav from "./ServiceNav";
import { buildNav, buildPanelGroups } from "./siteNav";
import { ServiceFooter } from "./SiteChrome";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import HaramAnalytics from "@/components/HaramAnalytics";

export function generateStaticParams() {
  return SERVICE_SITES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  const service = getServiceBySlug(slug);
  if (!site || !service) notFound();

  const url = serviceSiteUrl(slug);
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
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceNav siteName={site.siteName} nav={buildNav(site)} groups={buildPanelGroups(site)} />
      <main>{children}</main>
      <ServiceFooter siteName={site.siteName} nav={buildNav(site)} />
      <GoogleAnalytics />
      <HaramAnalytics />
    </>
  );
}
