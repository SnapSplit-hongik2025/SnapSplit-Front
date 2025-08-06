import Image from 'next/image';
import checkGrey from '@public/svg/check_grey.svg';
import checkGreen from '@public/svg/check-green.svg';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';

type CurrencyListProps = {
  onClose: () => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
};

// TODO: 테스트 데이터
const currencyList = ['한국 - KRW(원)', '미국 - USD(달러)', '유럽 - EUR(유로)', '일본 - JPY(엔)'];

const CurrencyList = ({ onClose, setCurrency, selectedCurrency }: CurrencyListProps) => {
  return (
    <BottomSheet isOpen={true} onClose={onClose}>
      <div className="flex flex-col w-full">
        {currencyList.map((currency) => (
          <button key={currency} onClick={() => {setCurrency(currency); onClose();}} className="flex items-center py-3">
            {currency === selectedCurrency && <Image alt="check" src={checkGreen} width={24} height={24} />}
            {currency !== selectedCurrency && <Image alt="check" src={checkGrey} width={24} height={24} />}
            <div className="pl-1 text-body-1">{currency}</div>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};

export default CurrencyList;
