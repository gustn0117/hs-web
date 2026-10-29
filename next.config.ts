import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 95],
    // 포트폴리오 썸네일은 자체 호스팅 Supabase 스토리지에서 온다.
    // 등록해 두지 않으면 next/image 가 거부해서 그림이 통째로 안 뜬다.
    remotePatterns: [
      { protocol: "https", hostname: "api.hsweb.pics", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hsweb.pics" }],
        destination: "https://hsweb.pics/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.haonlabs.com" }],
        destination: "https://haonlabs.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
