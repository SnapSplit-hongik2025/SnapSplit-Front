import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i1.sndcdn.com' },
      {
        protocol: 'https',
        hostname: 'snapsplit-assets.s3.ap-northeast-2.amazonaws.com',
      },
      // 카카오 CDN 추가
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
    ],
   },
 };

export default nextConfig;
