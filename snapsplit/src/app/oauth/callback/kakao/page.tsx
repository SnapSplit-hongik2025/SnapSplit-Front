'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const KakaoCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const code = searchParams.get('code');

        if (!code) {
          setError('인가 코드를 받지 못했습니다.');
          setIsLoading(false);
          return;
        }

        // 백엔드에 인가 코드 전송
        const response = await fetch('/auth/kakao/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} 에러 발생`);
        }

        await response.json();

        // 로그인 성공 시 홈으로 리다이렉트
        router.push('/home');
      } catch (err) {
        setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
        setIsLoading(false);
      }
    };

    handleKakaoCallback();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-grey-600">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => router.push('/landing')} className="bg-primary text-white px-4 py-2 rounded-lg">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default KakaoCallbackPage;
