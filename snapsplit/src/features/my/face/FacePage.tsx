'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyFaceData, postMyFace } from './api/face-api';
import FaceHeader from './_components/FaceHeader';
import TipInfoBox from './_components/TipInfoBox';
import FaceImageCircle from './_components/FaceImageCircle';
import Button from '@/shared/components/Button';

export default function BeforeRegistration() {
  const queryClient = useQueryClient(); // 쿼리 무효화를 위한 클라이언트
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['face'],
    queryFn: () => getMyFaceData(),
  });

  const { mutate: registerFace } = useMutation({
    mutationFn: postMyFace,
    onSuccess: () => {
      alert('얼굴이 성공적으로 등록되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['face'] });
    },
    onError: (err) => {
      alert(err.message || '얼굴 등록에 실패했습니다.');
    },
  });

  const handleRegisterClick = () => {
    registerFace();
  };

  if (isLoading) {
    return <div>로딩중..</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div className="flex flex-col bg-white min-h-[100dvh] px-5">
      <FaceHeader />
      <div className="flex flex-col items-center text-center space-y-6 pt-12">
        <FaceImageCircle registered={data?.registered} faceImageUrl={data?.faceImageUrl} />
        <Button label="나의 얼굴 등록하기" onClick={handleRegisterClick}></Button>
        <TipInfoBox />
      </div>
    </div>
  );
}
