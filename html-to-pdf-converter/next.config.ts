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
  // Configuração para uso com o @vercel/og
  images: {
    domains: ['localhost', 'relatorio-bmo.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Habilitar CORS para a API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
