'use client';

import Image from 'next/image';
import { UploadedImage } from '../type';
import { useState } from 'react';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';
import Modal from '@/shared/components/modal/Modal';
import PhotoDeleteModalContent from './photo-grid/PhotoDeleteModalContent';

type PhotoGridProps = {
  images: UploadedImage[];
  isSelectionMode?: boolean;
  selectedImageIds?: string[];
  onToggleSelect?: (idx: string) => void;
};

export default function PhotoGrid({ images, isSelectionMode, selectedImageIds, onToggleSelect }: PhotoGridProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <div className="grid grid-cols-3 gap-2 pb-15">
      {images.map((image) => {
        const isSelected = isSelectionMode && selectedImageIds?.includes(image.id);
        return (
          <div key={image.id} className="relative aspect-square rounded-xl">
            <Image
              src={image.src}
              alt="uploaded"
              width={100}
              height={100}
              onClick={() => {
                if (isSelectionMode && onToggleSelect) {
                  onToggleSelect(image.id);
                } else if (isSelectionMode === false || !isSelectionMode) {
                  setIsPhotoModalOpen(true);
                }
              }}
              className="object-cover rounded-xl"
            />
            {isSelected && (
              <div
                onClick={() => {
                  onToggleSelect?.(image.id);
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
              <button onClick={() => setIsPhotoModalOpen(false)}>
                <Image src="/svg/exit-grey-1000.svg" alt="닫기" width={24} height={24} />
              </button>
            </div>
            <div className="w-full m-auto">
              <Image src={images[3].src} alt="uploaded" width={1000} height={1000} className="object-contain" />
            </div>
          </div>
        </FullScreenModal>
      )}

      {isDeleteModalOpen && (
        <Modal layer="toast">
          <PhotoDeleteModalContent
            onClose={() => setIsDeleteModalOpen(false)}
            onClickDelete={() => setIsDeleteModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
