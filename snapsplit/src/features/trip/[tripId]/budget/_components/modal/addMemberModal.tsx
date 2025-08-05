'use client';

import Image from 'next/image';
import { motion, useMotionValue, useDragControls, animate } from 'framer-motion';
import grabber from '@public/svg/grabber.svg';

const mock = 's4ks0d92';

type AddMemberModalProps = {
  onClose?: () => void;
};

const AddMemberModal = ({ onClose }: AddMemberModalProps) => {
  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mock);
      alert('코드가 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

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
      className="w-full h-[200px] bg-white rounded-t-[20px] px-5 pb-8 flex flex-col items-center justify-center"
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

      <div className="flex pb-3 flex-col gap-1 items-center justify-center">
        <label className="text-grey-550 text-body-2">초대 코드</label>
        <p className="text-title-1 py-2">{mock}</p>
      </div>
      <button
        onClick={handleCopy}
        className="min-w-[320px] cursor-pointer max-w-[375px] w-full lg:max-w-[360px] mx-auto py-[14px] bg-primary rounded-xl flex justify-center items-center"
      >
        <div className="text-white text-label-1">복사하기</div>
      </button>
    </motion.div>
  );
};

export default AddMemberModal;
