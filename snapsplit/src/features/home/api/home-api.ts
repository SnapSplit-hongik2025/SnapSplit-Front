import privateInstance from '@/lib/api/instance/privateInstance';
import { GetHomeResponseDto } from '../types/home-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export const getHomeData = async (): Promise<GetHomeResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetHomeResponseDto>>(apiPath.home);
  return res.data.data;
};
