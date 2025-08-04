import { ExpenseAmountProps } from '../type';

export default function ExpenseAmount({ amount, symbol, amountKRW }: ExpenseAmountProps) {
  return (
    <div className="px-5 py-4 bg-grey-150 flex flex-col rounded-xl">
      <p className="text-head-1">
        {amount}
        {symbol}
      </p>
      <p className="text-body-2 text-grey-550">= {amountKRW}원</p>
    </div>
  );
}
