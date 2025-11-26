// src/shared/components/KakaoScript.tsx
'use client';

import Script from 'next/script';

export default function KakaoScript() {
  const handleLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      console.log('Kakao SDK Initialized');
    }
  };

  const handleError = () => {
    console.error('Kakao SDK 로드 실패. 광고 차단기가 켜져 있는지 확인해주세요.');
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2txfVW9eBzBCc_v4JqTq54"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
