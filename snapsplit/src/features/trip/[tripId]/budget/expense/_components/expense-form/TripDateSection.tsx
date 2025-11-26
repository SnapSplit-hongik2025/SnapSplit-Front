'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { useState } from 'react';
import DateSelectSheet from './trip-date/DateSelectSheet';

type Props = {
  startDate: string;
  endDate: string;
  date: string;
  setDate: (date: string) => void;
  settledDates: string[];
};

// --- Helper Functions ---
const getUTCDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const calculateDate = (startDate: string, dayIndex: number): string => {
  const start = getUTCDate(startDate);
  const targetTimestamp = start.setUTCDate(start.getUTCDate() + dayIndex - 1);
  const targetDate = new Date(targetTimestamp);
  return targetDate.toISOString().split('T')[0];
};

const calculateDayIndex = (startDate: string, date: string): number => {
  const start = getUTCDate(startDate);
  const target = getUTCDate(date);
  const diffInMs = target.getTime() - start.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
};

const getTotalDays = (startDate: string, endDate: string): number => {
  const start = getUTCDate(startDate);
  const end = getUTCDate(endDate);
  const diffInMs = end.getTime() - start.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
};

// --- Component ---

export default function TripDateSection({ startDate, endDate, date, setDate, settledDates }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const dayIndex = calculateDayIndex(startDate, date);
  const lastDayIndex = getTotalDays(startDate, endDate);
  const settledDayIndices = settledDates.map((settledDate) => calculateDayIndex(startDate, settledDate));

  const handleSelectDate = (selectedDayIndex: number) => {
    const actualDate = calculateDate(startDate, selectedDayIndex);
    setDate(actualDate);
  };

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">여행 일자</div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 cursor-pointer w-full h-12 px-4 rounded-xl border-[1px] border-grey-250"
      >
        {/* [수정] dayIndex가 0이면 '여행 준비', 아니면 'Day N' 표시 */}
        <div className="flex-1 text-body-3 text-start">{dayIndex === 0 ? '여행 준비' : `Day ${dayIndex}`}</div>
        <Image src="/svg/arrow-bottom-grey-450.svg" alt="열기" width={24} height={24} />
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DateSelectSheet
          onClose={() => setIsOpen(false)}
          selectedDayIndex={dayIndex}
          handleSelectDate={handleSelectDate}
          daysCount={lastDayIndex}
          settledDayIndices={settledDayIndices}
        />
      </BottomSheet>
    </div>
  );
}
