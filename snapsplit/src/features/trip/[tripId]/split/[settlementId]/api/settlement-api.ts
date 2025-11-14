import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetSettlementDto } from '../types/settlement-dto-type';

export const getSettlementData = async (tripId: string, settlementId: string): Promise<GetSettlementDto> => {
    try {
        const finalPath = apiPath.SETTLEMENT.replace('{tripId}', encodeURIComponent(tripId)).replace('{settlementId}', encodeURIComponent(settlementId));
        const res = await privateInstance.get<ApiEnvelope<GetSettlementDto>>(finalPath);
        return res.data.data;
    } catch (error) {
        console.error(`[API Error] Failed to get settlement for tripId=${tripId}, settlementId=${settlementId}:`, error);
        throw new Error('정산 데이터를 불러오는데 실패했습니다.');
 }
};
