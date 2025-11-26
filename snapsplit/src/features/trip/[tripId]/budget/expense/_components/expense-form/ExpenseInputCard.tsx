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

  // [수정 1] 입력값을 관리하는 로컬 state 추가 (초기값은 amount를 포맷팅한 문자열)
  const [inputValue, setInputValue] = useState(amount ? amount.toLocaleString() : '');

  // [수정 2] 부모의 amount가 외부 요인(예: OCR, 초기 로딩)으로 변했을 때 로컬 state 동기화
  useEffect(() => {
    // 현재 입력창의 콤마를 제거한 숫자값
    const currentNumericValue = Number(inputValue.replaceAll(',', ''));

    // 부모의 amount와 현재 입력값이 다를 때만 업데이트 (소수점 입력 중인 경우 방지)
    // 예: 사용자가 "10."을 입력 중일 때 amount는 10이므로 덮어씌우지 않음
    if (amount !== currentNumericValue && !inputValue.endsWith('.')) {
      setInputValue(amount ? amount.toLocaleString() : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 콤마 제거
    const rawValue = e.target.value.replaceAll(',', '');

    // [수정 3] 정규식 변경: 숫자 + 소수점(.) 허용
    // ^\d* : 숫자 0개 이상
    // (\.\d*)? : 소수점과 그 뒤 숫자 그룹이 0개 또는 1개
    const decimalRegex = /^\d*(\.\d*)?$/;

    if (decimalRegex.test(rawValue)) {
      // 2. 부모 state 업데이트 (숫자로 변환)
      setAmount(rawValue === '' ? 0 : Number(rawValue));

      // 3. 로컬 state 업데이트 (콤마 포맷팅 적용 + 소수점 유지)
      if (rawValue === '') {
        setInputValue('');
        return;
      }

      // 소수점을 기준으로 분리하여 정수부에만 콤마 적용
      const parts = rawValue.split('.');
      const integerPart = parts[0] === '' ? '0' : Number(parts[0]).toLocaleString();

      // 소수점이 존재하는 경우 합쳐서 표시
      if (parts.length > 1) {
        setInputValue(`${integerPart}.${parts[1]}`);
      } else if (rawValue.endsWith('.')) {
        // "123." 처럼 소수점을 막 찍은 경우
        setInputValue(`${integerPart}.`);
      } else {
        // 정수만 있는 경우
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
            className="w-full text-head-0 placeholder:text-grey-550"
            placeholder="금액 입력"
            onChange={onChangeAmount}
            // [수정 4] value를 부모의 amount가 아닌 로컬 inputValue로 연결
            value={inputValue}
            inputMode="decimal" // 모바일 키패드에 소수점 나오게 설정
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
