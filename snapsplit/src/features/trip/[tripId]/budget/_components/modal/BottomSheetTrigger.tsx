'use client';

import { useState } from 'react';
import FullExpenseModal from './FullExpenseModal';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import topArrow from '@public/svg/topArrow.svg';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';

const BottomSheetTrigger = ({ total, tripId }: { total: number; tripId: string }) => {
  const [open, setOpen] = useState(false);

  // TODO: BottomNavBar fixed 제거 시 포지션 꼬이는 지 확인해보기
  return (
    <>
      <div
        className="display-w-full fixed bottom-[2px] bg-grey-850 pt-[22px] pb-[18px] mb-[58px] flex flex-col items-center"
        onClick={() => setOpen(true)}
      >
        <Image
          alt="지출 상세 모달 열기"
          src={topArrow}
          className="absolute top-[2px]" // 겹치게 위로 끌어올림
        />
        <div className="text-grey-50 text-title-1 text-base z-10">총 {total.toLocaleString()}원 지출</div>
      </div>

      <AnimatePresence>
        {open && (
          <FullScreenModal>
            <FullExpenseModal onClose={() => setOpen(false)} tripId={tripId} />
          </FullScreenModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomSheetTrigger;
