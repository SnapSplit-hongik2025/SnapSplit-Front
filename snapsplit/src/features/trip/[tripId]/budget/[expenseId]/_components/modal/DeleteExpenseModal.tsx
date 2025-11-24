'use client';

import Image from 'next/image';
import Button from '@/shared/components/Button';
import close from '@public/svg/close-grey-550.svg';
import OverlayModal from '@/shared/components/modal/OverlayModal';

interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteExpenseModal({ isOpen, onClose, onConfirm }: DeleteExpenseModalProps) {
  return (
    <OverlayModal isOpen={isOpen} onClose={onClose} position="center">
      <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
        <div className="flex items-end justify-end pb-2 w-full">
          <button onClick={onClose} className="cursor-pointer">
            <Image src={close} alt="close" />
          </button>
        </div>
        <span className="text-title-1 pb-6">지출을 삭제할까요?</span>
        <div className="flex gap-3 w-full">
          <Button label="아니요" bg="bg-grey-650" onClick={onClose} />
          <Button label="네" bg="bg-primary" onClick={onConfirm} />
        </div>
      </div>
    </OverlayModal>
  );
}
