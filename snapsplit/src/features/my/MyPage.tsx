'use client';

import ActionBar from '@/features/my/_components/ActionBar';
import ProfileSection from '@/features/my/_components/ProfileSection';
import MenuSection from '@/features/my/_components/MenuSection';
import { getMyData } from './api/my-api';
import { GetMyResponseDto } from './types/my-type';
import { useEffect, useState } from 'react';
import Loading from '@/shared/components/loading/Loading';

export default function MyPage() {
  const [myData, setMyData] = useState<GetMyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await getMyData();
        // 상태 업데이트 전, 컴포넌트가 여전히 마운트 상태인지 확인
        if (mounted) {
          setMyData(data);
          console.log('마이 데이터:', data);
        }
      } catch (e) {
        if (mounted) {
          console.log('마이 데이터 로딩 실패:', e);
        }
      } finally {
        // 로딩 상태 업데이트 전에도 마운트 상태 확인
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!myData) return <div>데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="flex flex-col items-center h-screen">
      <ActionBar />
      <ProfileSection name={myData.name} profileImage={myData.profileImageUrl} userCode={myData.userCode} />
      <MenuSection />
    </div>
  );
}
