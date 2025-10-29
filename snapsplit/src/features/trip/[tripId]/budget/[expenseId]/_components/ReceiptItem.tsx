import { ReceiptItemProps } from '../types/expense-detail-type';

export interface receiptInfoBoxProp {
  label: string;
  className?: string;
}

const ReceiptInfoBox = ({ label, className = '' }: receiptInfoBoxProp) => {
  return (
    <div className={`flex px-4 py-3 rounded-xl border border-grey-250 ${className}`}>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
};

export default function ReceiptItem({ receiptItem, symbol }: ReceiptItemProps) {
  const amountWithSymbol = `${receiptItem.amount}${symbol}`;

  return (
    <div className="flex justify-between text-body-2 gap-3">
      <ReceiptInfoBox label={receiptItem.name} className="w-full" />
      <ReceiptInfoBox label={amountWithSymbol} className="w-30" />
    </div>
  );
}
