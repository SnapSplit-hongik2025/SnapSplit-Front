// DailyExpenseList.tsx
import dayjs from 'dayjs';
import ExpenseDateBar from './ExpenseDateBar';
import ExpenseItem from './ExpenseItem';
import { DailyExpenseListProps } from '../type';

export default function DailyExpenseList({ dailyExpenses, tripStartDate }: DailyExpenseListProps) {
  const start = dayjs(tripStartDate);

  return (
    <div className="flex-1 overflow-y-auto">
      {dailyExpenses.map(({ date, expenses }) => {
        const current = dayjs(date);
        const dayIndex = current.diff(start, 'day') + 1;
        const inTrip = current.isSameOrAfter(start);

        return (
          <div key={date} className="px-4 py-2">
            <ExpenseDateBar
              expenseDay={current.format('M.D(ddd)')}
              type={inTrip ? 'IN_TRIP' : 'PRE_TRIP'}
              dayIndex={inTrip ? dayIndex : undefined}
            />
            {/* raw 데이터를 ExpenseItem이 기대하는 모양으로 매핑 */}
            {expenses.map((e) => (
              <ExpenseItem
                key={e.expenseId}
                expense={{
                  expenseId: e.expenseId,
                  category: e.category,
                  expenseName: e.expenseName,
                  expenseMemo: e.expenseMemo,
                  amount: e.amount,
                  currency: e.currency.toUpperCase(),
                  splitters: e.splitters.map((name) => ({ userName: name })),
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
