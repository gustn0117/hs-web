import { SERVICE_SITES, getServiceSite, serviceSiteUrl } from "@/lib/service-sites";

export const revalidate = 3600;

export function generateStaticParams() {
  return SERVICE_SITES.map((s) => ({ slug: s.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getServiceSite(slug)) {
    return new Response("Not found", { status: 404 });
  }

  const body = `User-agent: *
Allow: /

Sitemap: ${serviceSiteUrl(slug)}/sitemap.xml
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
