'use client';

import { signIn } from 'next-auth/react';

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = '' }: KakaoLoginButtonProps) => {
  const handleKakaoLogin = () => {
    signIn('kakao');
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
