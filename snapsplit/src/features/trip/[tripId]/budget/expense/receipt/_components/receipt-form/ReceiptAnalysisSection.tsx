'use client';

import RECEIPT_ITEMS from '@public/mocks/receipt-items.json';
import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import { useEffect } from 'react';

type ReceiptAnalysisSectionProps = {
    items: ReceiptItem[];
    setItems: (items: ReceiptItem[]) => void;
}

export default function ReceiptAnalysisSection({ items, setItems }: ReceiptAnalysisSectionProps) {
  useEffect(() => {
    setItems(RECEIPT_ITEMS);
  }, [setItems]);

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: '', amount: '' }]);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name: e.target.value } : item)));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, amount: e.target.value } : item)));
  };

  return (
    <div className="flex flex-col items-center w-full gap-3 text-body-3">
      <div className="flex items-center w-full gap-3">
        <div className="w-2/3">상품명</div>
        <div className="w-1/3">금액</div>
      </div>
      {items.map((item, index) => (
        <ReceiptAnalysisItem
          key={index}
          id={item.id}
          name={item.name}
          amount={item.amount}
          handleNameChange={handleNameChange}
          handleAmountChange={handleAmountChange}
        />
      ))}
      <div className="w-full h-8 px-24">
        <button
          onClick={handleAddItem}
          className="flex items-center justify-center w-full h-full rounded-xl bg-grey-150 text-grey-550 text-body-1"
        >
          항목 추가하기
        </button>
      </div>
    </div>
  );
}

type ReceiptAnalysisItemProps = {
  id: number;
  name: string;
  amount: string;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
};

function ReceiptAnalysisItem({ id, name, amount, handleNameChange, handleAmountChange }: ReceiptAnalysisItemProps) {
  return (
    <div className="flex items-center w-full gap-3">
      <div className="w-2/3 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250">
        <input className="text-body-2 focus:outline-none" value={name} placeholder="상품명" onChange={(e) => handleNameChange(e, id)} />
      </div>
      <div className="w-1/3 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250">
        <input className="text-body-2 focus:outline-none" value={amount} placeholder="금액" onChange={(e) => handleAmountChange(e, id)} />
      </div>
    </div>
  );
}
