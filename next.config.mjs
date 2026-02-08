import { withSerwist } from "@serwist/turbopack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default withSerwist(nextConfig, {
  cacheComponents: true,
});
