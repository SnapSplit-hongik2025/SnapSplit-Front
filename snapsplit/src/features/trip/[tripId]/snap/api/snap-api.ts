import privateInstance from '@/lib/api/instance/privateInstance';
import { GetTripDataDto } from '../types/snap-dto-types';
import { ApiEnvelope } from '@/lib/api/type';
import { apiPath } from '@/shared/constants/apipath';

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
