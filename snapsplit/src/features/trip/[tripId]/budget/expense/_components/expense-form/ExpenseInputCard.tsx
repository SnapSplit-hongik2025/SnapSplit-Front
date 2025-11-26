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
  setExchangeRate: (exchangeRate: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  availCurrencies: string[];
  mode: 'receipt' | 'expense';
};

export default function ExpenseInputCard({
  amount,
  setAmount,
  exchangeRates,
  setExchangeRate,
  currency,
  setCurrency,
  availCurrencies,
  mode,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 입력된 값에서 콤마(,)를 모두 제거하여 순수 숫자 문자열만 추출합니다.
    const rawValue = e.target.value.replaceAll(',', '');

    // 2. 정규식 체크 (이제 콤마가 없으므로 1000 이상의 숫자도 통과됩니다)
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(rawValue)) {
      // 3. 상태 업데이트
      // 빈 문자열일 경우 0이나 null로 처리하거나, 기획 의도에 맞게 NaN 처리를 해주세요.
      // 여기서는 기존 로직대로 Number()를 사용합니다.
      setAmount(Number(rawValue));
    }
  };

  const toKRW = (amount: number, currency: string) => {
    const exchangeRate = exchangeRates[currency];
    if (exchangeRate === null || !Number.isFinite(exchangeRate)) return 0;
    return amount * exchangeRate;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-5 py-4 rounded-xl bg-grey-150">
      <div className="flex flex-col items-start justify-between w-full gap-3">
        <CurrencyButton onClick={() => setIsOpen(true)} currency={currency} />
        <div className="flex flex-col items-start justify-between gap-1 w-full">
          <input
            type="text"
            className="w-full text-head-0 placeholder:text-grey-550"
            placeholder="금액 입력"
            onChange={onChangeAmount}
            value={amount?.toLocaleString() || ''}
          />
          <div className="text-body-3 text-grey-550">
            {'= '}
            {toKRW(amount || 0, currency).toLocaleString()}원
          </div>
        </div>
      </div>
      {mode === 'expense' ? <ReceiptRegisterButton /> : null}
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet
          onClose={() => setIsOpen(false)}
          selectedCurrency={currency}
          handleCurrencyChange={(currency) => {
            setCurrency(currency);
            setExchangeRate(exchangeRates[currency]);
          }}
          availableCurrencies={availCurrencies}
        />
      </BottomSheet>
    </div>
  );
}
