import { Expense } from '../api';
import { groupExpensesByDate } from '@/shared/utils/groupExpenses';
import ExpenseDateBar from './ExpenseDateBar';
import ExpenseItem from './ExpenseItem';
import AddExpenseButton from './AddExpenseButton';

type DailyExpenseListProps = {
  expenses: Expense[];
  tripStartDate: string;
  tripEndDate: string;
};

const DailyExpenseList = ({ expenses, tripStartDate, tripEndDate }: DailyExpenseListProps) => {
  const groupedExpenses = groupExpensesByDate(expenses, tripStartDate, tripEndDate);

  return (
    <div
      id="scroll-target-top"
      className="flex-grow w-full space-y-8 px-5 text-grey-850 pb-[147px] overflow-y-auto scrollbar-hide"
    >
      {groupedExpenses.map((group) => (
        <div key={group.label} className="space-y-3" id={group.id ? `day-${group.id}` : undefined}>
          <ExpenseDateBar expenseDay={group.label} type={group.type} dayIndex={group.dayIndex} />
          {group.expenses.map((expense) => (
            <ExpenseItem key={`${expense.expenseId}-${expense.expenseCurrency}`} expense={expense} />
          ))}
          <AddExpenseButton />
        </div>
      ))}
    </div>
  );
};

export default DailyExpenseList;
