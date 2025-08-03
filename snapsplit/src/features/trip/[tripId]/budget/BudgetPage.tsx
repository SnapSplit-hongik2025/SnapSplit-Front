import TripInfo from './_components/TripInfo';
import DailyExpenseList from './_components/DailyExpenseList';
import SharedBudgetBar from './_components/SharedBudgetBar';
import TripDateBar from './_components/TripDateBar';
import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';
import TripHeader from '@/shared/components/TripHeader';
import { BudgetPageProps } from './type';

// 목데이터
import mock from '@public/mocks/budget-mock.json';

const BudgetPage = ({ tripId }: BudgetPageProps) => {
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
      {/* <DailyExpenseList expenses={expenses} tripStartDate={trip.startDate} tripEndDate={trip.endDate} />
      <BottomSheetTrigger total={trip.tripTotalExpense} /> */}
    </div>
  );
};

export default BudgetPage;
