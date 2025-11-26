'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import ModalMotionWrapper from './ModalMotionWrapper';
import { getCategoryExpense } from '../../api/budget-api';
import { mapCategoryToKor } from '@/shared/utils/useCategoryMapper';

type Props = {
  onClose: () => void;
  tripId: string;
};

const FullExpenseModal = ({ onClose, tripId }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categoryExpense', tripId],
    queryFn: () => getCategoryExpense(tripId),
    enabled: !!tripId,
  });

  if (isLoading) {
    return (
      <ModalMotionWrapper>
        <div className="flex justify-center items-center h-64 text-grey-500">로딩 중...</div>
      </ModalMotionWrapper>
    );
  }

  if (isError || !data) {
    return (
      <ModalMotionWrapper>
        <div className="flex justify-center items-center h-64 text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </ModalMotionWrapper>
    );
  }

  const { totalAmountKRW, categoryExpenses } = data;

  return (
    <ModalMotionWrapper>
      {/* Header */}
      <div className="flex flex-col w-full bg-grey-850">
        <div className="flex justify-end px-5 py-3 h-12">
          <button onClick={onClose} className="cursor-pointer">
            <Image src="/svg/exit-grey-1000.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>
        <div className="flex justify-center pt-1 pb-4 border-b-1 border-grey-250 w-full">
          <div className="text-title-1 text-white">총 {totalAmountKRW.toLocaleString()}원 지출</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {categoryExpenses.map(({ category, amountKRW }, index) => (
          <div key={category} className="flex items-center px-5 py-5 gap-4">
            <div className="flex justify-center items-center w-5 h-6 text-primary text-3xl font-cal">{index + 1}</div>
            <div className="flex items-center justify-between w-full">
              <div className="text-label-1 text-grey-1000">{mapCategoryToKor(category)}</div>
              <div className="text-label-1 text-grey-550">{amountKRW.toLocaleString()}원</div>
            </div>
          </div>
        ))}
      </div>
    </ModalMotionWrapper>
  );
};

export default FullExpenseModal;
