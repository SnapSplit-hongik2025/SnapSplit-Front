'use client';

import Link from 'next/link';
import Image from 'next/image';
import arrow from '@public/svg/arrow-left-grey-850.svg';
import { useQuery } from '@tanstack/react-query';
import { getMyFaceData } from './api/face-api';

export default function BeforeRegistration() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['face'],
    queryFn: () => getMyFaceData(),
  });

  if (isLoading) {
    return <div>로딩중..</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div className="flex flex-col bg-white min-h-[100dvh] px-5">
      <header className="py-3 flex items-center justify-between">
        <Link href="/my">
          <Image src={arrow} alt="exit" aria-label="홈으로" />
        </Link>
        <h1 className="text-label-1">나의 얼굴</h1>
        <div className="w-[25px]"></div>
      </header>

      <div className="flex flex-col items-center text-center space-y-4 pt-12">
        <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full">
          {data?.registered && (
            <span>
              <Image width={32} height={32} src={data.faceImageUrl} alt="myFace" className="object-fit" />
            </span>
          )}
          {!data?.registered && <span className="text-2xl font-bold text-gray-400">?</span>}
        </div>
        <button className="w-full px-4 py-3 mt-5 font-bold text-white bg-primary rounded-lg cursor-pointer">
          나의 얼굴 등록하기
        </button>
        <div className="flex w-full flex-col gap-1 text-grey-550 p-4 bg-grey-50 rounded-lg border border-grey-350 items-start">
          <h3 className="font-semibold">나의 얼굴 tip</h3>
          <p className="text-body-2">얼굴을 가리지 않은 정면 사진으로 올려주세요.</p>
          <p className="text-body-2">기존에 태그된 사진들에는 적용되지 않아요.</p>
        </div>
      </div>
    </div>
  );
}
