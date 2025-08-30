'use client';

import TripInfo from './_components/TripInfo';
import DailyExpenseList from './_components/DailyExpenseList';
import SharedBudgetBar from './_components/SharedBudgetBar';
import TripDateBar from './_components/TripDateBar';
import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';
import TripHeader from '@/shared/components/TripHeader';
import { BudgetPageProps } from './types/budget-type';
import { useEffect, useState } from 'react';
import { GetTripBudgetDto } from './types/budget-dto-type';
import { getTripBudgetData } from './api/budget-api';

const BudgetPage = ({ tripId }: BudgetPageProps) => {
  const [budgetData, setData] = useState<GetTripBudgetDto | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    getTripBudgetData(Number(tripId))
      .then((res) => setData(res))
      .catch((e) => setError(e));
  }, [tripId]);
  if (error) return null; // TODO: 에러 뷰
  if (!budgetData) return null; // TODO: 로딩 스켈레톤

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        <TripInfo
          tripName={budgetData.tripName}
          countries={budgetData.countries}
          startDate={budgetData.startDate}
          endDate={budgetData.endDate}
        />
        <SharedBudgetBar
          tripId={budgetData.tripId}
          sharedFund={budgetData.sharedFund}
          topExpense={budgetData.topCategoryExpense}
        />
        <TripDateBar startDate={budgetData.startDate} endDate={budgetData.endDate} />
      </div>
      <DailyExpenseList dailyExpenses={budgetData.dailyExpenses} tripStartDate={budgetData.startDate} />
      <BottomSheetTrigger total={budgetData.totalExpense} />
    </div>
  );
};

export default BudgetPage;
