import Image from "next/image";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { PhotoResponse } from "../../types/snap-dto-types";
import { useSearchParams } from "next/navigation";

interface FolderThumbnailPreviewProps {
  memberId: string;
  sortKey: string; // SnapPage에서 사용하는 `sortKey` 그대로 전달
}

interface PhotosPage {
  photos: PhotoResponse[];
  last: boolean;
}

export default function FolderThumbnailPreview({
  memberId,
  sortKey,
}: FolderThumbnailPreviewProps) {
  const params = useSearchParams();
  const tripId = params.get("tripId");
  const queryClient = useQueryClient();

  // react-query Infinite Query 캐시 읽기
  const photoData = queryClient.getQueryData<
    InfiniteData<PhotosPage>
  >(["photos", tripId, sortKey]);

  // 전체 photos (pages -> flatten)
  const photos =
    photoData?.pages.flatMap((page) => page.photos) ?? [];

  // 해당 멤버의 사진만 필터링
  const memberPhotos = photos
    .filter((photo) =>
      photo.taggedUsers?.some((u) => String(u.userId) === memberId)
    )
    .slice(0, 4);

  const emptySlots = Math.max(0, 4 - memberPhotos.length);

  return (
    <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3">
      {memberPhotos.map((photo, idx) => (
        <div
          key={`${memberId}-${photo.photoId}`}
          className="relative aspect-square rounded-md overflow-hidden"
        >
          <Image
            src={photo.photoUrl}
            alt={`Photo ${idx + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {Array.from({ length: emptySlots }).map((_, idx) => (
        <div
          key={`empty-${memberId}-${idx}`}
          className="bg-grey-50 rounded-md aspect-square overflow-hidden flex items-center justify-center"
        >
          <Image
            src="/svg/photo-loading.svg"
            alt="Empty photo"
            width={100}
            height={100}
          />
        </div>
      ))}
    </div>
  );
}
