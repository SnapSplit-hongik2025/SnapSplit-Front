import { Expense } from '../api';
import { useCurrencySymbol } from '@/shared/utils/useCurrencySymbol';

type ExpenseItemProps = {
  expense: Expense;
};

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const userNames = expense.expenseUsers.map((u) => u.userName).join(', ');
  return (
    <div className="w-full flex gap-3 py-4">
      <div className="w-10 h-10 min-w-10 min-h-10 bg-grey-250 rounded-xl" />
      <div className="w-full flex-col">
        <div className="flex justify-between text-label-1">
          <p>{expense.expenseCategory}</p>
          <p>
            {useCurrencySymbol(expense.expenseCurrency)}
            {expense.expenseAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-between text-label-1">
          <p className="text-caption-1 text-grey-550">소비처</p>
          <p className="text-caption-1 text-grey-550">{userNames}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
