import privateInstance from '@/lib/api/instance/privateInstance';
import { GetPastTripResponseDto } from '../types/past-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export const getPastTripData = async (): Promise<GetPastTripResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetPastTripResponseDto>>(apiPath.past);
  return res.data.data;
};
