import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'puppeteer', 'chrome-aws-lambda'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Evita que o webpack tente empacotar estas bibliotecas
      config.externals = [
        ...(config.externals || []), 
        'puppeteer', 
        'puppeteer-core',
        'chrome-aws-lambda'
      ];
    }
    return config;
  },
};

export default nextConfig;
