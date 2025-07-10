// SharedBudgetDetailContent.tsx
'use client';

import React from 'react';
import LogItem from './LogItem';
import { useDragScroll } from '@/shared/utils/useDragScroll';

type LogData = {
  day: string;
  date: string | null;
  entries: {
    type: 'budget' | 'expense';
    label: string;
    detail: string | null;
    amount: number;
    currency: string;
    krwEquivalent: string;
  }[];
};

const beforeTripData: LogData[] = [
  {
    day: 'Day 0',
    date: null,
    entries: [
      {
        type: 'budget',
        label: '공동경비 추가하기',
        detail: null,
        amount: 500,
        currency: '€',
        krwEquivalent: '875,656',
      },
      {
        type: 'budget',
        label: '공동경비 추가하기',
        detail: null,
        amount: 500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
];

const mockData: LogData[] = [
  {
    day: 'Day 1',
    date: '5.21/월',
    entries: [
      {
        type: 'expense',
        label: '지출 내용',
        detail: '지출 상세',
        amount: -500,
        currency: '€',
        krwEquivalent: '875,656',
      },
      {
        type: 'expense',
        label: '지출 내용',
        detail: '지출 상세',
        amount: -500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
  {
    day: 'Day 2',
    date: '5.22/화',
    entries: [
      {
        type: 'budget',
        label: '공동경비 빼기',
        detail: null,
        amount: -500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
  {
    day: 'Day 3',
    date: '5.23/수',
    entries: [
      {
        type: 'expense',
        label: '지출 내용',
        detail: '지출 상세',
        amount: -500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
  {
    day: 'Day 4',
    date: '5.24/목',
    entries: [
      {
        type: 'expense',
        label: '지출 내용',
        detail: '지출 상세',
        amount: -500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
];

const LogSection = () => {
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp } = useDragScroll('y');

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="flex-1 flex flex-col items-center px-5 py-5 gap-6 h-full overflow-y-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar"
    >
      {/* 여행 준비 */}
      <div className="w-full">
        <div className="flex items-center justify-start">
          <p className="text-body-1 text-grey-1000">여행 준비</p>
        </div>
        {beforeTripData.map((item) =>
          item.entries.map((entry, entryIndex) => (
            <LogItem
              key={entryIndex}
              type={entry.type}
              label={entry.label}
              detail={entry.detail}
              amount={entry.amount}
              currency={entry.currency}
              krwEquivalent={entry.krwEquivalent}
            />
          ))
        )}
      </div>

      {/* Day별 내역 */}
      {mockData.map(({ day, date, entries }, index) => (
        <div key={index} className="w-full">
          <div className="flex items-center gap-2">
            <div className="text-body-1 text-grey-1000">{day}</div>
            <div className="w-0 h-3.75 border-1 border-grey-350" />
            <div className="text-body-1 text-grey-550">{date}</div>
          </div>

          {entries.map((entry, index) => (
            <LogItem
              key={index}
              type={entry.type}
              label={entry.label}
              detail={entry.detail}
              amount={entry.amount}
              currency={entry.currency}
              krwEquivalent={entry.krwEquivalent}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogSection;
