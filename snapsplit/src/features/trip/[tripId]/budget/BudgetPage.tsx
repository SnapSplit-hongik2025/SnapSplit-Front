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
  // 스크롤 위치 저장 (0 ~ N)
  const [scrollY, setScrollY] = useState(0);

  // 축소될 영역(TripInfo + BudgetBar)의 전체 높이를 저장
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

  // 데이터 로드 후, 축소될 영역의 실제 높이를 측정하여 저장
  useEffect(() => {
    if (budgetData && collapsibleRef.current) {
      setHeaderHeight(collapsibleRef.current.offsetHeight);
    }
  }, [budgetData]);

  // 스크롤 핸들러: 현재 스크롤 위치를 state에 업데이트
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollY(scrollTop);
  };

  // --------------------------------------------------------------------------
  // [핵심 로직] 스크롤 위치에 따른 스타일 계산
  // --------------------------------------------------------------------------
  // 1. 높이: 원래 높이에서 스크롤된 만큼 뺌 (최소 0)
  const currentHeight = Math.max(0, headerHeight - scrollY);

  // 2. 투명도: 높이가 줄어들수록 흐려짐 (0 ~ 1)
  // headerHeight가 0일 경우(초기) 대비하여 1로 처리
  const opacity = headerHeight ? Math.max(0, 1 - scrollY / (headerHeight * 0.8)) : 1;

  // 3. 변형: 살짝 위로 올라가는 효과 (Parallax 느낌)
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
            transition: 'height 0.1s ease-out, opacity 0.1s ease-out', // 부드러운 전환을 위한 보정
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

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto bg-grey-100 scrollbar-hide" onScroll={handleScroll}>
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
