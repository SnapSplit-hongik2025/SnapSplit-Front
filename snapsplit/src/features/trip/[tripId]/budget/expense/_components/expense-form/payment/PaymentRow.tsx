'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';

type Props = {
  payer: {
    memberId: number;
    name: string;
  };
};

export default function PaymentRow({ payer }: Props) {
  const [isChecked, setIsChecked] = useState(false);
  const { appendPayer } = useExpenseStore();

  const toggleCheck = () => {
    setIsChecked(!isChecked);
    appendPayer({ memberId: payer.memberId, payerAmount: 0 });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    appendPayer({ memberId: payer.memberId, payerAmount: amount });
  };

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div>{payer.name}</div>
      <div className="flex items-center">
        <div className="flex items-center justify-center w-20">
          <button
            onClick={toggleCheck}
            className={`flex items-center justify-center w-6 h-6 rounded-full ${isChecked ? 'bg-primary text-white' : 'border-[1px] border-grey-250'}`}
          >
            <Image
              src={isChecked ? '/svg/check-expense-white.svg' : '/svg/check-expense-grey.svg'}
              alt="check-expense"
              width={24}
              height={24}
            />
          </button>
        </div>
        <input
          type="number"
          className="flex items-center justify-center w-20 text-center text-grey-450"
          placeholder="0"
          onChange={handleAmountChange}
        />
      </div>
    </div>
  );
}
