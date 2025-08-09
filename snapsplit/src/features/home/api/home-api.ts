import privateInstance from '@/lib/api/instance/privateInstance';
import { GetHomeResponseDto } from '../type/home-type';
import { apiPath } from '@/shared/constants/apipath';

export const getHomeData = async (): Promise<GetHomeResponseDto> => {
  const res = await privateInstance.get<GetHomeResponseDto>(apiPath.home);
  return res.data;
};
