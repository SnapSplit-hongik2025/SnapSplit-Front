import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';
import { CreateTripRequestDto, CreateTripResponseDto, GetCountryDto, UserInfoDto } from '../types/type';
import axios from 'axios';

// 국가 목록 조회
export const getCountryTrip = async (): Promise<GetCountryDto> => {
  try {
    const res = await privateInstance.get<ApiEnvelope<GetCountryDto>>(apiPath.countries);
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
export const getUserInfo = async (userCode: string): Promise<UserInfoDto> => {
  if (!userCode) {
    alert('유저 코드가 존재하지 않습니다.');
  }

  try {
    const finalPath = apiPath.users.replace('{userCode}', userCode);
    const res = await privateInstance.get<ApiEnvelope<UserInfoDto>>(finalPath);
    if (!res.data.success) {
      alert(res.data.message || '유저 정보 조회에 실패했습니다.');
      console.log('error', res.data.message);
      throw new Error(res.data.message || '유저 정보 조회에 실패했습니다.');
    }

    return res.data.data;
  } catch (error) {
    alert('유저 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    console.error(`[API Error] Failed to get user info for code ${userCode}:`, error);
    throw new Error('유저 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

/**
 * 여행 생성 (이미지 및 JSON 데이터 포함)
 * @param request - 여행 정보가 담긴 JSON 객체
 * @param tripImage - 사용자가 업로드한 이미지 파일 (선택 사항)
 * @returns 생성된 여행 정보
 */
export const createTrip = async (request: CreateTripRequestDto,
  tripImage: File | null): Promise<CreateTripResponseDto> => {
  const formData = new FormData();

  // JSON 데이터 처리
  const jsonRequest = JSON.stringify(request);
  const jsonBlob = new Blob([jsonRequest], { type: 'application/json' });
  formData.append('request', jsonBlob);

  // 이미지 처리
  if (tripImage) {
    formData.append('tripImage', tripImage);
  } else {
    formData.append('tripImage', new Blob(), '');
  }
  
  try {
    const res = await privateInstance.post<ApiEnvelope<CreateTripResponseDto>>(
      apiPath.createTrip,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data.data;
  } catch (error) {
    console.error('[API Error] Failed to create trip:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.log('error.response.data:', error.response.data);
      throw new Error(error.response.data.message || '여행 생성 중 오류가 발생했습니다.');
    }
    throw new Error('여행 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
