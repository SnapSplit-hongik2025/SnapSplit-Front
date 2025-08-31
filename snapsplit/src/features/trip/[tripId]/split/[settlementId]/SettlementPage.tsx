import Button from '@/shared/components/Button';
import SettlementHeader from './_components/SettlementHeader';
import SettlementInfoSection from './_components/SettlementInfoSection';
import { SettlementPageProps } from './types/settlement-type';
import Divider from '@/shared/components/Divider';
import mock from '@public/mocks/split-settlement-mock.json';
import PersonalExpensesList from './_components/PersonalExpensesList';

// GNB 사이즈 재조정 이후, margin 조정 필요

const SettlementPage = ({ tripId, settlementId, startDay, endDay }: SettlementPageProps) => {
  return (
    <div className="h-screen w-full flex flex-col bg-light_grey overflow-y-auto scrollbar-hide">
      <section className="flex flex-col pt-2 pb-6 px-5">
        <SettlementHeader tripId={tripId} />
        <SettlementInfoSection
          members={mock.data.members}
          endDay={endDay}
          startDay={startDay}
          SettlementDetailDto={mock.data.settlementDetails}
        />
        <Button label="카카오톡으로 공유하기" />
      </section>
      <Divider />
      <section className="flex flex-col px-5 pt-6 pb-8 gap-3 w-full text-body-1 mb-[60px]">
        <PersonalExpensesList
          settlementId={settlementId}
          expenses={mock.data.personalExpenses}
          totalAmount={mock.data.totalAmount}
        />
      </section>
    </div>
  );
};

export default SettlementPage;
