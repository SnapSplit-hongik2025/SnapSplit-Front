// SharedBudgetDetailContent.tsx
'use client';

import React from 'react';
import LogItem from './LogItem';
import { useDragScroll } from '@/shared/utils/useDragScroll';
import { SharedBudgetDetail } from '../../types/budget-type';
import { toDayX, toMDotDDW } from '@/shared/utils/parseDate';

type LogSectionProps = {
  defaultCurrency: string;
  whileTripLog: SharedBudgetDetail[];
  beforeTripLog: SharedBudgetDetail[];
};

const LogSection = ({ defaultCurrency, whileTripLog, beforeTripLog }: LogSectionProps) => {
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
        {beforeTripLog.map((item) => (
          item.items.map((entry, entryIndex) => (
            <LogItem
              key={entryIndex}
              type={entry.type}
              label={entry.title}
              memo={entry.memo}
              amount={entry.amount}
              currency={defaultCurrency}
              krwEquivalent={entry.amountKRW}
            />
          ))
        ))}
      </div>

      {/* Day별 내역 */}
      {whileTripLog.length > 0 && whileTripLog.map(({ date, items }, index) => (
        <div key={index} className="w-full">
          <div className="flex items-center gap-2">
            <div className="text-body-1 text-grey-1000">{toDayX(date, whileTripLog[0].date)}</div>
            <div className="w-0 h-3.75 border-1 border-grey-350" />
            <div className="text-body-1 text-grey-550">{toMDotDDW(date)}</div>
          </div>

          {items.map((item, index) => (
            <LogItem
              key={index}
              type={item.type}
              label={item.title}
              memo={item.memo}
              amount={item.amount}
              currency={defaultCurrency}
              krwEquivalent={item.amountKRW}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogSection;
