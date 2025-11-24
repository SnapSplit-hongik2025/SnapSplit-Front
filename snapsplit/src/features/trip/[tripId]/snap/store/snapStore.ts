import { create } from 'zustand';
import { PhotoResponse } from '../types/snap-dto-types';

interface SnapStore {
  // 전체 사진 데이터
  allPhotos: PhotoResponse[];

  // 멤버별 사진 캐싱
  memberPhotoMap: Record<string, PhotoResponse[]>;

  // 사진 전체 저장 + 멤버별 캐싱 업데이트
  setAllPhotos: (photos: PhotoResponse[]) => void;
}

export const useSnapStore = create<SnapStore>((set) => ({
  allPhotos: [],
  memberPhotoMap: {},

  setAllPhotos: (photos) => {
    const map: Record<string, PhotoResponse[]> = {};

    photos.forEach((photo) => {
      photo.taggedUsers?.forEach((u) => {
        const key = String(u.userId);
        if (!map[key]) map[key] = [];
        if (map[key].length < 4) map[key].push(photo);
      });
    });

    set({
      allPhotos: photos,
      memberPhotoMap: map
    });
  },
}));

// 멤버별 사진 가져오기 (최대 4장, stable reference)
export const useMemberPhotos = (memberId: string) => {
  return useSnapStore((state) => state.memberPhotoMap[memberId] ?? []);
};
