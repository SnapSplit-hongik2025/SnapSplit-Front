'use client';

import TripInfo from './_components/TripInfo';
import DailyExpenseList from './_components/DailyExpenseList';
import SharedBudgetBar from './_components/SharedBudgetBar';
import TripDateBar from './_components/TripDateBar';
import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';
import TripHeader from '@/shared/components/TripHeader';
import { BudgetPageProps } from './types/budget-type';
import { GetTripBudgetDto } from './types/budget-dto-type';
import { getTripBudgetData } from './api/budget-api';

import { useQuery } from '@tanstack/react-query';
import Loading from '@/shared/components/loading/Loading';

const BudgetPage = ({ tripId }: BudgetPageProps) => {
  const {
    data: budgetData,
    isLoading,
    isError,
    error,
  } = useQuery<GetTripBudgetDto, Error>({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 2,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {error?.message ?? ''}</p>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        <TripInfo
          memberProfileImages={budgetData.memberProfileImages}
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
      <DailyExpenseList
        dailyExpenses={budgetData.dailyExpenses}
        tripStartDate={budgetData.startDate}
        tripEndDate={budgetData.endDate}
        tripId={tripId}
      />
      <BottomSheetTrigger total={budgetData.totalExpense} tripId={tripId} />
    </div>
  );
};

export default BudgetPage;
