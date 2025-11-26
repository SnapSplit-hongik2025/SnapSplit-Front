'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [scrollY, setScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const collapsibleRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (budgetData && collapsibleRef.current) {
      setHeaderHeight(collapsibleRef.current.offsetHeight);
    }
  }, [budgetData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollY(scrollTop);
  };

  const currentHeight = Math.max(0, headerHeight - scrollY);
  const opacity = headerHeight ? Math.max(0, 1 - scrollY / (headerHeight * 0.8)) : 1;
  const translateY = Math.min(0, -scrollY / 3);

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
      <div
        className={`bg-white z-10 relative transition-shadow duration-200 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.08)]
        }`}
      >
        <TripHeader tripId={tripId} />
        <div
          style={{
            height: headerHeight ? `${currentHeight}px` : 'auto',
            opacity: opacity,
            transform: `translateY(${translateY}px)`,
            overflow: 'hidden',
            transition: 'height 0.1s ease-out, opacity 0.1s ease-out',
          }}
        >
          <div ref={collapsibleRef}>
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
          </div>
        </div>
        <TripDateBar startDate={budgetData.startDate} endDate={budgetData.endDate} />
      </div>

      <div id="scroll-target-top" className="flex-1 overflow-y-auto bg-grey-100 scrollbar-hide" onScroll={handleScroll}>
        <DailyExpenseList
          dailyExpenses={budgetData.dailyExpenses}
          tripStartDate={budgetData.startDate}
          tripEndDate={budgetData.endDate}
          tripId={tripId}
        />
      </div>

      <BottomSheetTrigger total={budgetData.totalExpense} tripId={tripId} />
    </div>
  );
};

export default BudgetPage;
