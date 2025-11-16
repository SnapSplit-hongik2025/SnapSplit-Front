'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import landing_logo from '@public/svg/landing-logo.svg';
import { useRouter } from 'next/navigation';

const LandingSection = () => {
  const router = useRouter();
  const [showKakao, setShowKakao] = useState(false);
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const handleKakaoLogin = () => {
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

  return (
    <main className="flex flex-col justify-between w-full h-screen p-6 bg-white">
      {/* 상단 콘텐츠 */}
      <div className="flex flex-col pt-44 gap-5 items-center">
        <Image src={landing_logo} alt="SnapSplit" />
        <label className="text-label-2 text-primary justify-center">즐거움은 나누고, 정산은 쉽게!</label>
      </div>

      {/* 하단 고정 버튼 */}
      <AnimatePresence mode="wait">
        {!showKakao ? (
          <motion.button
            key="start"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full bg-primary flex justify-center p-4 rounded-2xl text-white cursor-pointer"
            onClick={() => setShowKakao(true)}
          >
            시작하기
          </motion.button>
        ) : (
          <motion.button
            key="kakao"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full bg-yellow-300 flex justify-center p-3 rounded-2xl text-black cursor-pointer"
            onClick={handleKakaoLogin}
          >
            카카오 로그인
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export default LandingSection;
