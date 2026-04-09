import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ci2-assets.chainsinventinsanity.lol",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "ci2-assets.chainsinventinsanity.lol",
        pathname: "/card_data/**",
      },
      {
        protocol: "https",
        hostname: "ci2-assets.chainsinventinsanity.lol",
        pathname: "/css/**",
      },
    ],
  },
};

export default nextConfig;
