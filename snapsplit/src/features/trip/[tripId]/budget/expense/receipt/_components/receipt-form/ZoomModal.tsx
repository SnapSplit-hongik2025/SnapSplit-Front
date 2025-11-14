'use client';

import Image from 'next/image';

type ZoomModalProps = {
    onClose: () => void;
    receiptUrl: string | null;
}

export default function ZoomModal({ onClose, receiptUrl }: ZoomModalProps) {
  return (
    <div className="wrapper flex flex-col items-center w-full h-full bg-white overflow-hidden">
      <div className="header flex items-center justify-end w-full px-5 py-3">
        <button type="button" onClick={onClose}>
          <Image src="/svg/close-grey-1000.svg" alt="닫기" width={24} height={24} />
        </button>
      </div>
      <div className="zoom flex-1 flex items-center justify-center w-full h-full">
        <Image src={receiptUrl || ''} alt="영수증" width={128} height={128} className="w-full h-auto" />
      </div>
    </div>
  );
}
