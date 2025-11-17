'use client';

import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getPhotos } from "../../api/snap-api";
import { useEffect } from "react";

interface FolderThumbnailPreviewProps {
  memberId: string;
  sortKey: string; // SnapPage에서 사용하는 `sortKey` 그대로 전달
}

export default function FolderThumbnailPreview({
  memberId,
  sortKey,
}: FolderThumbnailPreviewProps) {
  const params = useParams();
  const tripId = params.tripId as string;

  // useInfiniteQuery로 모든 페이지의 사진 가져오기
  const {
    data: photoData,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['photos', tripId, sortKey],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('🌐 [FolderThumbnailPreview] 페이지 요청 - page:', pageParam);
      const response = await getPhotos(Number(tripId), pageParam, sortKey);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!tripId && !!sortKey,
  });

  // 모든 페이지의 사진을 하나의 배열로 병합
  const allPhotos = photoData?.pages.flatMap(page => page.photos) ?? [];

  // 해당 멤버의 사진만 필터링
  const memberPhotos = allPhotos
    .filter(photo => 
      photo.taggedUsers?.some(u => String(u.userId) === memberId)
    )
    .slice(0, 4); // 최대 4개만 표시

  // 모든 페이지를 가져왔는지 확인하고, 아직 더 있으면 다음 페이지 가져오기
  useEffect(() => {
    if (!isLoading && hasNextPage && memberPhotos.length < 4) {
      console.log('⬇️ [FolderThumbnailPreview] 추가 사진이 필요하여 다음 페이지 로드');
      fetchNextPage();
    }
  }, [isLoading, hasNextPage, memberPhotos.length, fetchNextPage]);

  // 로딩 상태 처리
  if (isLoading || !photoData) {
    return (
      <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-md aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

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