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

  // 헤더 전체의 높이를 측정하기 위한 ref와 state
  const [totalHeaderHeight, setTotalHeaderHeight] = useState(0);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  // 축소될 영역의 높이 (투명도 조절용)
  const [collapsibleHeight, setCollapsibleHeight] = useState(0);
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
    if (budgetData) {
      // 전체 헤더 높이 측정
      if (headerContainerRef.current) {
        setTotalHeaderHeight(headerContainerRef.current.offsetHeight);
      }
      // 축소될 영역 높이 측정
      if (collapsibleRef.current) {
        setCollapsibleHeight(collapsibleRef.current.offsetHeight);
      }
    }
  }, [budgetData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // requestAnimationFrame을 사용하여 상태 업데이트 최적화 (떨림 방지 도움)
    window.requestAnimationFrame(() => {
      setScrollY(scrollTop);
    });
  };

  // [핵심 로직]
  // 1. translateY: 스크롤한 만큼 헤더를 위로 올림 (단, 축소될 영역의 높이까지만 올림)
  //    -> TripHeader(상단바)와 TripDateBar(하단바)는 남기고 가운데만 접히는 듯한 효과
  const maxTranslate = collapsibleHeight;
  const translateY = Math.max(-scrollY, -maxTranslate);

  // 2. Opacity: 스크롤 됨에 따라 내용물 흐리게 처리
  const opacity = collapsibleHeight ? Math.max(0, 1 - scrollY / (collapsibleHeight * 0.8)) : 1;

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
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div
        ref={headerContainerRef}
        className="absolute top-0 left-0 right-0 z-10 bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.08)]"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform', // GPU 가속 유도
        }}
      >
        <TripHeader tripId={tripId} />
        <div
          ref={collapsibleRef}
          style={{
            opacity: opacity,
            willChange: 'opacity',
          }}
        >
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

        <TripDateBar startDate={budgetData.startDate} endDate={budgetData.endDate} />
      </div>
      <div
        id="scroll-target-top"
        className="flex-1 overflow-y-auto bg-grey-100 scrollbar-hide"
        onScroll={handleScroll}
        style={{
          paddingTop: totalHeaderHeight ? `${totalHeaderHeight}px` : '300px', // 초기값은 대략적으로 설정하거나 로딩 처리
        }}
      >
        <div style={{ minHeight: `calc(100% + ${collapsibleHeight}px)` }}>
          <DailyExpenseList
            dailyExpenses={budgetData.dailyExpenses}
            tripStartDate={budgetData.startDate}
            tripEndDate={budgetData.endDate}
            tripId={tripId}
          />
        </div>
      </div>

      <BottomSheetTrigger total={budgetData.totalExpense} tripId={tripId} />
    </div>
  );
};

export default BudgetPage;
