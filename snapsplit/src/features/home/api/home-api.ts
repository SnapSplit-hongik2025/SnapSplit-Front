import privateInstance from '@/lib/api/instance/privateInstance';
import { GetHomeResponseDto } from '../types/home-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import axios from 'axios';

// 홈 데이터 조회
export const getHomeData = async (): Promise<GetHomeResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetHomeResponseDto>>(apiPath.home);
  return res.data.data;
};

// 코드로 여행 참가
export const joinTripByCode = async (code: string): Promise<void> => {
  try {
    await privateInstance.post<ApiEnvelope<null>>(apiPath.joinTrip, { code });
    alert('여행에 성공적으로 참여했습니다!');
    return;
  } catch (error) {
    // 4xx, 5xx 에러는 모두 여기서 처리합니다.
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log('서버 응답 데이터:', error.response.data);
      alert(error.response.data.message || '알 수 없는 서버 오류가 발생했습니다.');
      throw new Error(error.response.data.message || '알 수 없는 서버 오류가 발생했습니다.');
    }

    // if (error instanceof Error) {
    //   throw error; // 원래 에러를 그대로 던집니다.
    // }

    // throw new Error('여행 참여 중 알 수 없는 오류가 발생했습니다.');
  }
};
