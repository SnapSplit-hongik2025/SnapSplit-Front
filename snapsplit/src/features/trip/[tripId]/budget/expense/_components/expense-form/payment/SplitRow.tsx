'use client';

import Image from 'next/image';
import { useCallback, useState, useEffect } from 'react';
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

  // 로컬 상태로 입력값을 문자열로 관리
  const [inputValue, setInputValue] = useState(splitAmount?.toString() || '');

  // 부모로부터 splitAmount가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    // 입력 중이 아닐 때만(마지막 문자가 .이 아닐 때) 부모 값으로 업데이트
    if (splitAmount?.toString() !== inputValue && !inputValue.endsWith('.')) {
      setInputValue(splitAmount?.toString() || '');
    }
  }, [splitAmount, inputValue]);

  const handleAmountChange = useCallback(
    (value: string) => {
      setInputValue(value);
      // 숫자로 변환 가능한 경우에만 부모 컴포넌트에 전달
      if (value === '' || !isNaN(Number(value))) {
        updateAmount(splitter.memberId, 'splitAmount', value === '' ? null : Number(value));
      }
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
            className={`flex items-center cursor-pointer justify-center w-6 h-6 rounded-full ${
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
        <AmountInput value={inputValue} updateValue={handleAmountChange} currency={currency} />
      </div>
    </div>
  );
}
