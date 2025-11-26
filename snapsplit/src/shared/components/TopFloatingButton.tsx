'use client';

import Image from 'next/image';
import arrow from '@public/svg/arrow-top-white.svg';

const TopFloatingButton = () => {
  const handleScrollTop = () => {
    const container = document.getElementById('scroll-target-top');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn('[TopFloatingButton] 스크롤 컨테이너를 찾지 못했습니다.');
    }
  };

  return (
    <div className="fixed bottom-[134px] right-[max(calc((100vw-415px)/2+1.25rem),1.25rem)] lg:right-[max(calc((100vw-360px)/2+1.25rem),1.25rem)] z-floating">
      <button
        onClick={handleScrollTop}
        aria-label="맨 위로 스크롤"
        title="맨 위로 이동"
        className="w-11 h-11 p-2 cursor-pointer bg-primary rounded-[40px] shadow-[0_0_2px_rgba(34,34,34,0.25)] inline-flex justify-center items-center"
      >
        <Image alt="" src={arrow} width={20} height={20} />
      </button>
    </div>
  );
};

export default TopFloatingButton;
