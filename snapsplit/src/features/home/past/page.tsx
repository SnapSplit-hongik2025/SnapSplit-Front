'use client';

import PastTripHeader from './_components/PastTripHeader';
import PastTripList from './_components/PastTripList';
import PastTripSummary from './_components/PastTripSummary';
import type { GetPastTripResponseDto } from './types/past-dto-type';
import { getPastTripData } from './api/past-api';
import Loading from '@/shared/components/loading/Loading';
import { useQuery } from '@tanstack/react-query';

export default function PastTripPage() {
  const {
    data: pastTripData,
    isLoading,
    isError,
    error,
  } = useQuery<GetPastTripResponseDto, Error>({
    queryKey: ['pastTrips'],
    queryFn: () => getPastTripData(),
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-light_grey">
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-light_grey">
        데이터 로드 중 오류: {error?.message ?? ''}
      </div>
    );

  if (!pastTripData)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-light_grey">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="flex flex-col px-5 pb-6 min-h-[100dvh] bg-light_grey overflow-auto">
      <PastTripHeader />
      <PastTripSummary totalTrips={pastTripData.totalTrips} totalCountries={pastTripData.totalCountries} />
      <PastTripList trips={pastTripData.trips} />
    </div>
  );
}
