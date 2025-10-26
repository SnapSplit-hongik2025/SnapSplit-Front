'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { useState } from 'react';
import DateSelectSheet from './trip-date/DateSelectSheet';

type Props = {
  startDate: string; // e.g. "2025-09-13""
  endDate: string;
  date: string;
  setDate: (date: string) => void;
}

export default function TripDateSection({ startDate, endDate, date, setDate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // day index 구하는 함수
  const calculateDayIndex = (startDate: string, date: string): number => {
    const start = new Date(startDate);
    const target = new Date(date);
    const diffInMs = target.getTime() - start.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  };

  const dayIndex = calculateDayIndex(startDate, date);

  // 여행 시작일 기준으로 Day N을 실제 날짜로 변환
  const calculateDate = (startDate: string, dayIndex: number): string => {
    const start = new Date(startDate);
    const next = new Date(start.setDate(start.getDate() + dayIndex - 1));
    return next.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  const handleSelectDate = (dayIndex: number) => {
    const actualDate = calculateDate(startDate, dayIndex);
    setDate(actualDate);
  };

  const getTotalDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">여행 일자</div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250"
      >
        <div className="flex-1 text-body-3 text-start">{'Day ' + dayIndex || '날짜 선택'}</div>
        <Image src="/svg/arrow-bottom-grey-450.svg" alt="열기" width={24} height={24} />
      </button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DateSelectSheet onClose={() => setIsOpen(false)} date={date} handleSelectDate={handleSelectDate} daysCount={getTotalDays(startDate, endDate)} />
      </BottomSheet>
    </div>
  );
}
