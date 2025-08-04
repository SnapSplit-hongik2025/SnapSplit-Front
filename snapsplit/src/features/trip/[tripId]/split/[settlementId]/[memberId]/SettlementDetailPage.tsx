import SettlementDetailHeader from './_components/SettlementDetailHeader';
import TotalAmountInfo from './_components/TotalAmountInfo';
import DetailExpenses from './_components/DetailExpenses';
import { SettlementDetailPageProps } from './type';
import mock from '@public/mocks/split-settlement-detail.json';

const SettlementDetailPage = ({ name }: SettlementDetailPageProps) => {
  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto scrollbar-hide">
      <SettlementDetailHeader />
      <TotalAmountInfo name={name} totalAmount={mock.totalAmount} />
      <DetailExpenses sharedBudgetDetails={mock.sharedBudgetDetails} />
    </div>
  );
};
export default SettlementDetailPage;
