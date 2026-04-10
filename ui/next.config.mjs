import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Mirrors APP_ENV at build time so the client bundle can pick API/Swagger defaults (see ui/lib/api.ts). */
const appEnv = process.env.APP_ENV ?? "dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_ENV: appEnv,
  },
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
