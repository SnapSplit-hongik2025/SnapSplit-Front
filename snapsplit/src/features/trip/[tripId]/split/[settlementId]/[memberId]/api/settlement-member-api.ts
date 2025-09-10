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
    console.error(`[API Error] Failed to get trip Header for tripId ${tripId}:`, error);
    throw new Error('여행 코드를 불러오는데 실패했습니다.');
  }
};
