'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SelectDateSection from '@/shared/components/steps/Step2_SelectDate';
import { EditDatePageProps, GetTripDateDto } from './type';
import { format, parseISO } from 'date-fns'; // 원하면 parseISO 사용 가능
import { useQuery } from '@tanstack/react-query';
import { editTripDates, getTripDates } from '../api/edit-trip-api';
import Loading from '@/shared/components/loading/Loading';

export default function EditDatePage({ tripId }: EditDatePageProps) {
  // Date 상태 관리
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<GetTripDateDto, Error>({
    queryKey: ['tripDate', tripId],
    queryFn: () => getTripDates(tripId),
    enabled: !!tripId,
  });

  useEffect(() => {
    if (data) {
      setStartDate(parseISO(data.startDate));
      setEndDate(parseISO(data.endDate));
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const handleNext = async () => {
    if (startDate && endDate) {
      const startDateString = format(startDate, 'yyyy-MM-dd');
      const endDateString = format(endDate, 'yyyy-MM-dd');
      const res = await editTripDates(tripId, startDateString, endDateString);
      console.log(res);
      router.push(`/trip/${tripId}/budget`);
    } else {
      alert('시작일과 종료일을 모두 선택해주세요.');
    }
    router.back();
  };

  return (
    <SelectDateSection
      variant="edit"
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      onClick={handleNext}
    />
  );
}
