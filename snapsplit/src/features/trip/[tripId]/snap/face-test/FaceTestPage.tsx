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
import { EnrollmentMemberItem } from './_components/EnrollmentMemberItem';

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

// SNAP 페이지에서 추가로 필요한 멤버 데이터 타입
export type MemberData = {
  memberId: number;
  name: string;
  profileImageUrl?: string;
  hasFaceData: boolean;
  isCurrentUser: boolean;
};

type FaceEnrollmentSectionProps = {
  members: MemberData[];
};

const FaceEnrollmentSection = ({ members }: FaceEnrollmentSectionProps) => {
  return (
    <div className="flex flex-col h-full w-full justify-center text-center p-10 pb-40">
      <span className="text-grey-450 text-label-1">전원 얼굴 등록 이후</span>
      <span className="text-grey-450 text-label-1 pb-10">SNAP 기능을 사용할 수 있어요!</span>
      <div className="relative">
        <div className="space-y-5 bg-white rounded-2xl p-5 max-h-72 overflow-y-auto scrollbar-hide">
          {members.map((m) => (
            <EnrollmentMemberItem key={m.memberId} member={m} />
          ))}
        </div>
        {/* 상/하 스크롤 힌트 그라데이션 */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent rounded-t-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent rounded-b-2xl" />
      </div>
    </div>
  );
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

      {!isAllMemberHasFace ? (
        // 추가한 코드
        <FaceEnrollmentSection
          members={[
            { memberId: 1, name: '김스냅', hasFaceData: false, isCurrentUser: true },
            { memberId: 2, name: '이스플릿', hasFaceData: true, isCurrentUser: false },
            { memberId: 3, name: '박연구', hasFaceData: true, isCurrentUser: false },
            { memberId: 4, name: '최테스트', hasFaceData: false, isCurrentUser: false },
            { memberId: 5, name: '홍길동', hasFaceData: false, isCurrentUser: false },
            { memberId: 6, name: '고길동', hasFaceData: true, isCurrentUser: false },
            { memberId: 7, name: '장길동', hasFaceData: false, isCurrentUser: false },
            { memberId: 8, name: '임꺽정', hasFaceData: true, isCurrentUser: false },
          ]}
        />
      ) : // 추가한 코드 끝
      activeTab === '전체' ? (
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
    </div>
  );
}
