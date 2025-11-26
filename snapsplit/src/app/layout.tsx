import type { Metadata } from 'next';
import './globals.css';
import { calSans } from '@/shared/fonts/cal-sans';
import QueryProvider from '@/lib/providers/QueryProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'SnapSplit',
  description: 'Trip & Photo Management Service',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={calSans.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css"
          crossOrigin="anonymous"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className="h-[100dvh] min-w-[360px] max-w-[415px] lg:max-w-[360px] mx-auto bg-white text-grey-1000 scroll-smooth"
      >
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2txfVW9eBzBCc_v4JqTq54"
          crossOrigin="anonymous"
          strategy="lazyOnload" // 페이지 로드 후 비동기로 로드
        />
        <QueryProvider>
          <div id="modal-root" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
