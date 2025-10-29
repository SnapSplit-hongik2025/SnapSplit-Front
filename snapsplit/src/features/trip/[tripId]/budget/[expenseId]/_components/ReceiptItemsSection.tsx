import ReceiptItem from './ReceiptItem';
import arrow from '@public/svg/arrow-bottom-grey-450.svg';
import Image from 'next/image';
import { ReceiptItemsSectionProps } from '../types/expense-detail-type';

export default function ReceiptItemsSection({ receiptItems, symbol }: ReceiptItemsSectionProps) {
  return (
    <div className="flex flex-col w-full pt-6 space-y-3">
      <div className="flex items-center space-x-1">
        <div className="text-body-3">영수증 상세 정보</div>
        <Image src={arrow} alt="펼치기" className="cursor-pointer" />
      </div>
      {receiptItems.map((item, index) => (
        <ReceiptItem key={index} receiptItem={item} symbol={symbol} />
      ))}
    </div>
  );
}
