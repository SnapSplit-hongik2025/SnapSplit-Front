'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TabSelector from '@/features/trip/[tripId]/snap/_components/TabSelector';
import UploadButton from '@/features/trip/[tripId]/snap/_components/UploadButton';
import TripHeader from '../../../../shared/components/TripHeader';
import TripInfo from '../budget/_components/TripInfo';
import BaseTabView from '@/features/trip/[tripId]/snap/_components/tabView/BaseTabView';
import FolderTabView from '@/features/trip/[tripId]/snap/_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/trip/[tripId]/snap/type';
import FloatingModal from '@/shared/components/modal/FloatingModal';
import { uploadImage, getPhotos, getReadiness } from '@/features/trip/[tripId]/snap/api/snap-api';
import { GetPhotosDto, Folder } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { getTripBudgetData } from '../budget/api/budget-api';
import { useSnapStore } from './store/snapStore';
import Loading from '@/shared/components/loading/Loading';
import { useQuery } from '@tanstack/react-query';

type SnapPageProps = {
  tripId: string;
};

export default function SnapPage({ tripId }: SnapPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);

  const [selectedSort, setSelectedSort] = useState('최신순');

  // trip info
  const { data: tripData, isError: tripError } = useQuery({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 2,
  });

  const [folders, setFolders] = useState<Folder[]>([]);

  // photos
  const { setAllPhotos } = useSnapStore();
  const [photos, setPhotos] = useState<GetPhotosDto['photos']>([]);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  // pagination
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 중복 요청 방지 flag
  const isFetchingRef = useRef(false);

  const { data: readiness, isLoading: readinessLoading, isError: isReadinessError, error: readinessError } = useQuery({
    queryKey: ['readiness', tripId],
    queryFn: () => getReadiness(Number(tripId)),
    staleTime: 1000 * 60 * 2,
  });

  /** ======================================
   * 🔥 사진 목록 불러오기 (안전한 비동기 실행)
   * ====================================== */
  const fetchPhotos = useCallback(
    async (pageToLoad: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const sort = selectedSort === '최신순' ? 'date_desc' : 'date_asc';
        const res = await getPhotos(Number(tripId), pageToLoad, sort);

        setPhotos((prev) => {
          const newPhotos = pageToLoad === 0 ? res.photos : [...prev, ...res.photos];
          // setAllPhotos(newPhotos); // 🚨 <--- 여기서 삭제!
          return newPhotos;
        });

        setPage(pageToLoad);
        setHasNext(!res.last);
      } catch (err) {
        setPhotosError(err as Error);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [tripId, selectedSort] // 🚨 <--- 의존성 배열에서 'setAllPhotos' 삭제!
  );

  useEffect(() => {
    if (!readiness) return;

    let mounted = true;

    const loadInitial = async () => {
      // 렌더링 이후로 실행을 microtask로 밀어낸다
      await Promise.resolve();

      if (!mounted) return;

      try {
        if (!mounted) return;

        // allMembersRegistered가 false이면 face-test 페이지로 리다이렉트
        if (!readiness?.allMembersRegistered) {
          router.push(`/trip/${tripId}/snap/face-test`);
          return;
        }

        const memberFolders = readiness.members
          .filter((m) => m.hasFaceData)
          .map((m) => ({ id: m.userId, name: m.name }));

        setFolders(memberFolders);
      } catch (err) {
        console.error(err);
      }
    };

    loadInitial();

    return () => {
      mounted = false;
    };
  }, [tripId, readiness]);

  /** ======================================
   * 🔄 정렬 변경 시 → 전체 리셋 + 첫 페이지 로딩
   * ====================================== */
  useEffect(() => {
    let mounted = true;

    const reload = async () => {
      await Promise.resolve();

      if (!mounted) return;

      setPhotos([]);
      setPage(0);
      await fetchPhotos(0);
    };

    // 'data'가 로드된 이후에만 사진 로딩 실행
    if (tripData) reload();

    return () => {
      mounted = false;
    };
  }, [selectedSort, tripData, fetchPhotos]);

  /** ======================================
   * ✨ (새로 추가) 로컬 state -> 전역 store 동기화
   * ====================================== */
  useEffect(() => {
    // 'photos' state가 변경될 때마다 Zustand 스토어를 업데이트
    setAllPhotos(photos);
  }, [photos, setAllPhotos]);

  /** ===========================
   * 📥 추가 페이지 요청
   * =========================== */
  const handleLoadMore = () => {
    if (!loading && hasNext && !isFetchingRef.current) {
      fetchPhotos(page + 1);
    }
  };

  /** ===========================
   * 📸 이미지 업로드 → 전체 리프레시
   * =========================== */
  const imageSubmit = async (file: File) => {
    try {
      await uploadImage(Number(tripId), file);
      setPhotos([]);
      setPage(0);
      await fetchPhotos(0);
    } catch (e) {
      console.error(e);
    }
  };

  if (tripError || photosError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  };

  if (isReadinessError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {readinessError?.message ?? ''}</p>
      </div>
    );
  }

  if (readinessLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!tripData || !readiness){
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  };

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
          />
        )}
      </div>

      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === '전체' ? (
        <BaseTabView
          setIsScrolled={setIsScrolled}
          setScrollToTop={setScrollToTop}
          photos={photos}
          onLoadMore={handleLoadMore}
          isLoading={loading}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          onRefresh={() => fetchPhotos(0)}
        />
      ) : (
        <FolderTabView folders={folders} />
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
          if (file) imageSubmit(file);
        }}
      />
    </div>
  );
}