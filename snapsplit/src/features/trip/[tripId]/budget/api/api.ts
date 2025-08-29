import privateInstance from "@/lib/api/instance/privateInstance";
import { GetTripBudgetDto } from "../types/budget-dto-type";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";

export const getTripBudgetData = async (tripId: number): Promise<GetTripBudgetDto> => {
  try {
    const finalPath = apiPath.budget.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetTripBudgetDto>>(finalPath);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip budget for tripId ${tripId}:`, error);
    throw new Error('여행 예산 정보를 불러오는 데 실패했습니다.');
  }
};