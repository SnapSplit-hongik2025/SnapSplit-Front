import privateInstance from '@/lib/api/instance/privateInstance';
import { GetMyResponseDto } from '../types/my-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export const getMyData = async (): Promise<GetMyResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetMyResponseDto>>(apiPath.myPage);
  return res.data.data;
};

export const logOut = async () => {
  const res = await privateInstance.post<ApiEnvelope<null>>(apiPath.logOut);
  return res.data.data;
};