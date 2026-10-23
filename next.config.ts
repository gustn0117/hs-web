import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hsweb.pics" }],
        destination: "https://hsweb.pics/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
