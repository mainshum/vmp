/** @type {import('next').NextConfig} */
const withBundleAnalyzer = () => {
  return require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
};

const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = process.env.ANALYZE
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
