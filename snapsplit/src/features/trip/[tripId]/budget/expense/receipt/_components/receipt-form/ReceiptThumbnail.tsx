'use client';

import { useState } from 'react';
import Image from 'next/image';
import expand from '@public/svg/expand.svg';
import shrink from '@public/svg/shrink.svg';

type ReceiptThumbnailProps = {
  receiptUrl: string | null;
};

export default function ReceiptThumbnail({ receiptUrl }: ReceiptThumbnailProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 클릭 시 모달이 열리지 않도록 이벤트 전파 중단
    setIsExpanded((prev) => !prev);
  };

  if (!receiptUrl) return null;

  return (
    <div className="relative w-full">
      <div
        className={`w-full rounded-xl overflow-hidden bg-grey-150 transition-all duration-300 ${
          isExpanded ? '' : 'h-50 flex justify-center items-center'
        }`}
      >
        <Image
          src={receiptUrl}
          alt="영수증 미리보기"
          width={500}
          height={800}
          className={`${isExpanded ? 'w-full h-auto' : 'h-full w-auto object-contain'}`}
          priority
        />
      </div>

      <button
        onClick={handleToggleExpand}
        className="absolute bottom-3 right-3 p-1 bg-grey-50 bg-opacity-80 hover:bg-opacity-100 border border-grey-250 rounded-lg transition-all z-10"
      >
        <Image
          src={isExpanded ? shrink : expand}
          alt={isExpanded ? '접기' : '확장하기'}
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </button>
    </div>
  );
}
