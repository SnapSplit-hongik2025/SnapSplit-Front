import OverlayModal from '../modal/OverlayModal';
import Image from 'next/image';
import grabber from '@public/svg/grabber.svg';
import { motion, useMotionValue, useDragControls, animate } from 'framer-motion';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BottomSheet = ({ isOpen, onClose, children }: BottomSheetProps) => {
  console.log('isOpen', isOpen);
  const y = useMotionValue(0);
  const controls = useDragControls();

  const animateAndClose = async () => {
    await animate(y, window.innerHeight, { type: 'tween', duration: 0.2, ease: 'easeIn' });
    onClose();
  };

  return (
    <OverlayModal isOpen={isOpen} onClose={onClose} position="bottom">
      <motion.div
        style={{ y }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full flex flex-col items-center px-5 pb-8 gap-3 bg-white rounded-t-2xl"
        drag="y"
        dragListener={false}
        dragControls={controls}
        onDrag={(e, info) => {
          if (info.offset.y > 0) {
            y.set(info.offset.y);
          } else {
            y.set(0);
          }
        }}
        onDragEnd={() => {
          const currentY = y.get();
          if (currentY > 20) {
            animateAndClose();
          } else {
            animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
          }
        }}
      >
        <div
          className="flex w-full flex-1 justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => controls.start(e)}
        >
          <Image alt="grabber" src={grabber} />
        </div>
        {children}
      </motion.div>
    </OverlayModal>
  );
};

export default BottomSheet;
