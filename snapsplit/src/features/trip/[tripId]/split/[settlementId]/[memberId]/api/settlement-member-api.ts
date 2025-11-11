import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetSettlementMemberDto } from '../types/settlement-member-dto-type';
import createAxiosInstance from '@/lib/api/instance/base';

export const getSettlementMemberData = async (
  tripId: string,
  settlementId: string,
  memberId: string
): Promise<GetSettlementMemberDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  if (!settlementId) {
    throw new Error('유효하지 않은 정산 ID입니다.');
  }
  if (!memberId) {
    throw new Error('유효하지 않은 멤버 ID입니다.');
  }

  try {
    const finalPath = apiPath.SETTLEMENT_MEMBER
      .replace('{tripId}', encodeURIComponent(tripId))
      .replace('{settlementId}', encodeURIComponent(settlementId))
      .replace('{memberId}', encodeURIComponent(memberId));

    const res = await createAxiosInstance().get<ApiEnvelope<GetSettlementMemberDto>>(finalPath);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] (tripId: ${tripId})의 getSettlementMemberData API 실패`, error);
    throw new Error('개별 지출 금액을 불러오는 데 실패했습니다.');
  }
};
