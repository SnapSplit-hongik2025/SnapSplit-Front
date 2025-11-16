'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { useState } from 'react';
import DateSelectSheet from './trip-date/DateSelectSheet';

type Props = {
  startDate: string; // e.g. "2025-09-13"
  endDate: string;
  date: string;
  setDate: (date: string) => void;
};

// --- Helper Functions (UTC 기반으로 수정) ---

/**
 * 'YYYY-MM-DD' 문자열을 UTC 자정 기준으로 Date 객체로 변환합니다.
 * new Date('2025-09-13')은 타임존에 따라 9월 12일이 될 수 있으므로 이 함수를 사용합니다.
 */
const getUTCDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // 월은 0부터 시작하므로 month - 1
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Day N을 'YYYY-MM-DD' 실제 날짜로 변환합니다.
 * Day 1은 여행 시작일입니다.
 */
const calculateDate = (startDate: string, dayIndex: number): string => {
  const start = getUTCDate(startDate);
  // setUTCDate는 날짜를 UTC 기준으로 변경하고 타임스탬프를 반환합니다.
  const targetTimestamp = start.setUTCDate(start.getUTCDate() + dayIndex - 1);
  const targetDate = new Date(targetTimestamp);
  return targetDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

/**
 * 'YYYY-MM-DD' 실제 날짜를 Day N으로 변환합니다.
 */
const calculateDayIndex = (startDate: string, date: string): number => {
  const start = getUTCDate(startDate);
  const target = getUTCDate(date);
  const diffInMs = target.getTime() - start.getTime();
  // DST(일광 절약 시간제) 변경에도 안전하도록 Math.round 사용
  return Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * 총 여행 일수(마지막 Day Index)를 계산합니다.
 * e.g. 9/13 ~ 9/15 여행은 3일이며, Day 3이 마지막입니다.
 */
const getTotalDays = (startDate: string, endDate: string): number => {
  const start = getUTCDate(startDate);
  const end = getUTCDate(endDate);
  const diffInMs = end.getTime() - start.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
};

// --- Component ---

export default function TripDateSection({ startDate, endDate, date, setDate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // 현재 선택된 날짜(date)를 기준으로 Day Index (1, 2...)를 계산
  const dayIndex = calculateDayIndex(startDate, date);

  // DateSelectSheet에서 Day Index(e.g. 1)를 선택했을 때
  const handleSelectDate = (selectedDayIndex: number) => {
    // Day Index를 실제 날짜(e.g. '2025-09-12')로 변환
    const actualDate = calculateDate(startDate, selectedDayIndex);
    setDate(actualDate); // 부모 컴포넌트에 실제 날짜(string) 전달
  };

  // 여행의 마지막 Day Index (e.g. 3일 여행이면 3)
  const lastDayIndex = getTotalDays(startDate, endDate);

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">여행 일자</div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250"
      >
        <div className="flex-1 text-body-3 text-start">{'Day ' + dayIndex}</div>
        <Image src="/svg/arrow-bottom-grey-450.svg" alt="열기" width={24} height={24} />
      </button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/*
          DateSelectSheet는 daysCount={3}을 받으면
          내부적으로 1부터 3까지 (Day 1, Day 2, Day 3)
          루프를 돌도록 구현되어야 합니다.
        */}
        <DateSelectSheet
          onClose={() => setIsOpen(false)}
          selectedDayIndex={dayIndex}
          handleSelectDate={handleSelectDate}
          daysCount={lastDayIndex}
        />
      </BottomSheet>
    </div>
  );
}
