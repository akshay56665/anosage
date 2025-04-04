import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disables ESLint during production builds.
  eslint: {
    // Warning: This will allow production builds to complete even if there are ESLint errors.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
