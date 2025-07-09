import TripInfo from './_components/TripInfo';
import DailyExpenseList from './_components/DailyExpenseList';
import SharedBudgetBar from './_components/SharedBudgetBar';
import TripDateBar from './_components/TripDateBar';
import TripHeader from './_components/TripHeader';
import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';
import { BudgetPageProps } from './type';

// 목데이터
import tripBudgetData from '@public/mocks/budget-mock.json';
const countries = tripBudgetData.countries;
const totalShared = tripBudgetData.totalShared;
const expenses = tripBudgetData.expenses;

const BudgetPage = ({ tripId }: BudgetPageProps) => {
  console.log(tripId);
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white">
        <TripHeader />
        <TripInfo tripName={'유luv여행'} countries={countries} startDate={'2025. 12. 22'} endDate={'2025 .12. 28'} />
        <SharedBudgetBar totalShared={totalShared} tripId={tripId} />
        <TripDateBar startDate="2025-04-07" endDate="2025-04-16" />
      </div>
      <DailyExpenseList expenses={expenses} tripStartDate="2025-04-07" tripEndDate="2025-04-16" />
      <BottomSheetTrigger total={1355200} />
    </div>
  );
};

export default BudgetPage;
