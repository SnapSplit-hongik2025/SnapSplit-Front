'use client';
import { useState, useRef, useEffect } from 'react';
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

type SnapPageProps = {
  tripId: string;
};

export default function SnapPage({ tripId }: SnapPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);

  // trip info
  const [data, setData] = useState<GetTripBudgetDto | null>(null);
  const [tripError, setTripError] = useState<Error | null>(null);

  // photo list
  const [photos, setPhotos] = useState<GetPhotosDto['photos']>([]);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  // paging state
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false); // ✅ 중복 요청 방지 ref

  /** 📸 이미지 업로드 */
  const imageSubmit = async (file: File) => {
    try {
      await uploadImage(Number(tripId), file);
      // 업로드 후 첫 페이지부터 다시 불러오기
      setPhotos([]);
      setPage(0);
      fetchPhotos(0);
    } catch (e) {
      console.error(e);
    }
  };

  /** 📷 사진 목록 요청 (페이지네이션) */
  const fetchPhotos = async (pageToLoad: number) => {
    // ✅ 중복 요청 방지
    if (isFetchingRef.current || loading) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await getPhotos(Number(tripId), pageToLoad);
      setPhotos((prev) => [...prev, ...res.photos]);
      setPage(pageToLoad);
      setHasNext(!res.last);
    } catch (e) {
      setPhotosError(e as Error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  /** 📄 readiness(멤버 등록 여부) 확인 — 최초 한 번만 */
  useEffect(() => {
    (async () => {
      try {
        const readiness = await getReadiness(Number(tripId));
        if (!readiness.allMembersRegistered) {
          alert('모든 멤버가 얼굴 정보를 등록해야 합니다.');
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [tripId]);

  /** 📘 여행 기본 정보 & 첫 페이지 사진 불러오기 */
  useEffect(() => {
    (async () => {
      try {
        const res = await getTripBudgetData(Number(tripId));
        setData(res);
        await fetchPhotos(0);
      } catch (e) {
        setTripError(e as Error);
      }
    })();
  }, [tripId]);

  /** 📥 추가 페이지 요청 */
  const handleLoadMore = () => {
    if (!loading && hasNext) {
      fetchPhotos(page + 1);
    }
  };

  if (tripError || photosError) return null;
  if (!data) return null;

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

      {/* 컨텐츠 영역 */}
      {activeTab === '전체' ? (
        <BaseTabView
          setIsScrolled={setIsScrolled}
          setScrollToTop={setScrollToTop}
          photos={photos}
          onLoadMore={handleLoadMore}
          isLoading={loading}
        />
      ) : (
        <FolderTabView />
      )}

      {/* 플로팅 업로드 버튼 */}
      <FloatingModal>
        <UploadButton
          isScrolled={isScrolled}
          inputRef={fileInputRef}
          scrollToTop={scrollToTop}
        />
      </FloatingModal>

      {/* 숨겨진 파일 input */}
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
