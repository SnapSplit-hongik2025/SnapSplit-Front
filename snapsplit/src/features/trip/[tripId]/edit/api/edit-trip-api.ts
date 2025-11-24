import { GetCountryTripDto } from '@/features/trip/createTrip/types/type';
import privateInstance from '@/lib/api/instance/privateInstance';
import { ApiEnvelope } from '@/lib/api/type';
import { apiPath } from '@/shared/constants/apipath';
import { Country } from '@/shared/types/country';
import { GetTripDateDto } from '../date/type';
import { GetCountryInfoDto } from '../name/type';

// 여행 삭제 API
export const deleteTrip = async (tripId: string) => {
    if (!tripId) {
        throw new Error('유효하지 않은 여행 ID입니다.');}

    try {
        const finalPath = apiPath.TRIPS.replace('{tripId}', encodeURIComponent(tripId));
        await privateInstance.delete(finalPath);
        return { success: true };
    } catch (error) {
        console.error(`[API Error] Failed to delete trip for tripId ${tripId}:`, error);
        throw new Error('여행 삭제에 실패했습니다.');
    }
};

// 수정 전 여행지 불러오기 API
export const getTripCountries = async (tripId: string): Promise<GetCountryTripDto> => {
    try {
        const finalPath = apiPath.TRIP_COUNTRY.replace('{tripId}', encodeURIComponent(tripId));
        const res = await privateInstance.get<ApiEnvelope<GetCountryTripDto>>(finalPath);
        return res.data.data;
    } catch (error) {
        console.error(`[API Error] 여행지 불러오기 실패, tripId [${tripId}]:`, error);
        throw new Error('여행지를 불러오는 데 실패했습니다.');
    }
};

// 여행지 수정 API
export const editTripCountries = async (tripId: string, countries: Country[]) => {
    try {
        const finalPath = apiPath.TRIP_COUNTRY.replace('{tripId}', encodeURIComponent(tripId));
        await privateInstance.patch(finalPath, { countries });
        return { success: true };
    } catch (error) {
        console.error(`[API Error] 여행지 수정 실패, tripId [${tripId}]:`, error);
        throw new Error('여행지 수정에 실패했습니다.');
    }
};

// 수정 전 여행 일정 불러오기 API
export const getTripDates = async (tripId: string): Promise<GetTripDateDto> => {
    try {
        const finalPath = apiPath.TRIP_DATE.replace('{tripId}', encodeURIComponent(tripId));
        const res = await privateInstance.get<ApiEnvelope<{ startDate: string; endDate: string }>>(finalPath);
        return res.data.data;
    }
    catch (error) {
        console.error(`[API Error] 여행 일정 불러오기 실패, tripId [${tripId}]:`, error);
        throw new Error('여행 일정을 불러오는 데 실패했습니다.');
    }
}

// 여행 일정 수정 API
export const editTripDates = async (tripId: string, startDate: string, endDate: string) => {
    try {
        const finalPath = apiPath.TRIP_DATE.replace('{tripId}', encodeURIComponent(tripId));
        const res = await privateInstance.patch<ApiEnvelope<null>>(finalPath, { startDate, endDate });
        return res.data;
    } catch (error) {
        console.error(`[API Error] 여행 일정 수정 실패, tripId [${tripId}]:`, error);
        throw new Error('여행 일정 수정에 실패했습니다.');
    }
}

// 수정 전 여행 이름, 이미지 불러오기 API
export const getTripInfo = async (tripId: string): Promise<GetCountryInfoDto> => {
    try {
        const finalPath = apiPath.TRIP_INFO.replace('{tripId}', encodeURIComponent(tripId));
        const res = await privateInstance.get<ApiEnvelope<GetCountryInfoDto>>(finalPath);
        return res.data.data;
    } catch (error) {
        console.error(`[API Error] 여행 정보 불러오기 실패, tripId [${tripId}]:`, error);
        throw new Error('여행 정보를 불러오는 데 실패했습니다.');
    }
};

// 여행 이름, 이미지 수정 API
export const editTripInfo = async (tripId: string, tripName: string | null, tripImage: File | null) => {
    const formData = new FormData();
    if (tripName) {
        formData.append('tripName', tripName);
    }
    if (tripImage) {
        formData.append('tripImageFile', tripImage);
        console.log('이미지 있음');
    }
  
    try {
        console.log('변경하고자 하는 사진, 이름: ', tripName, tripImage);
        const finalPath = apiPath.TRIP_INFO.replace('{tripId}', encodeURIComponent(tripId));
        const res = await privateInstance.patch<ApiEnvelope<null>>(
            finalPath,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            }
        )
        console.log('API 응답:', res);
        return res.data;
    } catch (error) {
        console.error(`[API Error] 여행 일정 수정 실패, tripId [${tripId}]:`, error);
        throw new Error('여행 일정 수정에 실패했습니다.');
    }
}