'use client';

import { useState, useEffect } from 'react';
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
  readOnly?: boolean; // 금액 입력만 막는 용도로 사용
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
  readOnly = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [inputValue, setInputValue] = useState(amount ? amount.toLocaleString() : '');

  useEffect(() => {
    const currentNumericValue = Number(inputValue.replaceAll(',', ''));

    if (amount !== currentNumericValue && !inputValue.endsWith('.')) {
      setInputValue(amount ? amount.toLocaleString() : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, readOnly]);

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 금액 입력은 readOnly일 때 막음
    if (readOnly) return;

    const rawValue = e.target.value.replaceAll(',', '');
    const decimalRegex = /^\d*(\.\d*)?$/;

    if (decimalRegex.test(rawValue)) {
      setAmount(rawValue === '' ? 0 : Number(rawValue));

      if (rawValue === '') {
        setInputValue('');
        return;
      }

      const parts = rawValue.split('.');
      const integerPart = parts[0] === '' ? '0' : Number(parts[0]).toLocaleString();

      if (parts.length > 1) {
        setInputValue(`${integerPart}.${parts[1]}`);
      } else if (rawValue.endsWith('.')) {
        setInputValue(`${integerPart}.`);
      } else {
        setInputValue(integerPart);
      }
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
            className={`w-full text-head-0 placeholder:text-grey-550 bg-transparent ${
              readOnly ? 'cursor-default' : ''
            }`}
            placeholder="금액 입력"
            onChange={onChangeAmount}
            value={inputValue}
            inputMode="decimal"
            disabled={readOnly}
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
