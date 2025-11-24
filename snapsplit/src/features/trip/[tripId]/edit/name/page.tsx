'use client';

import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { EditNamePageProps, GetCountryInfoDto } from './type';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { editTripInfo, getTripInfo } from '../api/edit-trip-api';
import { useRouter } from 'next/navigation';
import Loading from '@/shared/components/loading/Loading';

interface EditTripPayload {
  name: string | null;
  imageFile: File | null;
}

const EditNamePage = ({ tripId }: EditNamePageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tripName, setTripName] = useState<string>('');
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [tripImageFile, setTripImageFile] = useState<File | null>(null);

  const {
    data,
    isLoading: isLoadingTripInfo,
    isError,
    error,
  } = useQuery<GetCountryInfoDto, Error>({
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

  const { mutate } = useMutation({
    mutationFn: (payload: EditTripPayload) => editTripInfo(tripId, payload.name, payload.imageFile),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.refetchQueries({ queryKey: ['tripInfo', tripId] });
      queryClient.refetchQueries({ queryKey: ['homeData'] });
      queryClient.refetchQueries({ queryKey: ['pastTrips'] });

      router.push(`/trip/${tripId}/budget`);
    },
    onError: (err) => {
      console.error('여행 정보 수정 실패:', err);
      alert(`수정에 실패했습니다: ${err.message}`);
    },
  });

  if (isLoadingTripInfo) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const handleEdit = () => {
    if (!tripName) {
      alert('여행 이름을 입력해주세요.');
      return;
    }

    const nameToSend = tripName === beforeTripName ? null : tripName;

    mutate({
      name: nameToSend,
      imageFile: tripImageFile,
    });
  };

  return (
    <InputTripNameSection
      tripName={tripName}
      tripImageUrl={tripImageUrl}
      onClick={handleEdit}
      variant="edit"
      setTripName={setTripName}
      setTripImageUrl={setTripImageUrl}
      setTripImageFile={setTripImageFile}
    />
  );
};

export default EditNamePage;
