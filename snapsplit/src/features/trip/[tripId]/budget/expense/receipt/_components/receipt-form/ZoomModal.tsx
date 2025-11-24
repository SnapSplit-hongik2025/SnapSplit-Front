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
      <div className="zoom flex-1 flex items-center justify-center w-full h-full p-4">
        {receiptUrl && (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image 
              src={receiptUrl} 
              alt="영수증" 
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-height: 1024px) 100vh, 80vw"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
