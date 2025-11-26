/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useRef } from 'react';
import TabSelector from '@/features/trip/[tripId]/snap/_components/TabSelector';
import UploadButton from '@/features/trip/[tripId]/snap/_components/UploadButton';
import TripHeader from '../../../../shared/components/TripHeader';
import TripInfo from '../budget/_components/TripInfo';
import BaseTabView from '@/features/trip/[tripId]/snap/_components/tabView/BaseTabView';
import FolderTabView from '@/features/trip/[tripId]/snap/_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/trip/[tripId]/snap/type';
import FloatingModal from '@/shared/components/modal/FloatingModal';
import { uploadImage, getPhotos, getReadiness } from '@/features/trip/[tripId]/snap/api/snap-api';
import { Folder } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { getTripBudgetData } from '../budget/api/budget-api';
import Loading from '@/shared/components/loading/Loading';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FaceEnrollmentSection } from './_components/face-test/FaceEnrollmentSection';
import { getDayCount } from '@/shared/utils/parseDate';

type SnapPageProps = {
  tripId: string;
};

export default function SnapPage({ tripId }: SnapPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);

  const [selectedSort, setSelectedSort] = useState<'date_desc' | 'date_asc'>('date_desc');

  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);

  /** ======================================
   * 🔥 trip 기본 정보
   * ====================================== */
  const { data: tripData, isLoading: tripLoading } = useQuery({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 5,
  });

  /** ======================================
   * 🔥 readiness (얼굴 등록 여부)
   * ====================================== */
  const {
    data: readiness,
    isLoading: readinessLoading,
    isError: readinessError,
  } = useQuery({
    queryKey: ['readiness', tripId],
    queryFn: () => getReadiness(Number(tripId)),
    staleTime: 1000 * 60 * 5,
  });

  /** ======================================
   * 🔥 Folder 목록 (readiness 기반)
   * ====================================== */
  const folders: Folder[] =
    readiness?.members.map((m) => ({
      name: m.name,
      id: m.userId,
    })) ?? [];

  /** ======================================
   * 🔥 photos: Infinite Query 기반
   * ====================================== */
  const sortKey = selectedSort;

  const {
    data: photoData,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchPhotos,
    status: photoStatus,
  } = useInfiniteQuery({
    queryKey: ['photos', tripId, sortKey],
    queryFn: ({ pageParam = 0 }) =>
      getPhotos(Number(tripId), pageParam, sortKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.last ? undefined : allPages.length,
    staleTime: 1000 * 30,
    enabled: !!readiness?.allMembersRegistered, // 얼굴 등록되면 사진 불러오기
  });

  const photos = photoData?.pages.flatMap((p) => p?.photos ?? []) ?? [];

  /** ======================================
   * 📸 업로드 → 자동 invalidate
   * ====================================== */
  const imageSubmit = async (file: File) => {
    setUploading(true);
    await uploadImage(Number(tripId), file);
    setUploading(false);

    // 최신 정렬 상태 기준으로 photos 쿼리 invalidate
    queryClient.invalidateQueries({
      queryKey: ['photos', tripId, sortKey],
    });

    // 상단으로 스크롤
    scrollToTop?.();
  };

  /** ======================================
   * 로딩 처리
   * ====================================== */
  if (tripLoading || readinessLoading || uploading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!tripData || !readiness) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 실패</p>
      </div>
    );
  }

  if (readinessError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">얼굴 등록 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const dayCount = getDayCount(tripData.startDate ?? '', tripData.endDate ?? '');
  const members = readiness.members.map((m) => m.name);

  /** ======================================
   * 렌더링
   * ====================================== */
  return (
    <div className="flex flex-col h-screen bg-light_grey">
      <div className="bg-white">
        <TripHeader tripId={tripId} />

        {isScrolled ? (
          <div className="px-5">
            <span className="text-label-1">{tripData.tripName}</span>
          </div>
        ) : (
          <TripInfo
            tripName={tripData.tripName}
            countries={tripData.countries}
            startDate={tripData.startDate ?? ''}
            endDate={tripData.endDate ?? ''}
            memberProfileImages={tripData.memberProfileImages}
          />
        )}
      </div>

      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {!readiness.allMembersRegistered ? (
        <FaceEnrollmentSection members={readiness.members} />
      ) : activeTab === '전체' ? (
        <BaseTabView
          setIsScrolled={setIsScrolled}
          setScrollToTop={setScrollToTop}
          photos={photos}
          onLoadMore={fetchNextPage}
          isLoading={isFetchingNextPage}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          onRefresh={() => refetchPhotos()}
          dayCount={dayCount}
          members={members}
        />
      ) : (
        <FolderTabView folders={folders} selectedSort={selectedSort}/>
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
          if (file) {
            try {
              imageSubmit(file);
              queryClient.invalidateQueries({ queryKey: ['photos', tripId, sortKey] });
            } catch (error) {
              console.error('이미지 업로드 실패:', error);
              alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
            }
          }
        }}
      />
    </div>
  );
}
