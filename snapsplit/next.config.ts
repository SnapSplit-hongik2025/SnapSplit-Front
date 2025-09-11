import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i1.sndcdn.com' },
      {
        protocol: 'https',
        hostname: 'snapsplit-assets.s3.ap-northeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'img1.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;
