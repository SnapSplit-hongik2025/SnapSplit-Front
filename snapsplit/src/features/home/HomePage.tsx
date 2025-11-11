'use client';

import HomeHeader from './_components/HomeHeader';
import CreateTripSection from './_components/CreateTripSection';
import PastTripImgCardList from './_components/PastTripImgCardList';
import AllPastTripList from './_components/AllPastTripList';
import { getHomeData } from './api/home-api';
import { GetHomeResponseDto } from './types/home-type';
import Loading from '@/shared/components/loading/Loading';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const {
    data: homeData,
    isLoading,
    isError,
    error,
  } = useQuery<GetHomeResponseDto, Error>({
    queryKey: ['homeData'],
    queryFn: () => getHomeData(),
    staleTime: 1000 * 60 * 2,
  });

  const hasPastTrip = (homeData?.pastTrips?.length ?? 0) > 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center bg-grey-50 min-h-[100dvh] pb-6">
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center bg-grey-50 min-h-[100dvh] pb-6">
        데이터 로드 중 오류: {error?.message ?? ''}
      </div>
    );
  if (!homeData)
    return (
      <div className="flex items-center justify-center bg-grey-50 min-h-[100dvh] pb-6">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="flex flex-col bg-grey-50 min-h-[100dvh] pb-6">
      <HomeHeader />
      <CreateTripSection upcomingTrips={homeData.upcomingTrips ?? []} ongoingTrips={homeData.ongoingTrips ?? []} />
      {hasPastTrip ? (
        <>
          <PastTripImgCardList pastTrips={homeData.pastTrips} />
          <AllPastTripList pastTrips={homeData.pastTrips} />
        </>
      ) : (
        <div className="flex flex-1 text-grey-450 text-label-1">
          <span className="flex flex-col w-full items-center justify-center text-center">
            지금 바로 여행을 등록하고
            <br />
            여행홈을 둘러보세요!
          </span>
        </div>
      )}
    </div>
  );
}
