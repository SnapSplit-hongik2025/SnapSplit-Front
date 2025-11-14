'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import AmountInput from './AmountInput';
import type { MemberState } from '../../ExpenseForm';

type Props = {
  splitter: {
    memberId: number;
    name: string;
  };
  currency: string;
  membersState: Record<number, MemberState>;
  handleCheck: (id: number, key: 'isPayer' | 'isSplitter') => void;
  updateAmount: (id: number, key: 'payAmount' | 'splitAmount', value: number | null) => void;
};

export default function SplitRow({ splitter, currency, membersState, handleCheck, updateAmount }: Props) {
  const isChecked = membersState[splitter.memberId]?.isSplitter;
  const splitAmount = membersState[splitter.memberId]?.splitAmount || null;

  const handleAmountChange = useCallback(
    (value: string) => {
      const amount = Number(value) || null;
      updateAmount(splitter.memberId, 'splitAmount', amount);
    },
    [splitter.memberId, updateAmount]
  );

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div>{splitter.name}</div>
      <div className="flex items-center">
        <div className="flex items-center justify-center w-20">
          <button
            type="button"
            onClick={() => handleCheck(splitter.memberId, 'isSplitter')}
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
        <AmountInput value={splitAmount?.toString() || ''} updateValue={handleAmountChange} currency={currency} />
      </div>
    </div>
  );
}
