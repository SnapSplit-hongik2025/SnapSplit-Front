import Image from 'next/image';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { getKorName } from '@/shared/utils/currency';

type Props = {
  onClick?: () => void;
  currency: string;
};

export default function CurrencyButton({ onClick, currency }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center h-8 pl-3 pr-1.5 py-1 bg-white rounded-3xl border-[1px] border-grey-250"
    >
      <div className="text-body-3">{currency + '(' + getKorName(currency) + ')'}</div>
      <Image src="/svg/arrow-bottom-grey-450.svg" alt="back" width={24} height={24} />
    </button>
  );
}
