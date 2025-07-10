'use client';

import React, { useMemo, useState } from 'react';
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addDays } from 'date-fns';
import Image from 'next/image';

type CalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export default function Calendar({ selectedDate, setSelectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate));

  const generateDates = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startDay = getDay(start); // 0=일

    const prevMonthEnd = endOfMonth(addMonths(start, -1));
    const prevDates =
      startDay === 0
        ? []
        : eachDayOfInterval({
            start: addDays(prevMonthEnd, -startDay + 1),
            end: prevMonthEnd,
          });

    const currentDates = eachDayOfInterval({ start, end });

    const totalCells = prevDates.length + currentDates.length;
    const nextDatesCount = (7 - (totalCells % 7)) % 7;

    const nextMonthStart = startOfMonth(addMonths(start, 1));
    const nextDates = Array.from({ length: nextDatesCount }, (_, i) => addDays(nextMonthStart, i));

    return [...prevDates, ...currentDates, ...nextDates];
  };

  const dates = useMemo(() => generateDates(), [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 bg-white rounded-2xl w-full">
      <div className="flex items-center justify-between w-70">
        <h2 className="text-label-1">{format(currentMonth, 'yyyy년 M월')}</h2>
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth}>
            <Image alt="arrow" src="/svg/arrow-left-grey-850.svg" width={24} height={24} />
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
            className={`
            flex w-11 h-11 items-center justify-center text-body-1
            ${day === '일' ? 'text-[#FD7564]' : 'text-grey-550'}
          `}
          >
            {day}
          </div>
        ))}
        {dates.map((date, index) => {
          if (!date) return null;

          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          return (
            <button
              key={`${date.toISOString()}-${index}`} // ✅ 중복 방지
              onClick={() => setSelectedDate(date)}
              className="relative flex w-11 h-11 p-1 rounded-full items-center justify-center"
            >
              <span
                className={`relative z-10 text-body-1 ${!isCurrentMonth ? 'text-grey-550' : isSelected ? 'text-white' : 'text-black'}`}
              >
                {format(date, 'd')}
              </span>
              {isSelected ? <span className="absolute inset-0 rounded-full bg-primary z-0" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
