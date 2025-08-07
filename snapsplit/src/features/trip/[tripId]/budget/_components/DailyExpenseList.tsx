// DailyExpenseList.tsx
import ExpenseDateBar from './ExpenseDateBar';
import ExpenseItem from './ExpenseItem';
import { DailyExpenseListProps } from '../type';
import AddExpenseButton from './AddExpenseButton';
import TopFloatingButton from '@/shared/components/TopFloatingButton';

export default function DailyExpenseList({ dailyExpenses, tripStartDate }: DailyExpenseListProps) {
  return (
    <div
      id="scroll-target-top"
      className="flex-grow w-full space-y-8 p-5 pb-[159px] overflow-y-auto scrollbar-hide bg-grey-50"
    >
      {dailyExpenses.map(({ date, expenses }) => {
        return (
          <div id={`day-${date}`} key={date}>
            <ExpenseDateBar expenseDate={date} tripStartDate={tripStartDate} />
            {expenses.map((e) => (
              <ExpenseItem key={e.expenseId} expense={e} />
            ))}
            <AddExpenseButton />
          </div>
        );
      })}
      <TopFloatingButton />
    </div>
  );
}
