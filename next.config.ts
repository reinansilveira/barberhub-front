import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.tcdn.com.br",
      },
      {
        protocol: "https",
        hostname: "meusite.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;