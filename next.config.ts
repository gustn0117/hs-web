import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
