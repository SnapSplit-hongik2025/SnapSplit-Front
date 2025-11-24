import Image from 'next/image';
import topArrow from '@public/svg/topArrow.svg';

export type TotalExpenseBottomSheetProps = {
  tripTotalExpense?: number;
};

const TotalExpenseBottomSheet = ({ tripTotalExpense = 0 }: TotalExpenseBottomSheetProps) => {
  // 지출 금 "원" 으로 표기할지 상의

  return (
    <div className="relative flex flex-col items-center pt-[22px] pb-[18px]">
      {/* 위쪽 화살표 */}
      <Image
        alt="총 지출 모달 열기"
        src={topArrow}
        className="absolute top-[2px]" // 겹치게 위로 끌어올림
      />

      {/* 텍스트 */}
      <div className="text-grey-50 text-title-1 z-10">총 {tripTotalExpense.toLocaleString()}원 지출</div>
    </div>
  );
};

export default TotalExpenseBottomSheet;
