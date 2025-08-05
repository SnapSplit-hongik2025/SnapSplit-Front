import OverlayModal from '../modal/OverlayModal';
import BottomSheetAnimation from './BottomSheetAnimation';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BottomSheet = ({ isOpen, onClose, children }: BottomSheetProps) => {
  console.log('[BottomSheet]: render, isOpen =', isOpen);

  return (
    <OverlayModal isOpen={isOpen} onClose={onClose} position="bottom">
      <BottomSheetAnimation onClose={onClose}>{children}</BottomSheetAnimation>
    </OverlayModal>
  );
};

export default BottomSheet;
