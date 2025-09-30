import Image from 'next/image';
import checkGrey from '@public/svg/check_grey.svg';
import checkGreen from '@public/svg/check-green.svg';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { getNation, getKorName } from '@/shared/utils/currency';

type CurrencyListProps = {
  onClose: () => void;
  selectedCurrency: string;
  availableCurrencies: string[];
  handleCurrencyChange: () => void;
};

const CurrencyList = ({ onClose, selectedCurrency, availableCurrencies, handleCurrencyChange }: CurrencyListProps) => {
  return (
    <BottomSheet isOpen={true} onClose={onClose}>
      <div className="flex flex-col w-full">
        {availableCurrencies.map((currency) => (
          <button key={currency} onClick={() => {handleCurrencyChange(); onClose();}} className="flex items-center py-3">
            {currency === selectedCurrency && <Image alt="check" src={checkGreen} width={24} height={24} />}
            {currency !== selectedCurrency && <Image alt="check" src={checkGrey} width={24} height={24} />}
            <div className="pl-1 text-body-1">{getNation(currency)} - {currency}({getKorName(currency)})</div>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};

export default CurrencyList;
