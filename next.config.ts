import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude tentropy-sandbox directory from the build
    // This is a separate utility folder for E2B template building
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/tentropy-sandbox/**'],
    };
    return config;
  },
};

export default nextConfig;
