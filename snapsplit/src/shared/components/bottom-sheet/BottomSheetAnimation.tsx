'use client';

import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useDragControls,
  animate,
  PanInfo,
} from 'framer-motion';
import grabber from '@public/svg/grabber.svg';
import { ReactNode, useRef } from 'react';

type BottomSheetAnimationProps = {
  children: ReactNode;
  onClose: () => void;
};

const BottomSheetAnimation = ({
  children,
  onClose,
}: BottomSheetAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const controls = useDragControls();

  // 애니메이션과 함께 모달을 닫는 함수
  const animateAndClose = async () => {
    // 아래로 사라지는 애니메이션 실행
    await animate(y, window.innerHeight, {
      type: 'tween',
      duration: 0.2,
      ease: 'easeIn',
    });
    // 애니메이션이 끝나면 부모에게 받은 onClose 함수 호출
    onClose();
  };

  const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 아래 방향으로만 드래그 되도록 제한
    if (info.offset.y > 0) {
      y.set(info.offset.y);
    } else {
      y.set(0);
    }
  };

  const handleDragEnd = () => {
    const currentY = y.get();
    // 일정 거리(50px) 이상 드래그하면 닫기
    if (currentY > 50) {
      animateAndClose();
    } else {
      // 그렇지 않으면 원래 위치로 복귀
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 });
    }
  };

  return (
    <motion.div
      ref={ref}
      // --- 애니메이션과 드래그 로직 ---
      style={{ y }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0.05, bottom: 1 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      // --- UI와 관련된 부분 ---
      className="fixed bottom-0 left-0 right-0 min-w-[360px] max-w-[415px] lg:max-w-[360px] mx-auto h-auto bg-white rounded-t-[20px] flex flex-col"
    >
      {/* 드래그 핸들 */}
      <div
        className="flex w-full justify-center py-3 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e, { snapToCursor: false })}
      >
        <Image src={grabber} alt="handle modal" />
      </div>

      {/* 실제 콘텐츠가 렌더링될 영역 */}
      <div className="px-5 pb-8">{children}</div>
    </motion.div>
  );
};

export default BottomSheetAnimation;