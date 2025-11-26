// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { calSans } from '@/shared/fonts/cal-sans';
import QueryProvider from '@/lib/providers/QueryProvider';
import KakaoScript from '@/shared/components/KakaoScript';

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
        <KakaoScript />

        <QueryProvider>
          <div id="modal-root" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
