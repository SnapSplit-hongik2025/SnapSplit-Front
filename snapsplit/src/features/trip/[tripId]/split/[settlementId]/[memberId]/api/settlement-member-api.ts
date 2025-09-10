import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetSettlementMemberDto } from '../types/settlement-member-dto-type';

export const getSettlementMemberData = async (
  tripId: string,
  settlementId: string,
  memberId: string
): Promise<GetSettlementMemberDto> => {
  try {
    const finalPath = apiPath.settlement
      .replace('{tripId}', encodeURIComponent(tripId))
      .replace('{settlementId}', encodeURIComponent(settlementId))
      .replace('{n}', encodeURIComponent(memberId));

    const res = await privateInstance.get<ApiEnvelope<GetSettlementMemberDto>>(finalPath);

    return res.data.data;
  } catch (error) {
    console.error(`[API Error] 개별 지출 금액 조회 실패, 여행 아이디: ${tripId}:`, error);
    throw new Error('개별 지출 금액을 불러오는 데 실패했습니다.');
  }
};
