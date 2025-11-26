'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { kakaoLogin } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { User } from '@/shared/types/auth';
import Loading from '@/shared/components/loading/Loading';

export default function KaKaoRedirect() {
  const hasRequested = useRef(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
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
        const user: User = {
          userId: res.data.userId,
          userName: res.data.name,
          userCode: res.data.userCode,
        };
        if (res.status === 200) {
          setUser(user);
          setToken(res.data.accessToken, res.data.refreshToken);
          // router.replace('/home');
        }
      } catch (error) {
        console.error('카카오 로그인 실패 : ', error);
        // router.replace('/');
      }
    };
    login();
  }, [router, setUser, setToken]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loading />
    </div>
  );
}
