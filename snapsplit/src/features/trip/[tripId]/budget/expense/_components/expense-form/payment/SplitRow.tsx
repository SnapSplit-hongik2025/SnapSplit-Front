'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import AmountInput from './AmountInput';

type Props = {
  splitter: {
    memberId: number;
    name: string;
  };
};

export default function SplitRow({ splitter }: Props) {
  const member = useExpenseStore((s) => s.members.find((m) => m.memberId === splitter.memberId));

  const setSplitter = useExpenseStore((s) => s.setSplitter);
  const updateSplitAmount = useExpenseStore((s) => s.updateSplitAmount);

  const isChecked = !!member?.isSplitter;
  const splitAmount = member?.splitAmount ?? null;

  const toggleCheck = useCallback(() => {
    setSplitter(splitter.memberId, !isChecked);
  }, [setSplitter, splitter.memberId, isChecked]);

  const handleAmountChange = useCallback(
    (value: string) => {
      const amount = Number(value) || null;
      updateSplitAmount(splitter.memberId, amount);
    },
    [splitter.memberId, updateSplitAmount]
  );

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div>{splitter.name}</div>
      <div className="flex items-center">
        <div className="flex items-center justify-center w-20">
          <button
            type="button"
            onClick={toggleCheck}
            className={`flex items-center justify-center w-6 h-6 rounded-full ${
              isChecked ? 'bg-primary text-white' : 'border-[1px] border-grey-250'
            }`}
          >
            <Image
              src={isChecked ? '/svg/check-expense-white.svg' : '/svg/check-expense-grey.svg'}
              alt="check-expense"
              width={24}
              height={24}
            />
          </button>
        </div>
        <AmountInput value={splitAmount?.toString() || ''} updateValue={handleAmountChange} />
      </div>
    </div>
  );
}
