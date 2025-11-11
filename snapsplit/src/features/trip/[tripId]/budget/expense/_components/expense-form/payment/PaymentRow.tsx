'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import AmountInput from './AmountInput';

type Props = {
  payer: {
    memberId: number;
    name: string;
  };
  currency: string;
};

export default function PaymentRow({ payer, currency }: Props) {
  const member = useExpenseStore((s) => s.members.find((m) => m.memberId === payer.memberId));

  const setPayer = useExpenseStore((s) => s.setPayer);
  const updatePayAmount = useExpenseStore((s) => s.updatePayAmount);

  const isChecked = !!member?.isPayer;
  const payAmount = member?.payAmount ?? null;

  const toggleCheck = useCallback(() => {
    setPayer(payer.memberId, !isChecked);
    if (isChecked) {
      updatePayAmount(payer.memberId, null);
    }
  }, [setPayer, payer.memberId, isChecked, updatePayAmount]);

  const handleAmountChange = useCallback(
    (value: string) => {
      const amount = Number(value) || null;
      updatePayAmount(payer.memberId, amount);
    },
    [payer.memberId, updatePayAmount]
  );

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div>{payer.name}</div>
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
        <AmountInput value={payAmount?.toString() || ''} updateValue={handleAmountChange} currency={currency} />
      </div>
    </div>
  );
}
