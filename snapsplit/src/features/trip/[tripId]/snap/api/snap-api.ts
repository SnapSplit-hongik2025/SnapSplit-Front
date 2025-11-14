import privateInstance from '@/lib/api/instance/privateInstance';
import { GetReadinessDto, GetTripDataDto } from '../types/snap-dto-types';
import { ApiEnvelope } from '@/lib/api/type';
import { apiPath } from '@/shared/constants/apipath';
import { UploadImageDto, GetPhotosDto } from '../types/snap-dto-types';

export const getTripData = async (tripId: number): Promise<GetTripDataDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  try {
    const finalPath = apiPath.BUDGET.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetTripDataDto>>(finalPath);
    console.log(`[API] Fetched trip data for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip data for tripId ${tripId}:`, error);
    throw new Error('여행 정보를 불러오는 데 실패했습니다.');
  }
};

export const uploadImage = async (tripId: number, file: File) => {
  const finalPath = apiPath.SNAP.replace('{tripId}', String(tripId)) + '/photos';
  const formData = new FormData();
  console.log("[UploadImage API] file ->", file);
  formData.append('images', file);
  try {
    const res = await privateInstance.post<ApiEnvelope<UploadImageDto>>(finalPath, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log(`[API] Uploaded images for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to upload images for tripId ${tripId}:`, error);
    throw new Error('이미지를 업로드하는 데 실패했습니다.');
  }
}

export const deleteImages = async (tripId: number, photoIds: number[]) => {
  const finalPath = apiPath.SNAP.replace('{tripId}', String(tripId)) + '/photos';
  try {
    const res = await privateInstance.delete<ApiEnvelope<null>>(finalPath, { data: { photoIds } });
    console.log(`[API] Deleted images for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to delete images for tripId ${tripId}:`, error);
    throw new Error('이미지를 삭제하는 데 실패했습니다.');
  }
}

export const getPhotosByFolder = async (tripId: number, memberId: string, page: number = 0, sort: string = 'date_desc') => {
  const finalPath = apiPath.SNAP.replace('{tripId}', String(tripId)) + '/folders/' + memberId + '?page=' + page + '&sort=' + sort;
  const res = await privateInstance.get<ApiEnvelope<GetPhotosDto>>(finalPath);
  return res.data.data;
};

export const getReadiness = async (tripId: number): Promise<GetReadinessDto> => {
  const finalPath = apiPath.SNAP.replace('{tripId}', String(tripId)) + '/readiness';
  try {
    const res = await privateInstance.get<ApiEnvelope<GetReadinessDto>>(finalPath);
    console.log(`[API] Fetched readiness for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get readiness for tripId ${tripId}:`, error);
    throw new Error('여행 멤버들의 준비 상태를 불러오는 데 실패했습니다.');
  }
}

export const getPhotos = async (tripId: number, page: number, sort: string) => {
  const finalPath = apiPath.SNAP.replace('{tripId}', String(tripId)) + '/photos' + `?page=${page}` + `&sort=${sort}`;
  try {
    const res = await privateInstance.get<ApiEnvelope<GetPhotosDto>>(finalPath);
    console.log(`[API] Fetched photos for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get photos for tripId ${tripId}:`, error);
    throw new Error('이미지를 불러오는 데 실패했습니다.');
  }
}
  