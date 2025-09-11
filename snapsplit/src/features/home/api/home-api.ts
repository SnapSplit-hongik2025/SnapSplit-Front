import privateInstance from '@/lib/api/instance/privateInstance';
import { GetHomeResponseDto } from '../types/home-type';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

// 홈 데이터 조회
export const getHomeData = async (): Promise<GetHomeResponseDto> => {
  const res = await privateInstance.get<ApiEnvelope<GetHomeResponseDto>>(apiPath.home);
  return res.data.data;
};

// 코드로 여행 참가
export const joinTripByCode = async (code: string): Promise<void> => {
  try {
    const res = await privateInstance.post<ApiEnvelope<null>>(apiPath.joinTrip, { code });

    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    // 성공 시에는 아무것도 반환하지 않음
    return;
  } catch (error) {
    // 여기서 잡히는 에러는 위에서 수동으로 던진 에러, 또는 진짜 네트워크/서버 에러입니다.
    // 이전의 status 분기 로직이 여전히 유효할 수 있지만, 지금 설계에서는 아래가 더 간단합니다.
    if (error instanceof Error) {
      throw error; // 메시지가 담긴 에러를 그대로 다시 던져서 컴포넌트에서 잡도록 함
    }

    // axios 에러 등 다른 타입의 에러 처리
    throw new Error('여행 참여 중 알 수 없는 오류가 발생했습니다.');
  }
};
