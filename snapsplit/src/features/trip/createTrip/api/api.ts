import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetCountryTripDto } from '../types/type';

export const getHomeData = async (): Promise<GetCountryTripDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetCountryTripDto>>(apiPath.countries);
  return res.data.data;
};
