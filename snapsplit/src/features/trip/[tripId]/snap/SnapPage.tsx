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
import { uploadImage, getPhotos, getReadiness } from './api/snap-api';
import { GetPhotosDto } from './types/snap-dto-types';
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

  const [photos, setPhotos] = useState<GetPhotosDto | null>(null);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  const imageSubmit = (file: File) => {
    uploadImage(Number(tripId), file)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTripBudgetData(Number(tripId))
        .then((res) => setData(res))
        .catch((e) => setTripError(e));
    };
    fetchData().catch((e) => setTripError(e));

    const fetchPhotos = async () => {
      const readiness = await getReadiness(Number(tripId));
      if (!readiness.allMembersRegistered) {
        alert('모든 멤버가 얼굴 정보를 등록해야 합니다.');
        // throw new Error('모든 멤버가 얼굴 정보를 등록해야 합니다.');
      }
      await getPhotos(Number(tripId))
        .then((res) => setPhotos(res))
        .catch((e) => setPhotosError(e));
    };
    fetchPhotos().catch((e) => setPhotosError(e));
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
        <BaseTabView setIsScrolled={setIsScrolled} setScrollToTop={setScrollToTop} photos={photos!} />
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
