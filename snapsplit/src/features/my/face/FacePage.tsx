'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyFaceData } from './api/face-api';
import FaceHeader from './_components/FaceHeader';
import TipInfoBox from './_components/TipInfoBox';
import FaceImageCircle from './_components/FaceImageCircle';

export default function BeforeRegistration() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['face'],
    queryFn: () => getMyFaceData(),
  });

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  if (isLoading) {
    return <div>로딩중..</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div className="flex flex-col bg-white min-h-[100dvh] px-5">
      <FaceHeader />
      <div className="flex flex-col items-center text-center space-y-4 pt-12">
        <FaceImageCircle registered={data?.registered} faceImageUrl={data?.faceImageUrl} />
        <button className="w-full px-4 py-3 mt-5 font-bold text-white bg-primary rounded-lg cursor-pointer">
          나의 얼굴 등록하기
        </button>
        <TipInfoBox />
      </div>
    </div>
  );
}
