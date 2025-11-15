'use client';

import Image from 'next/image';
import { GetPhotosDto } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { useState } from 'react';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';
import Modal from '@/shared/components/modal/Modal';
import PhotoDeleteModalContent from './photo-grid/PhotoDeleteModalContent';
import { deleteImages, downloadImage } from '@/features/trip/[tripId]/snap/api/snap-api';
import { useParams } from 'next/navigation';

type PhotoGridProps = {
  images: GetPhotosDto['photos'];
  isSelectionMode?: boolean;
  selectedImageIds?: string[];
  onToggleSelect?: (idx: string) => void;
  onRefresh?: () => void;
};

export default function PhotoGrid({
  images,
  isSelectionMode,
  selectedImageIds,
  onToggleSelect,
  onRefresh,
}: PhotoGridProps) {
  const tripId = useParams<{ tripId: string }>();
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 선택된 사진 정보
  const selectedPhoto = images.find((img) => img.photoId === Number(selectedImageId));
  const photoUrl = selectedPhoto?.photoUrl; // Url 이 없으면 로딩 이미지

  const handleDeleteImage = async () => {
    if (!selectedImageId || !tripId.tripId) {
      alert('유효하지 않은 이미지 ID입니다.');
      return;
    }
    try {
      await deleteImages(Number(tripId.tripId), [selectedImageId]);
      // 상위 컴포넌트의 refresh 함수 호출
      if (onRefresh) {
        await onRefresh();
      }
      // 모달 닫기
      setIsDeleteModalOpen(false);
      setIsPhotoModalOpen(false);
    } catch (error) {
      console.error('이미지 삭제 중 오류 발생:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImageId || !tripId.tripId) {
      alert('유효하지 않은 이미지 ID입니다.');
      return;
    }

    try {
      // 📌 Blob 받기
      const blob = await downloadImage(Number(tripId.tripId), selectedImageId);

      // 📌 Blob을 URL로 변환
      const url = window.URL.createObjectURL(blob);

      // 📌 다운로드 자동 트리거
      const a = document.createElement('a');
      a.href = url;
      a.download = 'photo.zip'; // 원하는 파일명
      document.body.appendChild(a);
      a.click();
      a.remove();

      // 메모리 해제
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      setIsPhotoModalOpen(false);
    } catch (error) {
      console.error('이미지 다운로드 중 오류 발생:', error);
      alert('이미지 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 pb-15">
      {images.map((image) => {
        const isSelected = isSelectionMode && selectedImageIds?.includes(image.photoId.toString());
        return (
          <div key={image.photoId} className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src={image.photoUrl}
              alt="uploaded"
              fill
              onClick={() => {
                if (isSelectionMode && onToggleSelect) {
                  onToggleSelect(image.photoId.toString());
                  setSelectedImageId(image.photoId);
                } else if (isSelectionMode === false || !isSelectionMode) {
                  setIsPhotoModalOpen(true);
                  setSelectedImageId(image.photoId);
                }
              }}
              className="object-cover"
            />
            {isSelected && (
              <div
                onClick={() => {
                  onToggleSelect?.(image.photoId.toString());
                }}
                className="absolute flex items-center justify-center top-0 left-0 w-full h-full rounded-xl bg-primary/10 border border-primary"
              >
                <Image src="/svg/check-green.svg" alt="check" width={32} height={32} className="object-contain" />
              </div>
            )}
          </div>
        );
      })}

      {isPhotoModalOpen && (
        <FullScreenModal>
          <div className="w-full h-full flex flex-col items-center bg-white">
            <div className="absolute top-0 flex items-center justify-between w-full h-12 px-4">
              <button onClick={() => setIsDeleteModalOpen(true)}>
                <Image src="/svg/trash-black.svg" alt="삭제" width={24} height={24} />
              </button>
              <button onClick={() => handleDownloadImage()}>
                <Image src="/svg/download.svg" alt="다운로드" width={24} height={24} />
              </button>
              <button onClick={() => setIsPhotoModalOpen(false)}>
                <Image src="/svg/exit-grey-1000.svg" alt="닫기" width={24} height={24} />
              </button>
            </div>
            <div className="w-full m-auto">
              {photoUrl ? (
                <Image src={photoUrl} alt="uploaded" width={1000} height={1000} className="object-contain" />
              ) : (
                <Image
                  src="/svg/photo-loading.svg"
                  alt="uploaded"
                  width={1000}
                  height={1000}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </FullScreenModal>
      )}

      {isDeleteModalOpen && (
        <Modal layer="toast">
          <PhotoDeleteModalContent onClose={() => setIsDeleteModalOpen(false)} onClickDelete={handleDeleteImage} />
        </Modal>
      )}
    </div>
  );
}
