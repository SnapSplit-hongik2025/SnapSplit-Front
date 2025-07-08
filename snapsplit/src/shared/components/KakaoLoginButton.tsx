'use client';

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = '' }: KakaoLoginButtonProps) => {
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
      console.error('카카오 OAuth 환경 변수가 설정되지 않았습니다.');
      return;
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    window.location.href = kakaoAuthUrl;
    // 카카오 로그인 페이지로 이동
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
