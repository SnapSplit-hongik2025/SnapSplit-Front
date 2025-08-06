'use client';

import Image from 'next/image';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { CURRENCY_LIST } from '@/shared/constants/currency';

type CurrencyBottomSheetProps = {
  onClose?: () => void;
};

const CurrencyBottomSheet = ({ onClose }: CurrencyBottomSheetProps) => {
  const { setCurrency } = useExpenseStore();
  const selectedCurrency = useExpenseStore((state) => state.expense.currency);
  return (
    <div className="flex flex-col w-full">
      {CURRENCY_LIST.map((currency) => (
        <button
          key={currency.label}
          onClick={() => {
            setCurrency(currency.label);
            onClose?.();
          }}
          className="flex items-center py-3"
        >
          {currency.label === selectedCurrency && <Image alt="check" src="/svg/check-green.svg" width={24} height={24} />}
          {currency.label !== selectedCurrency && <Image alt="check" src="/svg/check_grey.svg" width={24} height={24} />}
          <div
            className={`pl-[1.5px] text-body-1 ${currency.label === selectedCurrency ? 'text-primary' : 'text-grey-1000'}`}
          >
            {currency.label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CurrencyBottomSheet;
