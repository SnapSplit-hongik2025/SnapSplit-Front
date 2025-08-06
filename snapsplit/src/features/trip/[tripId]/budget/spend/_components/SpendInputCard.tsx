import CurrencyButton from './CurrencyButton';
import ReceiptRegisterButton from './ReceiptRegisterButton';

export default function SpendInputCard() {
  return (
    <div className="flex flex-col items-center gap-4 w-full px-5 py-4 rounded-xl bg-grey-150">
      <div className="flex flex-col items-start justify-between w-full gap-3">
        <CurrencyButton />
        <div className="flex flex-col items-start justify-between gap-1 w-full">
            <input type="text" className="w-full text-head-0" placeholder="금액 입력" />
            <div className="text-body-3 text-grey-550">= 0원</div>
        </div>
      </div>
      <ReceiptRegisterButton />
    </div>
  );
}
