'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import SelectDateSection from '@/shared/components/steps/Step2_SelectDate';
import { EditDatePageProps, GetTripDateDto } from './type';
import { editTripDates, getTripDates } from '../api/edit-trip-api';
import Loading from '@/shared/components/loading/Loading';

// 뮤테이션 페이로드 타입
interface EditDatePayload {
  startDate: string;
  endDate: string;
}

export default function EditDatePage({ tripId }: EditDatePageProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const { mutate } = useMutation({
    mutationFn: (payload: EditDatePayload) => editTripDates(tripId, payload.startDate, payload.endDate),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tripDate', tripId] });
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.refetchQueries({ queryKey: ['homeData'] });
      queryClient.refetchQueries({ queryKey: ['pastTrips'] });

      router.push(`/trip/${tripId}/budget`);
    },
    onError: (err) => {
      console.error('날짜 수정 실패:', err);
      alert(`날짜 수정에 실패했습니다: ${err.message}`);
    },
  });

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

  const handleNext = () => {
    if (startDate && endDate) {
      const startDateString = format(startDate, 'yyyy-MM-dd');
      const endDateString = format(endDate, 'yyyy-MM-dd');

      mutate({
        startDate: startDateString,
        endDate: endDateString,
      });
    } else {
      alert('시작일과 종료일을 모두 선택해주세요.');
    }
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
