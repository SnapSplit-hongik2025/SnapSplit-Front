import privateInstance from '@/lib/api/instance/privateInstance';
import { GetTripDataDto } from '../types/snap-dto-types';
import { ApiEnvelope } from '@/lib/api/type';
import { apiPath } from '@/shared/constants/apipath';
import { UploadImageDto, GetPhotosDto } from '../types/snap-dto-types';

export const getTripData = async (tripId: number): Promise<GetTripDataDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  try {
    const finalPath = apiPath.budget.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetTripDataDto>>(finalPath);
    console.log(`[API] Fetched trip data for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip data for tripId ${tripId}:`, error);
    throw new Error('여행 정보를 불러오는 데 실패했습니다.');
  }
};

export const uploadImage = async (tripId: number, file: File) => {
  const finalPath = apiPath.snap.replace('{tripId}', String(tripId)) + '/photos';
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
  const finalPath = apiPath.snap.replace('{tripId}', String(tripId)) + '/photos';
  try {
    const res = await privateInstance.delete<ApiEnvelope<null>>(finalPath, { data: { photoIds } });
    console.log(`[API] Deleted images for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to delete images for tripId ${tripId}:`, error);
    throw new Error('이미지를 삭제하는 데 실패했습니다.');
  }
}

export const getPhotos = async (tripId: number) => {
  const finalPath = apiPath.snap.replace('{tripId}', String(tripId)) + '/photos';
  try {
    const res = await privateInstance.get<ApiEnvelope<GetPhotosDto>>(finalPath);
    console.log(`[API] Fetched photos for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get photos for tripId ${tripId}:`, error);
    throw new Error('이미지를 불러오는 데 실패했습니다.');
  }
}
  