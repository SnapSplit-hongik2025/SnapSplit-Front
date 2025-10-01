import { getSymbol } from "@/shared/utils/currency";

type LogItemProps = {
  type: 'deposit' | 'expense';
  label: string;
  memo: string | null;
  amount: number;
  currency: string;
  krwEquivalent: number;
};

const LogItem = ({ type, label, memo, amount, currency, krwEquivalent }: LogItemProps) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex flex-col text-start">
        <div className="text-label-1 text-grey-1000">{label}</div>
        {memo && <div className="text-caption-1 text-grey-550">{memo}</div>}
      </div>
      <div className="flex flex-col">
        <div className={`text-label-1 text-end ${type === 'expense' ? 'text-grey-1000' : amount > 0 ? 'text-green' : 'text-[#FD7564]'}`}>
          {amount > 0 ? '+' : ''}
          {amount}
          {getSymbol(currency)}
        </div>
        <div className="text-caption-1 text-end text-grey-550">{krwEquivalent}원</div>
      </div>
    </div>
  );
};

export default LogItem;
