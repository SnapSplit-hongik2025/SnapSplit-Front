'use client';

import { signIn } from 'next-auth/react';

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = '' }: KakaoLoginButtonProps) => {
  const handleKakaoLogin = async () => {
    // 자동 리다이렉트 off + 카카오 인증 페이지로 즉시 이동
    const res = await signIn('kakao', {
      redirect: false,
      // 카카오 로그인 후 리다이렉트할 URL
      callbackUrl: '/profile',
    });
    console.log('Kakao login response:', res);
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className={`p-3 rounded-lg text-black bg-[#FEE500] cursor-pointer w-full font-medium ${className}`}
    >
      카카오 로그인
    </button>
  );
};

export default KakaoLoginButton;
