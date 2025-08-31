import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';

// 여행 삭제 API
export const deleteTrip = async (tripId: string) => {
    if (!tripId) {
        throw new Error('유효하지 않은 여행 ID입니다.');}

    try {
        const finalPath = apiPath.trips.replace('{tripId}', tripId);
        await privateInstance.delete(finalPath);
        return { success: true };
    } catch (error) {
        console.error(`[API Error] Failed to delete trip for tripId ${tripId}:`, error);
        throw new Error('여행 삭제에 실패했습니다.');
    }
};