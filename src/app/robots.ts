import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/client/"],
      },
    ],
    sitemap: "https://hsweb.pics/sitemap.xml",
    host: "https://hsweb.pics",
  };
}
