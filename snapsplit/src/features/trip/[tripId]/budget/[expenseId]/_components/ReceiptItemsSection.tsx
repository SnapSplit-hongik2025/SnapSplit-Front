import { useState } from 'react';
import { ReceiptItemsSectionProps } from '../types/expense-detail-type';
import ReceiptItem from './ReceiptItem';
import arrow from '@public/svg/arrow-bottom-grey-450.svg';
import Image from 'next/image';

export default function ReceiptItemsSection({ receiptItems, symbol }: ReceiptItemsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full pt-6 space-y-3">
      <div className="flex items-center space-x-1 cursor-pointer" onClick={handleToggle}>
        <div className="text-body-3">영수증 상세 정보</div>
        <Image
          src={arrow}
          alt={isExpanded ? '접기' : '펼치기'}
          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      {isExpanded && receiptItems.map((item, index) => <ReceiptItem key={index} receiptItem={item} symbol={symbol} />)}
    </div>
  );
}
