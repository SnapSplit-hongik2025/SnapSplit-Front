'use client';
import alertCircleRed from '@public/svg/alert-circle-red.svg';
import Image from 'next/image';
import Button from '@/shared/components/Button';
import OverlayModal from '@/shared/components/modal/OverlayModal';
import ConfirmSplitModal from './modal/ConfirmSplitModal';
import arrowButtom from '@public/svg/arrow-bottom-grey-450.svg';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import DatePickButtonSheet from './modal/DatePickBottomSheet';
import { SplitDatePickSectionProps } from '../types/split-type';
import { convertSelectableDateToDay } from '@/shared/utils/DatetoDay/convertSelectableDateToDay';
import { useMemo, useState } from 'react';
import { postSettlement } from '../api/split-api';

export default function SplitDatePickSection({ tripId, selectableDates, tripStartDate }: SplitDatePickSectionProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [datePickType, setDatePickType] = useState<'start' | 'end' | null>(null);

  // API에서 받은 selectableDates를 날짜 정보가 포함된 형태로 변환
  const tripDay = convertSelectableDateToDay(tripStartDate, selectableDates);

  const firstSelectableIndex = tripDay.findIndex((d) => d.hasExpense);
  const [startDayIndex, setStartDayIndex] = useState<number | null>(
    firstSelectableIndex !== -1 ? firstSelectableIndex : null
  );
  const [endDayIndex, setEndDayIndex] = useState<number | null>(tripDay.length > 0 ? tripDay.length - 1 : null);

  // 날짜 유효성 검증
  const isValidDateRange = startDayIndex !== null && endDayIndex !== null && startDayIndex <= endDayIndex;

  // 1. 선택된 범위 내에 지출이 있는지 동적으로 계산
  const hasExpenseInRange = useMemo(() => {
    if (!isValidDateRange || startDayIndex === null || endDayIndex === null) return false;

    // tripDay 배열에서 선택된 범위만큼 자르기
    const selectedRange = tripDay.slice(startDayIndex, endDayIndex + 1);

    // 해당 범위 내에 hasExpense가 true인 날이 하나라도 있는지 확인
    return selectedRange.some((day) => day.hasExpense);
  }, [startDayIndex, endDayIndex, tripDay, isValidDateRange]);

  // 2. 조건부 에러 메시지 로직 수정
  const errorMessage = !isValidDateRange
    ? '날짜 범위가 잘못 선택됐어요'
    : !hasExpenseInRange
      ? '선택된 기간에 등록된 지출 내역이 없어요'
      : null;

  const handleSettlement = async () => {
    if (startDayIndex === null || endDayIndex === null) {
      alert('날짜를 선택해주세요.');
      return;
    }

    try {
      const startDate = tripDay[startDayIndex].date;
      const endDate = tripDay[endDayIndex].date;

      await postSettlement(tripId, startDate, endDate);

      alert('정산이 완료되었습니다!');
      setIsConfirmModalOpen(false);
    } catch (e) {
      alert('정산 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error(e);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full gap-2 items-center pb-2">
        <button
          aria-label="정산 시작 날짜 선택"
          className="flex items-center justify-between px-4 py-[14px] rounded-xl w-full border-1 border-grey-250 bg-white focus:outline-none cursor-pointer text-body-2"
          onClick={() => {
            setDatePickType('start');
            setIsDateModalOpen(true);
          }}
        >
          {startDayIndex !== null
            ? tripDay[startDayIndex].day === 0
              ? '여행 준비'
              : `Day ${tripDay[startDayIndex].day}`
            : '시작일 선택'}
          <Image src={arrowButtom} alt="Arrow Button" className="" />
        </button>
        <span className="text-head-1">~</span>
        <button
          aria-label="정산 종료 날짜 선택"
          className="flex items-center justify-between px-4 py-[14px] rounded-xl w-full border-1 border-grey-250 bg-white focus:outline-none cursor-pointer text-body-2"
          onClick={() => {
            setDatePickType('end');
            setIsDateModalOpen(true);
          }}
        >
          {endDayIndex !== null
            ? tripDay[endDayIndex].day === 0
              ? '여행 준비'
              : `Day ${tripDay[endDayIndex].day}`
            : '종료일 선택'}
          <Image src={arrowButtom} alt="Arrow Button" className="" />
        </button>

        {/* 정산 날짜 선택 바텀시트 */}
        <BottomSheet
          isOpen={isDateModalOpen}
          onClose={() => {
            setIsDateModalOpen(false);
          }}
        >
          <DatePickButtonSheet
            tripDay={tripDay}
            selectedIndex={datePickType === 'start' ? startDayIndex : endDayIndex}
            setSelectedIndex={datePickType === 'start' ? setStartDayIndex : setEndDayIndex}
            onClose={() => setIsDateModalOpen(false)}
          />
        </BottomSheet>
      </div>

      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <div className="flex gap-1 items-center justify-start">
          <Image src={alertCircleRed} alt="Alert Icon" width={24} height={24} className="" />
          <p className="text-status_error text-body-2">{errorMessage}</p>
        </div>
      )}

      <Button
        label="정산하기"
        // 3. enabled 조건에 동적으로 계산된 hasExpenseInRange 사용
        enabled={hasExpenseInRange && isValidDateRange}
        onClick={() => setIsConfirmModalOpen(true)}
        className="mt-4"
      />

      {/* 정산 확인 모달 */}
      <OverlayModal isOpen={isConfirmModalOpen} onClose={handleSettlement} position="center" className="px-5">
        <ConfirmSplitModal onClose={() => setIsConfirmModalOpen(false)} />
      </OverlayModal>
    </div>
  );
}
