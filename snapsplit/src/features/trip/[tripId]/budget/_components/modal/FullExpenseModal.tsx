'use client';

import Image from 'next/image';
import ModalMotionWrapper from './ModalMotionWrapper';

type Props = {
  onClose: () => void;
};

// TODO: data fetch
const expenses = {
  '점심': 10000,
  '기차 예매': 20000,
  '간식': 30000,
  '쇼핑': 40000,
};

const total = Object.values(expenses).reduce((acc, cur) => acc + cur, 0);

const FullExpenseModal = ({ onClose }: Props) => {
  return (
    <ModalMotionWrapper>
      <div className="flex flex-col w-full bg-grey-850">
        <div className="flex justify-end px-5 py-3 h-12">
          <button onClick={onClose}>
            <Image src="/svg/exit-grey-1000.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>
        <div className="flex justify-center pt-1 pb-4 border-b-1 border-grey-250 w-full">
          <div className="text-title-1 text-white">총 {total.toLocaleString()}원 지출</div>
        </div>
      </div>

      <div className="flex flex-col">
        {Object.entries(expenses).map(([category, amount], index) => (
          <div key={category} className="flex items-center px-5 py-5 gap-4">
            <div className="flex justify-center items-center w-5 h-6 text-primary text-3xl font-cal">{index + 1}</div>
            <div className="flex items-center justify-between w-full">
              <div className="text-label-1 text-grey-1000">{category}</div>
              <div className="text-label-1 text-grey-550">{amount.toLocaleString()}원</div>
            </div>
          </div>
        ))}
      </div>
    </ModalMotionWrapper>
  );
};

export default FullExpenseModal;
