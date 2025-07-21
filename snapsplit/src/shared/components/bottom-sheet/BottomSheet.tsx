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
        className="w-full"
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
        <div className="flex flex-col items-center w-full pt-3 px-5 pb-8 gap-3 bg-white rounded-t-[20px]">
          <motion.div
            className="cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={(e) => controls.start(e)}
          >
            <Image alt="grabber" src={grabber} width={grabber.width} height={grabber.height} />
          </motion.div>
          {children}
        </div>
      </motion.div>
    </OverlayModal>
  );
};

export default BottomSheet;
