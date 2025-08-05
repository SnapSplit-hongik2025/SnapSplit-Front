type LogItemProps = {
  type: 'budget' | 'expense';
  label: string;
  detail: string | null;
  amount: number;
  currency: string;
  krwEquivalent: string;
};

const LogItem = ({ type, label, detail, amount, currency, krwEquivalent }: LogItemProps) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex flex-col text-start">
        <div className="text-label-1 text-grey-1000">{label}</div>
        {detail && <div className="text-caption-1 text-grey-550">{detail}</div>}
      </div>
      <div className="flex flex-col">
        <div className={`text-label-1 text-end ${type === 'expense' ? 'text-grey-1000' : amount > 0 ? 'text-green' : 'text-[#FD7564]'}`}>
          {amount > 0 ? '+' : ''}
          {amount}
          {currency}
        </div>
        <div className="text-caption-1 text-end text-grey-550">{krwEquivalent}원</div>
      </div>
    </div>
  );
};

export default LogItem;
