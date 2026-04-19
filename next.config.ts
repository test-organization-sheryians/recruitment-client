import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public", // service worker will be generated here
  // disable: process.env.NODE_ENV === "development",
  customWorkderDir: "worker",
});

module.exports = withPWA({
  // reactStrictMode: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
