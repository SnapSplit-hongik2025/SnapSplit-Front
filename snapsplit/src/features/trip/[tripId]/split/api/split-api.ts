import privateInstance from "@/lib/api/instance/privateInstance";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import { GetSplitDto } from "../types/split-dto-type";

export const getSplitData = async (tripId: string): Promise<GetSplitDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.budget.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetSplitDto>>(finalPath);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] (tripId: ${tripId})의 getTripBudgetData API 실패`, error);
    throw new Error('여행 정산 정보를 불러오는 데 실패했습니다.');
  }
};