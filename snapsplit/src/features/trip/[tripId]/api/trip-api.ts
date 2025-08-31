import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { GetTripCodeDto } from '../types/trip-type';

export const getTripCodeData = async (tripId: string): Promise<GetTripCodeDto> => {
    const finalPath = apiPath.tripCode.replace('{tripId}', tripId);
    
    const res = await privateInstance.get<ApiEnvelope<GetTripCodeDto>>(finalPath);
    return res.data.data;
};
