'use client';

import Image from 'next/image';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { useExpenseInitStore } from '@/lib/zustand/useExpenseInitStore';
import { getKorName, getNation } from '@/shared/utils/currency';

type CurrencyBottomSheetProps = {
  onClose?: () => void;
};

const CurrencyBottomSheet = ({ onClose }: CurrencyBottomSheetProps) => {
  const { availCurrencies } = useExpenseInitStore();
  const { setCurrency } = useExpenseStore();
  const selectedCurrency = useExpenseStore((state) => state.currency);
  return (
    <div className="flex flex-col w-full">
      {availCurrencies.map((currency) => (
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
