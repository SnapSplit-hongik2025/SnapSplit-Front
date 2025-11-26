import ExpenseDateBar from './ExpenseDateBar';
import ExpenseItem from './ExpenseItem';
import { DailyExpenseListProps } from '../types/budget-type';
import AddExpenseButton from './AddExpenseButton';
import TopFloatingButton from '@/shared/components/TopFloatingButton';
import { useRouter } from 'next/navigation';

export default function DailyExpenseList({ dailyExpenses, tripStartDate, tripEndDate, tripId }: DailyExpenseListProps) {
  const router = useRouter();

  const handleClickAddExpense = (date: string) => {
    router.push(
      `/trip/${tripId}/budget/expense?date=${date}&tripStartDate=${tripStartDate}&tripEndDate=${tripEndDate}`
    );
  };

  return (
    <div className="flex-grow w-full space-y-8 p-5 pb-[159px] bg-grey-50">
      {dailyExpenses.map(({ date, expenses, canAddExpense }) => {
        return (
          <div id={`day-${date}`} key={date}>
            <ExpenseDateBar expenseDate={date} tripStartDate={tripStartDate} />
            {expenses.map((e) => (
              <ExpenseItem key={e.expenseId} expense={e} tripId={tripId} />
            ))}
            {canAddExpense ? (
              <AddExpenseButton onClick={() => handleClickAddExpense(date)} />
            ) : (
              <div className="w-full rounded-lg py-[7.5px] outline-1 outline-offset-[-1px] outline-neutral-200 bg-grey-150 inline-flex justify-center items-center">
                <p className="text-body-1 text-neutral-500">정산 완료</p>
              </div>
            )}
          </div>
        );
      })}
      <TopFloatingButton />
    </div>
  );
}
