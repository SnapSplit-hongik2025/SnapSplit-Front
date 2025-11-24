import { ReceiptItemProps } from '../types/expense-detail-type';

export interface ReceiptInfoBoxProp {
  label: string;
  className?: string;
}

const ReceiptInfoBox = ({ label = '', className = '' }: ReceiptInfoBoxProp) => {
  return (
    <div
      className={`relative flex items-center px-4 py-3 rounded-xl border border-grey-250 overflow-x-auto scrollbar-hide ${className}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default function ReceiptItem({ receiptItem, symbol }: ReceiptItemProps) {
  const amountWithSymbol = `${receiptItem.amount.toLocaleString()}${symbol}`;

  return (
    <div className="flex justify-between text-body-2 gap-3">
      <ReceiptInfoBox label={receiptItem.name} className="w-full" />
      <ReceiptInfoBox label={amountWithSymbol} className="w-40" />
    </div>
  );
}
