'use client';
import { useState, useRef } from 'react';
import TabSelector from '@/features/trip/[tripId]/snap/_components/TabSelector';
import UploadButton from '@/features/trip/[tripId]/snap/_components/UploadButton';
import BaseTabView from '@/features/trip/[tripId]/snap/_components/tabView/BaseTabView';
import FolderTabView from '@/features/trip/[tripId]/snap/_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/trip/[tripId]/snap/type';
import FloatingModal from '@/shared/components/modal/FloatingModal';
import TripHeader from '@/shared/components/TripHeader';
import TripInfo from '../../budget/_components/TripInfo';

const tripInfo = {
  tripName: '스냅스플릿 연구팟',
  countries: [
    { countryId: 1, countryName: '런던' },
    { countryId: 2, countryName: '파리' },
    { countryId: 3, countryName: '취리히' },
  ],
  startDate: '2025.4.7',
  endDate: '4.12',
};

type SnapPageProps = {
  tripId: string;
};

export default function FaceTestPage({ tripId }: SnapPageProps) {
  const isAllMemberHasFace = false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);

  return (
    <div className="flex flex-col h-screen bg-light_grey">
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        {isScrolled && (
          <div className="px-5">
            <span className="text-label-1">{tripInfo.tripName}</span>
          </div>
        )}
        {!isScrolled && (
          <TripInfo
            tripName={tripInfo.tripName}
            countries={tripInfo.countries.map((c) => c.countryName)}
            startDate={tripInfo.startDate}
            endDate={tripInfo.endDate}
          />
        )}
      </div>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 컨텐츠 영역 */}
      {activeTab === '전체' ? (
        <BaseTabView setIsScrolled={setIsScrolled} setScrollToTop={setScrollToTop} />
      ) : (
        <FolderTabView />
      )}
      <FloatingModal>
        <UploadButton isScrolled={isScrolled} inputRef={fileInputRef} scrollToTop={scrollToTop} />
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

      {/* <div className="flex flex-col itesm-center justify-center">
        <span>모든 멤버가 등록해야</span>
        <span>SNAP 기능을 사용할 수 있어요!</span>
      </div> */}
    </div>
  );
}
