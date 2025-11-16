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
import { useQuery } from '@tanstack/react-query';
import { GetTripBudgetDto } from '../../budget/types/budget-dto-type';
import { getTripBudgetData } from '../../budget/api/budget-api';
import { getReadiness } from '../api/snap-api';
import Loading from '@/shared/components/loading/Loading';

type SnapPageProps = {
  tripId: string;
};

// SNAP 페이지에서 추가로 필요한 멤버 데이터 타입
export type MemberData = {
  userId: number;
  name: string;
  profileImageUrl: string;
  hasFaceData: boolean;
  currentUser: boolean;
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
            <EnrollmentMemberItem key={m.userId} member={m} />
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);
  const { data: tripInfo, isLoading: isTripLoading, isError: isTripError, error: tripError } = useQuery<GetTripBudgetDto, Error>({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 2, //
  });

  const { data: readiness, isLoading: isReadinessLoading, isError: isReadinessError, error: readinessError } = useQuery({
    queryKey: ['readiness', tripId],
    queryFn: () => getReadiness(Number(tripId)),
    staleTime: 1000 * 60 * 2, //
  });

  if (isTripLoading || isReadinessLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isTripError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {tripError?.message ?? ''}</p>
      </div>
    );
  }

  if (isReadinessError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {readinessError?.message ?? ''}</p>
      </div>
    );
  }

  if (!tripInfo || !readiness) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

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
            countries={tripInfo.countries}
            startDate={tripInfo.startDate}
            endDate={tripInfo.endDate}
          />
        )}
      </div>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {!readiness.allMembersRegistered ? (
        // 추가한 코드
        <FaceEnrollmentSection
          members={readiness.members}
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
