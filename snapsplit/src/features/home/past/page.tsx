'use client';

import { useEffect, useState } from 'react';
import PastTripHeader from './_components/PastTripHeader';
import PastTripList from './_components/PastTripList';
import PastTripSummary from './_components/PastTripSummary';
import { GetPastTripResponseDto } from './types/past-dto-type';
import { getPastTripData } from './api/past-api';

export default function PastTripPage() {
  const [pastTripData, setPastTripData] = useState<GetPastTripResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await getPastTripData();
        // 상태 업데이트 전, 컴포넌트가 여전히 마운트 상태인지 확인
        if (mounted) {
          setPastTripData(data);
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

  if (loading) return <div>로딩중...</div>;
  if (!pastTripData) return <div>데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="flex flex-col px-5 pb-6 min-h-[100dvh] bg-light_grey overflow-auto">
      <PastTripHeader />
      <PastTripSummary totalTrips={pastTripData.totalTrips} totalCountries={pastTripData.totalCountries} />
      <PastTripList trips={pastTripData.trips} />
    </div>
  );
}
