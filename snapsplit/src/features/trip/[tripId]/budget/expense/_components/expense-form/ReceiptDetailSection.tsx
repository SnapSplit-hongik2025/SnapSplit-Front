import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  items: ReceiptItem[];
};

export default function ReceiptDetailSection({ items }: Props) {
  const arrowBottom = '/svg/arrow-bottom-grey-450.svg';
  const arrowTop = '/svg/arrow-top-grey-450.svg';
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <button className="flex items-center w-full" onClick={() => setIsOpen(!isOpen)}>
        <div className="text-start">영수증 상세 정보</div>
        <Image src={isOpen ? arrowTop : arrowBottom} alt="열기" width={24} height={24} />
      </button>
      {isOpen && (
        <div className="flex flex-col items-center gap-3 w-full">
          {items.map((item, index) => {
            if (item.name === '' || item.amount === '') return null;
            return (
              <div key={index} className="flex items-center w-full gap-3">
                <div className="w-3/5 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250">
                  <div className="text-body-2 focus:outline-none">{item.name}</div>
                </div>
                <div className="w-2/5 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250">
                  <div className="text-body-2 focus:outline-none">{item.amount}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
