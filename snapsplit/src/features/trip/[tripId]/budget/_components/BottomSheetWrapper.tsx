'use client';

import { useRef, useEffect } from 'react';
import { useMotionValue, animate, motion, PanInfo } from 'framer-motion';

type Props = {
  children: React.ReactNode;
};

const BottomSheetWrapper = ({ children }: Props) => {
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // drag 범위와 화면 높이 캐싱
  const dragRangeRef = useRef({ top: -300, bottom: 0 });
  const screenHeightRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const height = window.innerHeight;
      screenHeightRef.current = height;

      const topLimit = -height * 0.7;
      dragRangeRef.current = { top: topLimit, bottom: 0 };

      y.set(0); // 초기 위치 설정
    }
  }, [y]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y;
    const draggedRatio = Math.abs(offsetY) / screenHeightRef.current;

    const shouldOpen = offsetY < 0 && draggedRatio > 0.1;

    if (shouldOpen) {
      animate(y, dragRangeRef.current.top, { type: 'spring', stiffness: 300 });
    } else {
      animate(y, 0, { type: 'spring', stiffness: 300 });
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={dragRangeRef.current}
      style={{ y }}
      onDragEnd={handleDragEnd}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[415px] min-w-[360px] lg:max-w-[360px] mx-auto z-50 touch-none"
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
};

export default BottomSheetWrapper;
