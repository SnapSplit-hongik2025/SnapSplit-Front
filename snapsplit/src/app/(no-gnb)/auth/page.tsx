'use client';

import { useRouter } from 'next/navigation';

export default function Auth() {
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const router = useRouter();

  const kakaoLogin = () => {
    // 환경 변수가 제대로 설정되어 있는지 확인
    if (!REST_API_KEY || !REDIRECT_URI) {
      console.error("환경 변수에 문제가 있습니다.", "REST_API_KEY : ", REST_API_KEY ? "제공됨" : "제공되지 않음", "REDIRECT_URI : ", REDIRECT_URI ? "제공됨" : "제공되지 않음");
      alert("로그인에 실패했습니다.");
      router.push('/');
      return;
    }

    // 카카오 로그인 URL 생성
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // 카카오 로그인 시도
    try {
      window.location.href = kakaoLoginUrl;
    } catch (error) {
      console.error("Kakao 로그인 리다이렉트 실패 : ", error);
      alert("로그인에 실패했습니다.");
      router.push('/');
    }
  };

  return <button onClick={kakaoLogin} className="bg-amber-300 w-full py-5 px-4 cursor-pointer">로그인 버튼</button>;
}
