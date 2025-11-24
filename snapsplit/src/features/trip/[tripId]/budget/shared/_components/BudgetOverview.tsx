import { getKorName, getNation, getSymbol } from '@/shared/utils/currency';

type BudgetOverviewProps = {
  totalSharedBudget: { amount: number; currency: string }[];
};
// TODO: api 데이터로 변경
const BudgetOverview = ({ totalSharedBudget }: BudgetOverviewProps) => {
  return (
    <div className="flex flex-col items-center w-full px-5 py-4.5 bg-grey-850">
      {totalSharedBudget.map((item, index) => {
        console.log(item);
        return (
          <div className="flex items-center justify-between w-full py-1" key={index}>
            <div className="text-body-1 text-grey-450">{getNation(item.currency)} - {item.currency}({getKorName(item.currency)})</div>
            <div className="text-label-1 text-white">
              {item.amount}
              {getSymbol(item.currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetOverview;
