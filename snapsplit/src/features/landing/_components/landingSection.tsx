'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import landing_logo from '@public/svg/landing-logo.svg';
import KakaoLoginButton from '@/shared/components/KakaoLoginButton';

const LandingSection = () => {
  const [showKakao, setShowKakao] = useState(false);

  return (
    <main className="flex flex-col justify-between w-full h-screen p-6 bg-gradient-to-br from-[#B9F5E2] via-white to-[#DDF9F7]">
      {/* 상단 콘텐츠 */}
      <div className="flex flex-col pt-44 gap-5 items-center">
        <Image src={landing_logo} alt="SnapSplit" />
        <div className="flex flex-col items-center text-[16px] font-light text-primary justify-center">
          <p>Snap the memories,</p>
          <p>Split the costs</p>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <AnimatePresence mode="wait">
        {!showKakao ? (
          <motion.button
            key="start"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full bg-primary flex justify-center p-4 rounded-2xl text-white cursor-pointer"
            onClick={() => setShowKakao(true)}
          >
            시작하기
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <KakaoLoginButton />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default LandingSection;
