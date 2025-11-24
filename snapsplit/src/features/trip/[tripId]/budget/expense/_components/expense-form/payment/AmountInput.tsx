'use client';

import { getSymbol } from '@/shared/utils/currency';

type Props = {
  value: string;
  updateValue: (value: string) => void;
  currency: string;
};

const AmountInput = ({ value, updateValue, currency }: Props) => {
  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('[AmountInput] inputValue:', inputValue, typeof inputValue);

    // 입력 중에는 소수점으로 끝나는 숫자도 허용 (예: '123.')
    // 1. 빈 문자열 허용
    // 2. 0으로 시작하는 경우 소수점이나 숫자 허용 (예: 0, 0.5, 0.123)
    // 3. 0이 아닌 숫자로 시작하는 경우, 숫자와 소수점 허용 (예: 123, 123.45, 123.)
    // 4. 소수점만 입력된 경우 (예: '.')
    const numericRegex = /^\d*\.?\d*$/;
    console.log('[AmountInput] numericRegex:', numericRegex.test(inputValue));

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
