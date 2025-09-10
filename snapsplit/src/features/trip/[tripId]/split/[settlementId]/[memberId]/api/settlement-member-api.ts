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

    console.log('[DEBUG] Final API Path:', finalPath);
    console.log('[DEBUG] Sending Authorization Header:', `Bearer ${accessToken?.slice(0, 10)}...`);

    const res = await serverInstance.get<ApiEnvelope<GetSettlementMemberDto>>(finalPath, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('[DEBUG] API Response Status:', res.status);
    console.log('[DEBUG] API Response Data:', res.data);

    return res.data.data;
  } catch (error: any) {
    console.error('[API Error] 개별 지출 금액 조회 실패:', {
      tripId,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('개별 지출 금액을 불러오는 데 실패했습니다.');
  }
};
