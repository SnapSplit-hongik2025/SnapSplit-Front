'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { kakaoLogin } from '@/lib/api/auth';
import { setAccessToken, setRefreshToken } from '@/shared/utils/tokenUtil';

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

    const login = async () => {
      try {
        const res = await kakaoLogin(code);
        if (res.status === 200) {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          router.replace('/home');
        }
      } catch (error) {
        console.error('카카오 로그인 실패 : ', error);
        router.replace('/');
      }
    };
    login();
  }, [router]);

  return <div>Redirecting...</div>;
}
