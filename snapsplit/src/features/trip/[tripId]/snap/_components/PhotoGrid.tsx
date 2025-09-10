import Image from 'next/image';
import { UploadedImage } from '../type';

type PhotoGridProps = {
  images: UploadedImage[];
  isSelectionMode?: boolean;
  selectedImageIds?: string[];
  onToggleSelect?: (idx: string) => void;
};

export default function PhotoGrid({ images, isSelectionMode, selectedImageIds, onToggleSelect }: PhotoGridProps) {
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
    </div>
  );
}
