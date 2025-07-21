'use client';

import React, { useMemo, useState } from 'react';
import { addMonths, format, isSameDay, isSameMonth, startOfMonth } from 'date-fns';
import Image from 'next/image';
import { generateDates } from '@/shared/utils/calendar';

// 선택 타입 정의
export type CalendarMode = 'single' | 'range';

export type CalendarProps = {
  mode: CalendarMode;
  selectedDate?: Date;
  selectedRange?: { start: Date | null; end: Date | null };
  onSelectDate: (date: Date) => void;
};

export default function Calendar({
  mode,
  selectedDate,
  selectedRange,
  onSelectDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate || new Date()));
  const dates = useMemo(() => generateDates(currentMonth), [currentMonth]); // generateDates(currentMonth: Date) -> 이번 달 페이지의 모든 날짜를 반환
  const isCurrentMonthPage = useMemo(() => isSameMonth(currentMonth, new Date()), [currentMonth]);
  
  const handlePrevMonth = () => {
    if (isCurrentMonthPage) {
      return;
    } // 현재 페이지가 현재 달이면 이전 달로 이동하지 않음

    setCurrentMonth(addMonths(currentMonth, -1));
  };
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="flex flex-col items-center w-full px-1.5 py-4 gap-2">
      <div className="flex items-center justify-between w-70">
        <h2 className="text-label-1">{format(currentMonth, 'yyyy년 M월')}</h2>
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth}>
            {isCurrentMonthPage && <Image alt="arrow" src="/svg/arrow-left-grey-350.svg" width={24} height={24} />}
            {!isCurrentMonthPage && <Image alt="arrow" src="/svg/arrow-right-black.svg" width={24} height={24} className="scale-x-[-1]" />}
          </button>
          <button onClick={handleNextMonth}>
            <Image alt="arrow" src="/svg/arrow-right-black.svg" width={24} height={24} />
          </button>
        </div>
      </div>

      <div className="w-full grid place-items-center grid-cols-7 gap-y-[10px]">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className={`flex w-11 h-11 items-center justify-center text-body-3 ${
              day === '일' ? 'text-status_error' : 'text-grey-550'
            }`}
          >
            {day}
          </div>
        ))}
        {mode === 'single'
          ? dates.map((date, index) => {
              // single mode
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={`${date.toISOString()}-${index}`}
                  onClick={() => onSelectDate(date)}
                  className="relative flex w-11 h-11 p-1 rounded-full items-center justify-center"
                >
                  <span
                    className={`relative z-10 text-body-3 ${
                      !isCurrentMonth ? 'text-grey-350' : isSelected ? 'text-white' : 'text-black'
                    }`}
                  >
                    {format(date, 'd')}
                  </span>
                  {isSelected ? <span className="absolute inset-0 rounded-full bg-primary z-0" /> : null}
                </button>
              );
            })
          : dates.map((date, index) => {
              // range mode
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isSelectedStart = selectedRange?.start && isSameDay(date, selectedRange.start);
              const isSelectedEnd = selectedRange?.end && isSameDay(date, selectedRange.end);
              const isInRange =
                selectedRange?.start && selectedRange?.end && date > selectedRange.start && date < selectedRange.end;

              return (
                <button
                  key={`${date.toISOString()}-${index}`}
                  onClick={() => onSelectDate(date)}
                  className="relative flex w-11 h-11 items-center justify-center"
                >
                  <div className={`flex w-10 h-10 items-center justify-center ${
                    isInRange ? 'bg-pale_green w-11' : 'bg-transparent w-10 rounded-full'
                  }`}>
                    <span
                      className={`relative z-10 text-body-3 ${
                        !isCurrentMonth
                          ? 'text-grey-350'
                          : isSelectedStart || isSelectedEnd
                            ? 'text-white'
                            : isInRange
                              ? 'text-primary'
                              : 'text-black'
                      }`}
                    >
                      {format(date, 'd')}
                    </span>
                    {/* 오른쪽 반 (예: startDate용) */}
                    {isSelectedStart && selectedRange?.end !== null && (
                      <span className="absolute right-0 h-10 w-1/2 bg-pale_green" />
                    )}
                    {/* 왼쪽 반 (예: endDate용) */}
                    {isSelectedEnd && selectedRange?.start !== null && (
                      <span className="absolute left-0 h-10 w-1/2 bg-pale_green" />
                    )}
                    {isSelectedStart || isSelectedEnd ? (
                      <span className="absolute w-10 h-10 rounded-full bg-primary" />
                    ) : null}
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
