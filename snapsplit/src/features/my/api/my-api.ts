import privateInstance from '@/lib/api/instance/privateInstance';
import { GetMyResponseDto, UpdateMyRequestDto } from '../types/my-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export const getMyData = async (): Promise<GetMyResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetMyResponseDto>>(apiPath.MY_PAGE);
  return res.data.data;
};

export const logOut = async (): Promise<null> => {
  const res = await privateInstance.post<ApiEnvelope<null>>(apiPath.LOGOUT);
  return res.data.data;
};

export const updateMyData = async ({ name, profileImage, onProgress }: UpdateMyRequestDto): Promise<null> => {
  if (!name && !profileImage) {
    throw new Error('이름과 프로필 이미지 중 하나는 필수입니다.');
  }

  const form = new FormData();
  if (name) form.append('name', name);
  if (profileImage) form.append('profileImage', profileImage);

  const res = await privateInstance.put<ApiEnvelope<null>>(apiPath.MY_PAGE, form, {
    onUploadProgress: (e) => {
      if (!onProgress) return;
      const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
      onProgress(percent);
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data;
};