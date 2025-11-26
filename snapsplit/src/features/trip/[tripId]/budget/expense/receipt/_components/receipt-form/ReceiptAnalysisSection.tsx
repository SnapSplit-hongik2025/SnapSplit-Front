'use client';

import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import deleteIcon from '@public/svg/delete.svg';
import Image from 'next/image';

type ReceiptAnalysisSectionProps = {
  items: ReceiptItem[];
  setItems: (items: ReceiptItem[]) => void;
  setAmount: (amount: number) => void;
};

export default function ReceiptAnalysisSection({ items, setItems, setAmount }: ReceiptAnalysisSectionProps) {
  const handleAddItem = () => {
    // id를 고유하게 만들기 위해 Date.now() 사용 권장
    setItems([...items, { id: Date.now(), name: '', amount: '' }]);
  };

  // [추가] 항목 삭제 함수
  const handleDeleteItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);

    // 삭제 후 총액 재계산
    const totalAmount = newItems.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    setAmount(Number(totalAmount.toFixed(2)));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name: e.target.value } : item)));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, amount: e.target.value } : item));

    setItems(newItems);

    const totalAmount = newItems.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    setAmount(Number(totalAmount.toFixed(2)));
  };

  return (
    <div className="flex flex-col items-center w-full gap-3 text-body-3">
      <div className="flex items-center w-full gap-3 pr-8">
        <div className="flex-2">상품명</div>
        <div className="flex-1">금액</div>
      </div>
      {items.map((item, index) => (
        <ReceiptAnalysisItem
          key={item.id ?? index}
          id={item.id!}
          name={item.name}
          amount={item.amount as string}
          handleNameChange={handleNameChange}
          handleAmountChange={handleAmountChange}
          onDelete={handleDeleteItem}
        />
      ))}
      <div className="w-full h-8 px-24 mt-2">
        <button
          onClick={handleAddItem}
          className="flex cursor-pointer items-center justify-center w-full h-full rounded-xl bg-grey-150 text-grey-550 text-body-1 hover:bg-grey-200 transition-colors"
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
  onDelete: (id: number) => void;
};

function ReceiptAnalysisItem({
  id,
  name,
  amount,
  handleNameChange,
  handleAmountChange,
  onDelete,
}: ReceiptAnalysisItemProps) {
  return (
    <div className="flex items-center w-full gap-2">
      <div className="flex-2 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250 bg-white">
        <input
          className="w-full text-body-2 focus:outline-none bg-transparent"
          value={name}
          placeholder="상품명"
          onChange={(e) => handleNameChange(e, id)}
        />
      </div>
      <div className="flex-1 px-4 flex items-center justify-start h-12 rounded-xl border-[1px] border-grey-250 bg-white">
        <input
          className="w-full text-body-2 focus:outline-none bg-transparent"
          value={amount}
          placeholder="금액"
          onChange={(e) => handleAmountChange(e, id)}
          inputMode="decimal"
        />
      </div>
      <button
        onClick={() => onDelete(id)}
        className="flex items-center justify-center text-grey-400 hover:text-red-500 transition-colors"
        aria-label="삭제"
      >
        <Image src={deleteIcon} alt="삭제 아이콘" width={16} height={16} className="cursor-pointer" />
      </button>
    </div>
  );
}
