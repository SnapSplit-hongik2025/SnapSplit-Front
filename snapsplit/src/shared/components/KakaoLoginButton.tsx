'use client';

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = '' }: KakaoLoginButtonProps) => {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 버튼 클릭');
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
