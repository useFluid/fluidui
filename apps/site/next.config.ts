import path from "node:path";
import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  transpilePackages: ["@usefluid/motion", "@usefluid/registry"],
  turbopack: { root: path.join(__dirname, "../..") },
  outputFileTracingRoot: path.join(__dirname, "../.."),
  ...(dev && {
    redirects: async () => [
      { source: "/", destination: "/en/", permanent: false },
      { source: "/docs/:path*", destination: "/en/docs/:path*", permanent: false },
    ],
  }),
};

export default config;
