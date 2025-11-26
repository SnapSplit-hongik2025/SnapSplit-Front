'use client';

import Image from 'next/image';
import close from '@public/svg/close-grey-550.svg';
import OverlayModal from '@/shared/components/modal/OverlayModal';

interface SettledExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'edit' | 'delete';
}

export default function SettledExpenseModal({ isOpen, onClose, type }: SettledExpenseModalProps) {
  const actionText = type === 'edit' ? '수정' : '삭제';

  return (
    <OverlayModal isOpen={isOpen} onClose={onClose} position="center">
      <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
        <div className="flex items-end justify-end pb-2 w-full">
          <button onClick={onClose} className="cursor-pointer">
            <Image src={close} alt="close" />
          </button>
        </div>
        <div className="text-md pb-6 text-center">
          이미 정산된 내역으로, <br />
          {actionText} 불가능합니다.
        </div>
      </div>
    </OverlayModal>
  );
}
