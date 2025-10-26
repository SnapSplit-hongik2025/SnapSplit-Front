import { useCurrencySymbol } from '@/shared/utils/useCurrencySymbol';
import { ExpenseDto } from '../types/budget-dto-type';

type ExpenseItemProps = {
  expense: ExpenseDto;
};

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const userNames = expense.splitters.map((u) => u).join(', ');
  return (
    <div className="w-full flex gap-2 py-4">
      <div className="w-10 h-10 min-w-10 min-h-10 bg-grey-250 rounded-xl" />
      <div className="w-full flex-col">
        <div className="flex justify-between text-label-1">
          <p>{expense.expenseName}</p>
          <p>
            {useCurrencySymbol(expense.currency)}
            {expense.amount.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-between text-label-1">
          <p className="text-caption-1 text-grey-550">{expense.expenseMemo}</p>
          <p className="text-caption-1 text-grey-550">{userNames}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
