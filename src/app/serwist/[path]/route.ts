import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";
import nextConfig from "../../../../next.config.mjs";

// Revision helps invalidate old cache
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout || crypto.randomUUID();

export const {
  dynamic,
  dynamicParams,
  revalidate,
  generateStaticParams,
  GET,
} = createSerwistRoute({
  swSrc: "src/app/sw.ts",
  nextConfig,
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision,
    },
  ],
  useNativeEsbuild: true,
});