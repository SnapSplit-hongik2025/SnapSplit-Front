import privateInstance from "@/lib/api/instance/privateInstance";
import { GetTripBudgetDto, GetSharedBudgetDto, GetExchangeRateDto } from "../types/budget-dto-type";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";

export const getTripBudgetData = async (tripId: number): Promise<GetTripBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.expense.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetTripBudgetDto>>(finalPath);
    console.log(`[API] Fetched trip budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip budget for tripId ${tripId}:`, error);
    throw new Error('여행 예산 정보를 불러오는 데 실패했습니다.');
  }
};

export const getSharedBudgetData = async (tripId: number): Promise<GetSharedBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.budget.replace('{tripId}', String(tripId)) + '/details';
    const res = await privateInstance.get<ApiEnvelope<GetSharedBudgetDto>>(finalPath);
    console.log(`[API] Fetched shared budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get shared budget for tripId ${tripId}:`, error);
    throw new Error('여행 공동 경비 정보를 불러오는 데 실패했습니다.');
  }
};

export const getExchangeRate = async (bases: string): Promise<GetExchangeRateDto> => {
  if (!bases) {
    throw new Error('유효하지 않은 통화입니다.');
  }
  
  try {
    const finalPath = apiPath.exchange;
    const res = await privateInstance.get<ApiEnvelope<GetExchangeRateDto>>(finalPath, { params: { bases } });
    console.log(`[API] Fetched exchange rate for bases ${bases}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get exchange rate for bases ${bases}:`, error);
    throw new Error('환율 정보를 불러오는 데 실패했습니다.');
  }
};