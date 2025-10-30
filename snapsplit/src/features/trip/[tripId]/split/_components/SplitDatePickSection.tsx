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
import { useRouter } from 'next/navigation';

export default function SplitDatePickSection({ tripId, dailyExpenseStatus, tripStartDate }: SplitDatePickSectionProps) {
  const router = useRouter();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [datePickType, setDatePickType] = useState<'start' | 'end' | null>(null);

  // date기반 여행 데이터를 day기반 데이터로 변환
  const tripDay = convertSelectableDateToDay(tripStartDate, dailyExpenseStatus);

  // 선택 가능한 첫 번째 날과 마지막 날의 인덱스 찾기
  const firstSelectableIndex = tripDay.findIndex((d) => !d.settled);
  const reversedIdx = [...tripDay].reverse().findIndex((d) => !d.settled);
  const lastSelectableIndex = reversedIdx === -1 ? -1 : tripDay.length - 1 - reversedIdx;

  // 정산 시작일과 종료일의 인덱스 상태 관리
  const [startDayIndex, setStartDayIndex] = useState<number | null>(
    firstSelectableIndex !== -1 ? firstSelectableIndex : null
  );
  const [endDayIndex, setEndDayIndex] = useState<number | null>(
    lastSelectableIndex !== -1 ? lastSelectableIndex : null
  );

  // 날짜 유효성 검증
  const isValidDateRange = startDayIndex !== null && endDayIndex !== null && startDayIndex <= endDayIndex;

  // 선택된 범위 내에 지출이 있는지 계산
  const hasExpenseInRange = useMemo(() => {
    if (!isValidDateRange) return false;

    const selectedRange = tripDay.slice(startDayIndex, endDayIndex + 1);
    return selectedRange.some((day) => day.hasExpense);
  }, [startDayIndex, endDayIndex, tripDay, isValidDateRange]);

  let errorMessage: string | null = null;

  if (startDayIndex === null || endDayIndex === null) {
    errorMessage = '정산할 날짜가 없어요!';
  } else if (!isValidDateRange) {
    errorMessage = '날짜 범위가 잘못 선택됐어요!';
  } else if (!hasExpenseInRange) {
    errorMessage = '선택된 기간에 등록된 지출 내역이 없어요!';
  }

  // 정산하기 API 호출
  const handleSettlement = async () => {
    if (startDayIndex === null || endDayIndex === null || startDayIndex > endDayIndex) {
      alert('날짜 범위가 잘못 선택됐어요.');
      return;
    }

    try {
      const startDate = tripDay[startDayIndex].date;
      const endDate = tripDay[endDayIndex].date;
      const { settlementId } = await postSettlement(tripId, startDate, endDate);

      alert('정산이 완료되었습니다!');
      setIsConfirmModalOpen(false);

      const startDayParam = encodeURIComponent(tripDay[startDayIndex].day); // 또는 index 사용: startDayIndex
      const endDayParam = encodeURIComponent(tripDay[endDayIndex].day);
      router.push(`/trip/${tripId}/split/${settlementId}?startDay=${startDayParam}&endDay=${endDayParam}`);
    } catch (e) {
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
        enabled={hasExpenseInRange && isValidDateRange}
        onClick={() => setIsConfirmModalOpen(true)}
        className="mt-4"
      />
      <OverlayModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        position="center"
        className="px-5"
      >
        <ConfirmSplitModal onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleSettlement} />
      </OverlayModal>
    </div>
  );
}
