import TripInfo from './_components/TripInfo';
import DailyExpenseList from './_components/DailyExpenseList';
import SharedBudgetBar from './_components/SharedBudgetBar';
import TripDateBar from './_components/TripDateBar';
import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';
import TripHeader from '@/shared/components/TripHeader';
import { BudgetPageProps } from './types/budget-type';

// 목데이터
import mockData from '@public/mocks/budget-mock.json';
import { GetTripBudgetDto } from './types/budget-dto-type';

const BudgetPage = ({ tripId }: BudgetPageProps) => {
  const mock = mockData as { data: GetTripBudgetDto };
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        <TripInfo
          tripName={mock.data.tripName}
          countries={mock.data.countries}
          startDate={mock.data.startDate}
          endDate={mock.data.endDate}
        />
        <SharedBudgetBar
          tripId={mock.data.tripId}
          sharedFund={mock.data.sharedFund}
          topExpense={mock.data.topCategoryExpense}
        />
        <TripDateBar startDate={mock.data.startDate} endDate={mock.data.endDate} />
      </div>
      <DailyExpenseList dailyExpenses={mock.data.dailyExpenses} tripStartDate={mock.data.startDate} />
      <BottomSheetTrigger total={mock.data.totalExpense} />
    </div>
  );
};

export default BudgetPage;
