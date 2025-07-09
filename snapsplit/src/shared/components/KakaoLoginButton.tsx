'use client';

import { signIn } from 'next-auth/react';

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = '' }: KakaoLoginButtonProps) => {
  const handleKakaoLogin = () => {
    signIn('kakao', {
      callbackUrl: '/home', // 로그인 후 홈으로 리다이렉트
    });
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
