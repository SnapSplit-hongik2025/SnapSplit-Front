import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apiPath';
import { ApiEnvelope } from '@/lib/api/type';
import { CreateTripRequestDto, CreateTripResponseDto, GetCountryTripDto, GetUserCodeDto as GetUserInfoDto } from '../types/type';

// 국가 목록 조회
export const getCountryTrip = async (): Promise<GetCountryTripDto> => {
    try {
        const res = await privateInstance.get<ApiEnvelope<GetCountryTripDto>>(apiPath.countries);
        if (!res.data.success) {
            throw new Error(res.data.message || '국가 목록 조회에 실패했습니다.');
        }
        return res.data.data;
    } catch (error) {
        console.error('[API Error] Failed to get country trip:', error);
        throw new Error('국가 목록 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
};

// 유저 코드로 유저 정보 조회
export const getUserInfo = async (userCode: string): Promise<GetUserInfoDto> => {
    if (!userCode) {
        throw new Error('유저 코드가 존재하지 않습니다.');
    }
    
    try {
        const finalPath = apiPath.users.replace('{userCode}', userCode);
        const res = await privateInstance.get<ApiEnvelope<GetUserInfoDto>>(finalPath);
        if (!res.data.success) {
            throw new Error(res.data.message || '유저 정보 조회에 실패했습니다.');
        }
        return res.data.data;
    } catch (error) {
        console.error(`[API Error] Failed to get user info for code ${userCode}:`, error);
        throw new Error('유저 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
   }
};

// 여행 생성
export const createTrip = async (tripData: CreateTripRequestDto): Promise<CreateTripResponseDto> => {
    if (!tripData.tripName || tripData.countries.length === 0 || !tripData.startDate || !tripData.endDate) {
        throw new Error('여행 생성에 필요한 모든 필드를 채워주세요.');
    }
    
    if (tripData.startDate > tripData.endDate) {
        throw new Error('여행 시작일은 종료일보다 이전이어야 합니다.');
    }
    
    try {
        const res = await privateInstance.post<ApiEnvelope<CreateTripResponseDto>>(apiPath.trips, tripData);
        return res.data.data;
    } catch (error) {
        console.error('[API Error] Failed to create trip:', error);
        throw new Error('여행 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
   }
};