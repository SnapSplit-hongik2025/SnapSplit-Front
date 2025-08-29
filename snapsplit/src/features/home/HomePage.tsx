'use client';

import { useEffect, useState } from 'react';
import HomeHeader from './_components/HomeHeader';
import CreateTripSection from './_components/CreateTripSection';
import PastTripImgCardList from './_components/PastTripImgCardList';
import AllPastTripList from './_components/AllPastTripList';
import { getHomeData } from './api/home-api';
import { GetHomeResponseDto } from './types/home-type';

export default function HomePage() {
  const [homeData, setHomeData] = useState<GetHomeResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const hasPastTrip = homeData?.pastTrips && homeData.pastTrips.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        setHomeData(data);
        console.log('홈 데이터:', data);
      } catch (e) {
        console.log('홈 데이터 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!homeData) return <div>데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="flex flex-col bg-grey-50 min-h-[100dvh] pb-6">
      <HomeHeader />
      <CreateTripSection upcomingTrips={homeData.upcomingTrips} ongoingTrips={homeData.ongoingTrips} />
      {hasPastTrip ? (
        <>
          <PastTripImgCardList />
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
