'use client';

import Image from 'next/image';
import { getKorName, getNation } from '@/shared/utils/currency';

type CurrencyBottomSheetProps = {
  onClose?: () => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  availableCurrencies: string[];
};

const CurrencyBottomSheet = ({ onClose, selectedCurrency, setCurrency, availableCurrencies }: CurrencyBottomSheetProps) => {
  return (
    <div className="flex flex-col w-full">
      {availableCurrencies.map((currency) => (
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
            {getNation(currency) + ' - ' + currency + '(' + getKorName(currency) + ')'}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CurrencyBottomSheet;
