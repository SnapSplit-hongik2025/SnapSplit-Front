import Image from "next/image";
import { useMemberPhotos } from '../../store/snapStore';

interface FolderThumbnailPreviewProps {
  memberId: string;
}

export default function FolderThumbnailPreview({ memberId }: FolderThumbnailPreviewProps) {
  // Zustand 스토어에서 해당 멤버의 사진 가져오기 (최대 4장)
  const memberPhotos = useMemberPhotos(memberId);
  
  // 부족한 사진 수만큼 빈 슬롯 추가
  const emptySlots = Math.max(0, 4 - memberPhotos.length);
  
  return (
    <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3">
      {/* 멤버의 사진 표시 */}
      {memberPhotos.map((photo, idx) => (
        <div key={`${memberId}-${photo.photoId || idx}`} className="relative aspect-square rounded-md overflow-hidden">
          <Image
            src={photo.photoUrl}
            alt={`Photo ${idx + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
      
      {/* 부족한 사진 수만큼 빈 슬롯 표시 */}
      {Array.from({ length: emptySlots }).map((_, idx) => (
        <div 
          key={`empty-${memberId}-${idx}`} 
          className="bg-grey-50 rounded-md aspect-square overflow-hidden flex items-center justify-center"
        >
          <div className="text-grey-300">
            <Image 
              src="/svg/photo-loading.svg"
              alt="Empty photo"
              width={100}
              height={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
  