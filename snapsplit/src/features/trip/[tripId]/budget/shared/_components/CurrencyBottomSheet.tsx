'use client';

import Image from 'next/image';

type CurrencyBottomSheetProps = {
  onClose?: () => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
};

// TODO: 테스트 데이터
const currencyList = ['한국 - KRW(원)', '미국 - USD(달러)', '유럽 - EUR(유로)', '일본 - JPY(엔)'];

const CurrencyBottomSheet = ({ onClose, selectedCurrency, setCurrency }: CurrencyBottomSheetProps) => {
  return (
    <div className="flex flex-col w-full">
      {currencyList.map((currency) => (
        <button
          key={currency}
          onClick={() => {
            setCurrency(currency);
            onClose?.();
          }}
          className="flex items-center py-3"
        >
          {currency === selectedCurrency && <Image alt="check" src="/svg/check-green.svg" width={24} height={24} />}
          {currency !== selectedCurrency && <Image alt="check" src="/svg/check_grey.svg" width={24} height={24} />}
          <div
            className={`pl-[1.5px] text-body-1 ${currency === selectedCurrency ? 'text-primary' : 'text-grey-1000'}`}
          >
            {currency}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CurrencyBottomSheet;
