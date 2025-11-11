import { ExpenseDto } from '../types/budget-dto-type';
import { routerPath } from '@/shared/constants/routePath';
import { getSymbol } from '@/shared/utils/currency';
import Link from 'next/link';

type ExpenseItemProps = {
  expense: ExpenseDto;
  tripId: string;
};

const ExpenseItem = ({ expense, tripId }: ExpenseItemProps) => {
  const userNames = expense.splitters.map((u) => u).join(', ');

  const baseHref = routerPath.expenseDetail.href;
  const ExpenseDetailPath = baseHref.replace('{tripId}', tripId).replace('{expenseId}', expense.expenseId.toString());

  const symbol = getSymbol(expense.currency);

  return (
    <Link href={ExpenseDetailPath} className="w-full flex gap-2 py-4">
      <div className="w-10 h-10 min-w-10 min-h-10 bg-grey-250 rounded-xl" />
      <div className="w-full flex-col">
        <div className="flex justify-between text-label-1">
          <p>{expense.expenseName}</p>
          <p>
            {symbol} {expense.amount.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-between text-label-1">
          <p className="text-caption-1 text-grey-550">{expense.expenseMemo}</p>
          <p className="text-caption-1 text-grey-550">{userNames}</p>
        </div>
      </div>
    </Link>
  );
};

export default ExpenseItem;
