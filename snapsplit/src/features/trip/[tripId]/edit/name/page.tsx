'use client';

import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { EditNamePageProps, GetCountryInfoDto } from './type';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { editTripInfo, getTripInfo } from '../api/edit-trip-api';
import { useRouter } from 'next/navigation';

const EditNamePage = ({ tripId }: EditNamePageProps) => {
  const router = useRouter();

  const [tripName, setTripName] = useState<string>('');
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [tripImageFile, setTripImageFile] = useState<File | null>(null);

  const { data, isLoading, isError, error } = useQuery<GetCountryInfoDto, Error>({
    queryKey: ['tripInfo', tripId],
    queryFn: () => getTripInfo(tripId),
    enabled: !!tripId,
  });

  const beforeTripName = data?.tripName;

  useEffect(() => {
    if (data) {
      setTripName(data.tripName);
      setTripImageUrl(data.tripImage);
      setTripImageFile(null);
    }
  }, [data]);

  if (isLoading) {
    return <div>날짜 정보를 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const handleNext = async () => {
    if (!tripName) {
      alert('여행 이름을 입력해주세요.');
      return;
    }

    if (tripName) {
      if (tripName == beforeTripName) {
        await editTripInfo(tripId, null, tripImageFile);
      } else if (tripName != beforeTripName) {
        await editTripInfo(tripId, tripName, tripImageFile);
      }
      router.push(`/trip/${tripId}/budget`);
    }
  };

  return (
    <InputTripNameSection
      tripName={tripName}
      tripImageUrl={tripImageUrl}
      onClick={handleNext}
      variant="edit"
      setTripName={setTripName}
      setTripImageUrl={setTripImageUrl}
      setTripImageFile={setTripImageFile}
    />
  );
};

export default EditNamePage;
