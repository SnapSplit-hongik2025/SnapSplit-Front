'use client';

import { useState } from 'react';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import CurrencyBottomSheet from '@/features/trip/[tripId]/budget/shared/_components/CurrencyBottomSheet';
import CurrencyButton from '@/features/trip/[tripId]/budget/expense/_components/CurrencyButton';
import ReceiptRegisterButton from '@/features/trip/[tripId]/budget/expense/_components/ReceiptRegisterButton';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';

export default function ExpenseInputCard() {
  const [isOpen, setIsOpen] = useState(false);
  const { amount, setAmount } = useExpenseStore();

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-5 py-4 rounded-xl bg-grey-150">
      <div className="flex flex-col items-start justify-between w-full gap-3">
        <CurrencyButton onClick={() => setIsOpen(true)} />
        <div className="flex flex-col items-start justify-between gap-1 w-full">
          <input
            type="text"
            className="w-full text-head-0 placeholder:text-grey-550"
            placeholder="금액 입력"
            onChange={onChangeAmount}
          />
          <div className="text-body-3 text-grey-550">
            {'='}
            {amount}원
          </div>
        </div>
      </div>
      <ReceiptRegisterButton />
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet onClose={() => setIsOpen(false)} />
      </BottomSheet>
    </div>
  );
}
