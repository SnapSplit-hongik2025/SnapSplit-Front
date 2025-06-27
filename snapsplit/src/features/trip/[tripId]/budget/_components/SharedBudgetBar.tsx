import { SharedBudgetBarProps } from '../type';
import { useCurrencySymbol } from '@/shared/utils/useCurrencySymbol';
import rightArrow from '@public/svg/rightArrow.svg';
import Image from 'next/image';

const SharedBudgetBar = ({ totalShared }: SharedBudgetBarProps) => {
  const Currencysymbol = useCurrencySymbol(totalShared[0].totalSharedCurrency);

  return (
    <div className="flex w-full px-5 pb-5">
      <div className="flex-col w-full items-center rounded-xl bg-grey-650 px-[14px] py-3  text-body-2">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-stone-300 ">공동경비 잔액</p>
          <p className="text-grey-650 text-body-1 px-3 py-[6px] bg-grey-50 rounded-lg">경비 수정하기</p>
        </div>
        <div className="flex flex-row">
          <p className="text-head-0 text-grey-50">
            {Currencysymbol}
            {totalShared[0].totalSharedAmount.toLocaleString()}
            {/* 대표 1개만 보여줄지, 더 보여줄지 기획 따라 UI 변경 가능성 있음 */}
          </p>
          <Image alt=">" src={rightArrow} />
        </div>
        <p className="text-body-2 text-grey-50">어제보다 36유로 덜 썼어요!</p>
      </div>
    </div>
  );
};

export default SharedBudgetBar;
