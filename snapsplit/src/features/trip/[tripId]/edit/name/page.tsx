'use client';

import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { EditNamePageProps, GetCountryInfoDto } from './type';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTripInfo } from '../api/edit-trip-api';
import { useRouter } from 'next/navigation';

const EditNamePage = ({ tripId }: EditNamePageProps) => {
  const router = useRouter();

  const [tripName, setTripName] = useState<string>('');
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [tripImageFile, setTripImageFile] = useState<File | null>(null);
  console.log(tripImageFile);

  const { data, isLoading, isError, error } = useQuery<GetCountryInfoDto, Error>({
    queryKey: ['tripInfo', tripId],
    queryFn: () => getTripInfo(tripId),
    enabled: !!tripId,
  });

  useEffect(() => {
    if (data) {
      setTripName(data.tripName);
      setTripImageUrl(data.tripImage);
      setTripImageFile(null); // 파일은 다시 선택해야 하므로 null로 초기화
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
      router.push(`/trip/${tripId}/budget`);
    } else {
      alert('시작일과 종료일을 모두 선택해주세요.');
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
