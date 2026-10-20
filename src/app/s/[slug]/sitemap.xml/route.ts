import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICE_SITES.map((s) => ({ slug: s.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getServiceSite(slug);
  if (!site) {
    return new Response("Not found", { status: 404 });
  }

  const base = serviceSiteUrl(slug);
  // 그 사이트에 실제로 있는 페이지만 싣는다.
  const paths: { path: string; priority: string }[] = [{ path: "", priority: "1.0" }];
  if (site.concept) paths.push({ path: "/about", priority: "0.9" });
  if (site.steps) paths.push({ path: "/process", priority: "0.8" });
  if (site.showcaseCategories) paths.push({ path: "/cases", priority: "0.8" });
  paths.push({ path: "/pricing", priority: "0.8" });
  paths.push({ path: "/faq", priority: "0.7" });
  if (site.glossary) paths.push({ path: "/glossary", priority: "0.6" });
  paths.push({ path: "/contact", priority: "0.7" });

  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${base}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
