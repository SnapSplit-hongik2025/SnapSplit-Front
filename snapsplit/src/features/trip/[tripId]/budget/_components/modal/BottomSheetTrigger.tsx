'use client';

import { useState } from 'react';
import FullExpenseModal from './FullExpenseModal';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import topArrow from '@public/svg/topArrow.svg';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';

const BottomSheetTrigger = ({ total }: { total: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="lg:max-w-[360px] mx-auto mb-[58px] fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[415px] min-w-[360px] bg-neutral-500 pt-[22px] pb-[18px] flex flex-col items-center"
        onClick={() => setOpen(true)}
      >
        <Image
          alt="지출 상세 모달 열기"
          src={topArrow}
          className="absolute top-[2px]" // 겹치게 위로 끌어올림
        />
        <div className="text-grey-50 text-title-1 z-10">총 {total.toLocaleString()}원 지출</div>
      </div>

      <AnimatePresence>
        {open && (
          <FullScreenModal>
            <FullExpenseModal onClose={() => setOpen(false)} />
          </FullScreenModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomSheetTrigger;
