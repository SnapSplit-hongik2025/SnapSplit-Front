'use client';

import grabber from '@public/svg/grabber.svg';
import Image from 'next/image';
import { motion, useMotionValue, useDragControls, animate } from 'framer-motion';

type CurrencyBottomSheetProps = {
  onClose?: () => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
};

// TODO: 테스트 데이터
const currencyList = ['한국 - KRW(원)', '미국 - USD(달러)', '유럽 - EUR(유로)', '일본 - JPY(엔)'];

const CurrencyBottomSheet = ({ onClose, selectedCurrency, setCurrency }: CurrencyBottomSheetProps) => {
  const y = useMotionValue(0);
  const controls = useDragControls();

  const animateAndClose = async () => {
    await animate(y, 500, { type: 'tween', duration: 0.2, ease: 'easeIn' });

    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      style={{ y }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full bg-white rounded-t-[20px] px-5 pb-8 flex flex-col items-center justify-center"
      drag="y"
      dragListener={false}
      dragControls={controls}
      onDrag={(e, info) => {
        if (info.offset.y > 0) {
          // 하단 스크롤만 가능
          y.set(info.offset.y);
        } else {
          // 상단 스크롤 제한
          y.set(0);
        }
      }}
      onDragEnd={() => {
        const currentY = y.get();
        if (currentY > 10) {
          animateAndClose();
        } else {
          animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
        }
      }}
    >
      <div
        className="flex w-full flex-1 justify-center py-3 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <Image src={grabber} alt="handle modal" />
      </div>

      <div className="flex flex-col w-full">
        {currencyList.map((currency) => (
          <button key={currency} onClick={() => {setCurrency(currency); onClose?.()}} className="flex items-center py-3">
            {currency === selectedCurrency && <Image alt="check" src="/svg/check-green.svg" width={24} height={24} />}
            {currency !== selectedCurrency && <Image alt="check" src="/svg/check_grey.svg" width={24} height={24} />}
            <div className={`pl-[1.5px] text-body-1 ${currency === selectedCurrency ? 'text-primary' : 'text-grey-1000'}`}>{currency}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CurrencyBottomSheet;