import Image from 'next/image';
import arrow_bottom from '@public/svg/arrow_bottom.svg';
import { getNation } from '@/shared/utils/currency';

type BudgetInputProps = {
  currency: string;
  amount: string;
  setAmount: (amount: string) => void;
  isCurrencyOpen: boolean;
  setIsCurrencyOpen: (open: boolean) => void;
};

// TODO: 통화별 환율 적용 결과 표시
const BudgetInput = ({ currency, amount, setAmount, isCurrencyOpen, setIsCurrencyOpen }: BudgetInputProps) => {

  return (
    <div className="flex flex-col px-5 py-4 gap-3 rounded-xl bg-grey-150">
      <div className="flex items-center">
        <button
          onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
          className="inline-flex items-center bg-white rounded-xl pl-3 pr-1"
        >
          <div className="inline-flex text-body-2">{currency}({getNation(currency)})</div>
          <Image alt="arrow" src={arrow_bottom} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="금액 입력"
          className="text-head-0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex items-center text-body-2 text-grey-550">= 0원</div>
      </div>
    </div>
  );
};

export default BudgetInput;
