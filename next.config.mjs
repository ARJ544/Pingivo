import { withSerwist } from "@serwist/turbopack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
};

export default withSerwist(nextConfig, {
  cacheComponents: true,
});
