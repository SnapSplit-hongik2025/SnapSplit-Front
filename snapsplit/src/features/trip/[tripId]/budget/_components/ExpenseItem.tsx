import { ExpenseDto } from '../types/budget-dto-type';
import { routerPath } from '@/shared/constants/routePath';
import { getSymbol } from '@/shared/utils/currency';
import Link from 'next/link';
import Image from 'next/image';
import { EXPENSE_CATEGORY } from '@/shared/constants/expense';

type ExpenseItemProps = {
  expense: ExpenseDto;
  tripId: string;
};

const ExpenseItem = ({ expense, tripId }: ExpenseItemProps) => {
  const userNames = expense.splitters.map((u) => u).join(', ');

  const baseHref = routerPath.expenseDetail.href;
  const ExpenseDetailPath = baseHref.replace('{tripId}', tripId).replace('{expenseId}', expense.expenseId.toString());

  const symbol = getSymbol(expense.currency);

  const categoryIcon = EXPENSE_CATEGORY.find((item) => item.backendName === expense.category);
  const iconSrc = categoryIcon?.primary || '/svg/category-others-primary.svg';
  const iconAlt = categoryIcon?.name || '기타';

  return (
    <Link href={ExpenseDetailPath} className="w-full flex gap-2 py-4">
      <div className="relative w-10 h-10 min-w-10 min-h-10 flex items-center justify-center">
        <Image src={iconSrc} alt={iconAlt} width={28} height={28} />
      </div>
      <div className="w-full flex justify-between">
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-label-1">
            <p>{expense.expenseName}</p>
          </div>
          {expense.expenseMemo && <p className="text-caption-1 text-grey-550">{expense.expenseMemo}</p>}
        </div>
        <div className="flex flex-col items-end justify-center">
          <p>
            {symbol} {expense.amount.toLocaleString()}
          </p>
          <p className="text-caption-1 text-grey-550">{userNames}</p>
        </div>
      </div>
    </Link>
  );
};

export default ExpenseItem;
