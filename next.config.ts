import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/grade/:path*',
        destination: '/?mode=online_exam#learning-explorer',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
