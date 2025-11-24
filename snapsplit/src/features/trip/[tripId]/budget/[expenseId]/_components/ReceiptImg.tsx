'use client';

import { useState } from 'react';
import { ReceiptImgProps } from '../types/expense-detail-type';
// SVG 아이콘들을 import 합니다.
import expand from '@public/svg/expand.svg'; // 확장 아이콘 경로
import shrink from '@public/svg/shrink.svg'; // 축소 아이콘 경로
import Image from 'next/image';

export default function ReceiptImg({ receiptUrl }: ReceiptImgProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="relative w-full mt-6">
      <div
        className={`w-full rounded-xl overflow-hidden bg-grey-150 transition-all duration-300 ${
          isExpanded ? '' : 'h-50 flex justify-center items-center'
        }`}
      >
        <Image
          src={receiptUrl}
          alt="영수증 추가 이미지"
          width={500}
          height={800}
          className={`${isExpanded ? 'w-full h-auto' : 'h-full w-auto'}`}
          priority
        />
      </div>

      <button
        onClick={handleToggleExpand}
        className="absolute bottom-0 right-0 m-3 p-1 text-sm font-bold text-primary bg-opacity-50 hover:bg-opacity-75 transition-all bg-grey-50 rounded-lg cursor-pointer border-grey-250 border" // border-1을 border로 변경
      >
        <Image src={isExpanded ? shrink : expand} alt={isExpanded ? '접기' : '확장하기'} width={20} height={20} />
      </button>
    </div>
  );
}
