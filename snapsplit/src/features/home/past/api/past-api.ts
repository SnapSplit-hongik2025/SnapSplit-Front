import privateInstance from '@/lib/api/instance/privateInstance';
import { GetPastTripResponseDto } from '../types/past-type';
import { apiPath } from '@/shared/constants/apiPath';
import { ApiEnvelope } from '@/lib/api/type';

export const getPastTripData = async (signal?: AbortSignal): Promise<GetPastTripResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetPastTripResponseDto>>(apiPath.past, { signal });
  const { success, data, message, status } = res.data;
  if (!success || !data) {
    throw new Error(message || `Failed to fetch getPastTripData (status: ${status})`);
  }
  return data;
};