'use client';

import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { getSymbol } from '@/shared/utils/currency';

type Props = {
  value: string;
  updateValue: (value: string) => void;
};

const AmountInput = ({ value, updateValue }: Props) => {
  const currency = useExpenseStore((s) => s.currency);

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
      updateValue(inputValue);
    }
    // 숫자나 빈 문자열이 아니면 (예: 'abc', '12a') 상태를 업데이트하지 않아
    // 입력이 무시됩니다.
  };

  return (
    <div className="w-20 flex items-center justify-center pr-4">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChangeAmount(e);
        }}
        placeholder="0"
        className={`
          w-full
          text-right
          text-black 
          placeholder-grey-450 
          focus:outline-none
          focus:placeholder-transparent
          [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none
        `}
      />
      <span className={`text-body-3 ${value === '' ? 'text-grey-450' : ''}`}>{getSymbol(currency)}</span>
    </div>
  );
};

export default AmountInput;
