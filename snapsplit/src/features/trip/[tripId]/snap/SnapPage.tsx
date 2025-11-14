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

  const [data, setData] = useState<GetTripBudgetDto | null>(null);
  const [tripError, setTripError] = useState<Error | null>(null);

  const [photos, setPhotos] = useState<GetPhotosDto['photos']>([]);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  // paging states
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const imageSubmit = (file: File) => {
    uploadImage(Number(tripId), file)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
    fetchPhotos(page).catch((e) => setPhotosError(e));
  };

  const fetchPhotos = async (pageToLoad: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const readiness = await getReadiness(Number(tripId));
      if (!readiness.allMembersRegistered) {
        alert('모든 멤버가 얼굴 정보를 등록해야 합니다.');
        // return;
      }

      const res = await getPhotos(Number(tripId), pageToLoad);
      // backend: GET /photos?tripId=1&page=pageToLoad

      setPhotos((prev) => [...prev, ...res.photos]);
      setPage(res.currentPage);
      setHasNext(!res.last);
    } catch (e) {
      setPhotosError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  // 추가 페이지 요청
  const handleLoadMore = () => {
    if (!loading && hasNext) {
      fetchPhotos(page + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTripBudgetData(Number(tripId))
        .then((res) => setData(res))
        .catch((e) => setTripError(e));
    };
    fetchData().catch((e) => setTripError(e));
    fetchPhotos(page).catch((e) => setPhotosError(e));
  }, [tripId]);

  if (tripError || photosError) return null;
  if (!data) return null;

  return (
    <div className="flex flex-col h-screen bg-light_grey">
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        {isScrolled && (
          <div className="px-5">
            <span className="text-label-1">{data.tripName}</span>
          </div>
        )}
        {!isScrolled && (
          <TripInfo
            tripName={data.tripName}
            countries={data.countries}
            startDate={data.startDate ?? ''}
            endDate={data.endDate ?? ''}
          />
        )}
      </div>
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
