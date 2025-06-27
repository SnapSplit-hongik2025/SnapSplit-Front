'use client';
import { useState, useRef } from 'react';
import TabSelector from '@/features/trip/[tripId]/snap/_components/TabSelector';
import UploadButton from '@/features/trip/[tripId]/snap/_components/UploadButton';
import BottomNavBar from '@/shared/components/BottomNavBar';
import TripHeader from '../budget/_components/TripHeader';
import TripInfo from '../budget/_components/TripInfo';
import BaseTabView from '@/features/trip/[tripId]/snap/_components/tabView/BaseTabView';
import FolderTabView from '@/features/trip/[tripId]/snap/_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/trip/[tripId]/snap/type';
import FloatingModal from '@/shared/components/modal/FloatingModal';

export default function SnapPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 테스트 데이터
  const countries = [
    { countryId: 1, countryName: '런던' },
    { countryId: 2, countryName: '파리' },
    { countryId: 3, countryName: '취리히' },
  ];

  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-grey-350">
        <TripHeader />
        <TripInfo
          tripName={'유luv여행'}
          countries={countries}
          memberCount={4}
          startDate={'2025.4.7'}
          endDate={'4.12'}
        />
      </div>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 컨텐츠 영역 */}
      {activeTab === '전체' ? <BaseTabView /> : <FolderTabView />}
      <FloatingModal>
        <UploadButton inputRef={fileInputRef} />
      </FloatingModal>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) alert(`파일 선택됨: ${file.name}`);
        }}
      />

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
