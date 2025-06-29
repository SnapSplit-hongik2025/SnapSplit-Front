'use client';

import Image from 'next/image';
import ModalMotionWrapper from './ModalMotionWrapper';

type Props = {
  onClose: () => void;
};

// TODO: data fetch
const expenses = {
  "점심": 10000,
  "기차 예매": 20000,
  "간식": 30000,
  "쇼핑": 40000,
}

const total = Object.values(expenses).reduce((acc, cur) => acc + cur, 0);

const FullExpenseModal = ({ onClose }: Props) => {
  return (
    <ModalMotionWrapper>
      <div className="px-5 py-3 h-12">
        <button onClick={onClose}>
          <Image src="/svg/exit.svg" alt="닫기" width={24} height={24} />
        </button>
      </div>
      <div className="flex justify-center pt-1 pb-4 border-b-1 border-grey-250">
        <div className="text-title-1">총 {total.toLocaleString()}원 지출</div>
      </div>

      <div className="flex flex-col">
        {Object.entries(expenses).map(([category, amount]) => (
          <div key={category} className="flex justify-between px-5 py-4">
            <div className="text-label-2 text-grey-650">{category}</div>
            <div className="text-label-1 text-grey-850">{amount.toLocaleString()}원</div>
          </div>
        ))}
      </div>
    </ModalMotionWrapper>
  );
};

export default FullExpenseModal;
