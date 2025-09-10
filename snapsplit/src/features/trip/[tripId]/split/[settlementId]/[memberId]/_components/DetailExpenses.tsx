'use client';

import { parseISO, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DetailExpensesProps } from '../types/settlement-member-type';
import { expenseItemDto } from '../types/settlement-member-dto-type';

interface ExpenseItemProps {
  expense: expenseItemDto;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between text-label-1">
        <span>{expense.expenseName}</span>
        <span>
          {expense.amount.toLocaleString()} {expense.expenseCurrency}
        </span>
      </div>
      <div className="flex justify-between text-caption-1 text-grey-550">
        <span>{expense.expenseMemo}</span>
        <span>{expense.amountKRW.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default function DetailExpenses({ settlementDetailsByMember }: DetailExpensesProps) {
  return (
    <div className="space-y-[16px] px-5 w-full">
      {settlementDetailsByMember.map((dayDetail, dayIdx) => {
        // 날짜 파싱 & 포맷: 2025-04-09 → "4.9/수"
        const dt = parseISO(dayDetail.date);
        const monthDay = format(dt, 'M.d', { locale: ko });
        const weekday = format(dt, 'EE', { locale: ko }); // ex: "수"

        return (
          <div key={dayDetail.date} className="pt-5">
            <div className="flex gap-2 text-body-1 pb-4">
              <h3>Day {dayIdx + 1}</h3>
              <div className="w-[1px] h-[15px] bg-grey-350" />
              <span className="text-grey-550">
                {monthDay}/{weekday}
              </span>
            </div>

            <div className="space-y-8">
              {dayDetail.items.map((item, idx) => (
                <ExpenseItem key={`${dayDetail.date}-${idx}`} expense={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
