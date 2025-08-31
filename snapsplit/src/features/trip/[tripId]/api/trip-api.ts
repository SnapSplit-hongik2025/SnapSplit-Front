import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetTripCodeDto } from '../types/trip-type';

export const getTripCodeData = async (tripId: string): Promise<GetTripCodeDto> => {
    try {
        const finalPath = apiPath.tripCode.replace('{tripId}', tripId);
        const res = await privateInstance.get<ApiEnvelope<GetTripCodeDto>>(finalPath);
        return res.data.data;
    } catch (error) {
        console.error(`[API Error] Failed to get trip Header for tripId ${tripId}:`, error);
        throw new Error('여행 코드를 불러오는데 실패했습니다.');
    }
};
