'use client';

import { useState } from 'react';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import CurrencyBottomSheet from '@/features/trip/[tripId]/budget/shared/_components/CurrencyBottomSheet';
import CurrencyButton from '@/features/trip/[tripId]/budget/expense/_components/expense-form/input-card/CurrencyButton';
import ReceiptRegisterButton from '@/features/trip/[tripId]/budget/expense/_components/ReceiptRegisterButton';

type Props = {
  amount: number | null;
  setAmount: (amount: number) => void;
  exchangeRates: Record<string, number>;
  currency: string;
  setCurrency: (currency: string) => void;
  mode: 'receipt' | 'expense';
};

export default function ExpenseInputCard({amount, setAmount, exchangeRates, currency, setCurrency, mode}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('[AmountInput] inputValue:', inputValue, typeof inputValue);

    // 정규식을 사용하여 입력값이 숫자로만 구성되었는지 확인합니다.
    // (빈 문자열도 허용하기 위해 `*` 사용)
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(inputValue)) {
      // 유효한 숫자 문자열(또는 빈 문자열)일 경우에만 상태를 업데이트합니다.
      // 이 로직 덕분에 '0'에서 backspace를 누르면 빈 문자열('')이 되어
      // 입력창이 깨끗하게 지워집니다.
      setAmount(Number(inputValue));
    }
    // 숫자나 빈 문자열이 아니면 (예: 'abc', '12a') 상태를 업데이트하지 않아
    // 입력이 무시됩니다.
  };

  const exchangeAmount = (KRWAmount: number, currency: string) => {
    const exchangeRate = exchangeRates[currency];
    return KRWAmount * exchangeRate;
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
            value={amount || ''}
          />
          <div className="text-body-3 text-grey-550">
            {'= '}
            {exchangeAmount(amount || 0, currency).toLocaleString()}원
          </div>
        </div>
      </div>
      {mode === 'expense' ? <ReceiptRegisterButton /> : null}
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet onClose={() => setIsOpen(false)} selectedCurrency={currency} setCurrency={setCurrency} />
      </BottomSheet>
    </div>
  );
}
