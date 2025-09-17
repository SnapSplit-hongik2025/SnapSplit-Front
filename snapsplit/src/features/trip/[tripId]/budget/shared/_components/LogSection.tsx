// SharedBudgetDetailContent.tsx
'use client';

import React from 'react';
import LogItem from './LogItem';
import { useDragScroll } from '@/shared/utils/useDragScroll';
import { SharedBudgetDetail } from '../../types/budget-type';

type LogData = {
  day: string;
  date: string | null;
  entries: {
    type: 'deposit' | 'expense';
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
        type: 'deposit',
        label: '공동경비 추가하기',
        detail: null,
        amount: 500,
        currency: '€',
        krwEquivalent: '875,656',
      },
      {
        type: 'deposit',
        label: '공동경비 추가하기',
        detail: null,
        amount: 500,
        currency: '€',
        krwEquivalent: '875,656',
      },
    ],
  },
];

type LogSectionProps = {
  defaultCurrency: string;
  sharedBudgetLog: SharedBudgetDetail[];
};

const LogSection = ({ defaultCurrency, sharedBudgetLog }: LogSectionProps) => {
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
      {sharedBudgetLog.map(({ date, items }, index) => (
        <div key={index} className="w-full">
          <div className="flex items-center gap-2">
            <div className="text-body-1 text-grey-1000">{date}</div>
            <div className="w-0 h-3.75 border-1 border-grey-350" />
            <div className="text-body-1 text-grey-550">{date}</div>
          </div>

          {items.map((item, index) => (
            <LogItem
              key={index}
              type={item.type}
              label={item.title}
              detail={''}
              amount={item.amount}
              currency={defaultCurrency}
              krwEquivalent={item.amount.toString()}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogSection;
