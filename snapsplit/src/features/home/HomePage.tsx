'use client';

import { useEffect, useState } from 'react';
import HomeHeader from './_components/HomeHeader';
import CreateTripSection from './_components/CreateTripSection';
import PastTripImgCardList from './_components/PastTripImgCardList';
import AllPastTripList from './_components/AllPastTripList';
import { getHomeData } from './api/home-api';
import { GetHomeResponseDto } from './types/home-type';
import Loading from '@/shared/components/loading/Loading';

export default function HomePage() {
  const [homeData, setHomeData] = useState<GetHomeResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const hasPastTrip = (homeData?.pastTrips?.length ?? 0) > 0;

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await getHomeData();
        // 상태 업데이트 전, 컴포넌트가 여전히 마운트 상태인지 확인
        if (mounted) {
          setHomeData(data);
          console.log('홈 데이터:', data);
        }
      } catch (e) {
        if (mounted) {
          console.log('홈 데이터 로딩 실패:', e);
        }
      } finally {
        // 로딩 상태 업데이트 전에도 마운트 상태 확인
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center bg-grey-50 min-h-[100dvh] pb-6">
        <Loading />
      </div>
    );
  if (!homeData) return <div>데이터를 불러오지 못했습니다.</div>;

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
