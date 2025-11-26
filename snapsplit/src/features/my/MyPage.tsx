'use client';

import { useQuery } from '@tanstack/react-query';
import ActionBar from '@/features/my/_components/ActionBar';
import ProfileSection from '@/features/my/_components/ProfileSection';
import MenuSection from '@/features/my/_components/MenuSection';
import { getMyData } from './api/my-api';
import Loading from '@/shared/components/loading/Loading';

export default function MyPage() {
  const {
    data: myData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['myData'],
    queryFn: getMyData,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !myData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-grey-500">
        <p>데이터를 불러오지 못했습니다.</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <ActionBar />
      <ProfileSection name={myData.name} profileImage={myData.profileImageUrl} userCode={myData.userCode} />
      <MenuSection />
    </div>
  );
}
