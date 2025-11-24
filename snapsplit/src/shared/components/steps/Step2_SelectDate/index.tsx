'use client';

import BottomCTAButton from '@/shared/components/BottomCTAButton';
import { SelectDateSectionProps } from './type';
import TripDatePicker from './TripDatePicker';

const SelectDateSection = ({
  onClick: handleNextStep,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  variant = 'create',
}: SelectDateSectionProps) => {
  const isEdit = variant === 'edit';

  return (
    <div className="flex flex-col px-5 h-full flex-1 justify-between">
      <div className="flex flex-col h-full">
        <div className="pb-6">
          <p className="text-head-1">{isEdit ? '여행 일정을 변경하시나요?' : '여행 일정을 등록해주세요'}</p>
          <p className="text-body-2 text-grey-850">캘린더에서 떠나는 날과 돌아오는 날을 선택하세요</p>
        </div>
        <div className="flex-1">
          <TripDatePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
        </div>
      </div>

      {startDate && (
        <div className="py-5">
          <BottomCTAButton label={endDate ? '다음으로' : '당일 일정으로 선택'} onClick={handleNextStep} />
        </div>
      )}
    </div>
  );
};

export default SelectDateSection;
