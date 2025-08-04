'use client';

import { useEffect, useRef } from 'react';
import publicInstance from '@/api/instance/publicInstance';
import { useRouter } from 'next/navigation';

export default function KaKaoRedirect() {
  const hasRequested = useRef(false);
  const router = useRouter();
  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      alert('인증 코드가 없습니다.');
      router.replace('/');
      return;
    }

    const kakaoLogin = async () => {
      try {
        const res = await publicInstance.post(`/auth/kakao/login?code=${code}`);
        if (res.status === 200) {
          router.replace('/home');
        }
      } catch (error) {
        console.error('카카오 로그인 실패 : ', error);
        router.replace('/');
      }
    };
    kakaoLogin();
  }, [router]);

  return <div>Redirecting...</div>;
}
