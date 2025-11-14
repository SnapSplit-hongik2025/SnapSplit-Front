'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import TabSelector from '@/features/trip/[tripId]/snap/_components/TabSelector';
import UploadButton from '@/features/trip/[tripId]/snap/_components/UploadButton';
import TripHeader from '../../../../shared/components/TripHeader';
import TripInfo from '../budget/_components/TripInfo';
import BaseTabView from '@/features/trip/[tripId]/snap/_components/tabView/BaseTabView';
import FolderTabView from '@/features/trip/[tripId]/snap/_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/trip/[tripId]/snap/type';
import FloatingModal from '@/shared/components/modal/FloatingModal';
import { uploadImage, getPhotos, getReadiness } from '@/features/trip/[tripId]/snap/api/snap-api';
import { GetPhotosDto } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { getTripBudgetData } from '../budget/api/budget-api';
import { GetTripBudgetDto } from '../budget/types/budget-dto-type';
import { Folder } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { useSnapStore } from './store/snapStore';
import Loading from '@/shared/components/loading/Loading';

type SnapPageProps = {
  tripId: string;
};

export default function SnapPage({ tripId }: SnapPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);

  const [selectedSort, setSelectedSort] = useState('최신순');

  // trip info
  const [data, setData] = useState<GetTripBudgetDto | null>(null);
  const [tripError, setTripError] = useState<Error | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);

  // photos
  const { setAllPhotos } = useSnapStore();
  const [photos, setPhotos] = useState<GetPhotosDto['photos']>([]);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  // pagination
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 중복 요청 방지
  const isFetchingRef = useRef(false);

  /** ===========================
   * 📷 사진 API 요청 (중복 방지)
   * =========================== */
  const fetchPhotos = useCallback(
    async (pageToLoad: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const sort = selectedSort === '최신순' ? 'date_desc' : 'date_asc';
        const res = await getPhotos(Number(tripId), pageToLoad, sort);

        setPhotos((prevPhotos) => {
          const newPhotos = pageToLoad === 0 ? res.photos : [...prevPhotos, ...res.photos];

          // Zustand 저장
          setAllPhotos(newPhotos);

          return newPhotos;
        });

        setPage(pageToLoad);
        setHasNext(!res.last);
      } catch (e) {
        setPhotosError(e as Error);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [tripId, selectedSort, setAllPhotos]
  );

  /** ===========================
   * 🔄 사진 목록 새로고침
   * =========================== */
  const handleRefresh = async () => {
    setPhotos([]);
    setPage(0);
    await fetchPhotos(0);
  };

  /** ===========================
   * 📸 이미지 업로드 → 전체 리프레시
   * =========================== */
  const imageSubmit = async (file: File) => {
    try {
      await uploadImage(Number(tripId), file);
      await handleRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  /** ===========================
   * 📄 readiness 체크 (최초 1번)
   * =========================== */
  useEffect(() => {
    const checkReadiness = async () => {
      try {
        const readiness = await getReadiness(Number(tripId));

        // Show alert if not all members are registered
        if (!readiness.allMembersRegistered) {
          alert('모든 멤버가 얼굴 정보를 등록해야 합니다.');
        }

        // Process members with face data into folders
        const memberFolders = readiness.members
          .filter((member) => member.hasFaceData)
          .map((member) => ({
            id: member.userId,
            name: member.name,
          }));

        setFolders([...memberFolders]);
      } catch (error) {
        console.error('Readiness check failed:', error);
      }
    };

    checkReadiness();
  }, [tripId]);

  /** ======================================
   * 📘 여행 기본 정보 + 첫 페이지 사진 로드
   * ====================================== */
  useEffect(() => {
    (async () => {
      try {
        const trip = await getTripBudgetData(Number(tripId));
        setData(trip);

        // 초기 fetch
        setPhotos([]);
        setPage(0);
        await fetchPhotos(0);
      } catch (e) {
        setTripError(e as Error);
      }
    })();
  }, [tripId]);

  /** ======================================
   * 🔄 정렬 변경 시 → 전체 리셋 + 첫 페이지 로딩
   * ====================================== */
  useEffect(() => {
    if (!data) return; // trip info가 아직 로드 안 됐으면 스킵

    setPhotos([]);
    setPage(0);

    fetchPhotos(0);
  }, [selectedSort]);

  /** ===========================
   * 📥 추가 페이지 요청
   * =========================== */
  const handleLoadMore = () => {
    if (!loading && hasNext && !isFetchingRef.current) {
      fetchPhotos(page + 1);
    }
  };

  if (tripError || photosError) {
    return <Loading />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-light_grey">
      {/* 헤더 */}
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        {isScrolled ? (
          <div className="px-5">
            <span className="text-label-1">{data.tripName}</span>
          </div>
        ) : (
          <TripInfo
            tripName={data.tripName}
            countries={data.countries}
            startDate={data.startDate ?? ''}
            endDate={data.endDate ?? ''}
          />
        )}
      </div>

      {/* 탭 선택 */}
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 컨텐츠 */}
      {activeTab === '전체' ? (
        <BaseTabView
          setIsScrolled={setIsScrolled}
          setScrollToTop={setScrollToTop}
          photos={photos}
          onLoadMore={handleLoadMore}
          isLoading={loading}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          onRefresh={handleRefresh}
        />
      ) : (
        <FolderTabView folders={folders} />
      )}

      {/* 플로팅 업로드 버튼 */}
      <FloatingModal>
        <UploadButton isScrolled={isScrolled} inputRef={fileInputRef} scrollToTop={scrollToTop} />
      </FloatingModal>

      {/* 파일 input */}
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
