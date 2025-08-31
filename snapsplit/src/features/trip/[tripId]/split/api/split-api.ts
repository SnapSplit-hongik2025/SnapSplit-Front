import privateInstance from "@/lib/api/instance/privateInstance";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import { GetSplitDto, PostsettlementResponseDto } from "../types/split-dto-type";

// 여행 정산 정보 조회
export const getSplitData = async (tripId: string): Promise<GetSplitDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.split.replace('{tripId}', tripId);
    const res = await privateInstance.get<ApiEnvelope<GetSplitDto>>(finalPath);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] (tripId: ${tripId})의 getTripBudgetData API 실패`, error);
    throw new Error('여행 정산 정보를 불러오는 데 실패했습니다.');
  }
};
// 정산하기
export const postSettlement = async (
  tripId: string,
  startDate: string,
  endDate: string
): Promise<PostsettlementResponseDto> => {
  if (!startDate || !endDate) {
    throw new Error('정산 시작 날짜와 종료 날짜를 모두 선택해주세요.');
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('여행 시작일은 종료일보다 이전이어야 합니다.');
  }

  try {
    const finalPath = apiPath.split.replace('{tripId}', tripId);
    const settlementData = { startDate, endDate };
    const res = await privateInstance.post<ApiEnvelope<PostsettlementResponseDto>>(finalPath, settlementData);
    return res.data.data;
  } catch (error) {
    console.error('[API Error] postSettlement:', error);
    throw new Error('정산 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};