import { withSerwist } from "@serwist/turbopack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  allowedDevOrigins: ['192.168.1.7'],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withSerwist(nextConfig, {
  cacheComponents: true,
});
