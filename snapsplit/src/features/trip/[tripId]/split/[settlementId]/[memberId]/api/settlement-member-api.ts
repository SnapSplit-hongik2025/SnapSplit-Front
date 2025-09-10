import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetSettlementMemberDto } from '../types/settlement-member-dto-type';
import createAxiosInstance from '@/lib/api/instance/base';

export const getSettlementMemberData = async (
  tripId: string,
  settlementId: string,
  memberId: string,
  accessToken: string | undefined // 토큰을 인자로 받음
): Promise<GetSettlementMemberDto> => {
  if (!accessToken) {
    throw new Error('Access token is required for this request.');
  }

  const serverInstance = createAxiosInstance();

  try {
    const finalPath = apiPath.settlement
      .replace('{tripId}', encodeURIComponent(tripId))
      .replace('{settlementId}', encodeURIComponent(settlementId))
      .replace('{n}', encodeURIComponent(memberId));

    const res = await serverInstance.get<ApiEnvelope<GetSettlementMemberDto>>(finalPath, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
      },
    });

    return res.data.data;
  } catch (error) {
    console.error(`[API Error] 개별 지출 금액 조회 실패, 여행 아이디: ${tripId}:`, error);
    throw new Error('개별 지출 금액을 불러오는 데 실패했습니다.');
  }
};
