import privateInstance from "@/lib/api/instance/privateInstance";
import { GetTripBudgetDto, SharedBudgetDto, UpdateDefaultCurrencyDto,GetSharedBudgetDto, GetExchangeRateDto, UpdateSharedBudgetRequestDto, GetCategoryExpenseDto } from "../types/budget-dto-type";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";

export const getTripBudgetData = async (tripId: number): Promise<GetTripBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.EXPENSE.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetTripBudgetDto>>(finalPath);
    console.log(`[API] Fetched trip budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip budget for tripId ${tripId}:`, error);
    throw new Error('여행 예산 정보를 불러오는 데 실패했습니다.');
  }
};

export const getSharedData = async (tripId: number): Promise<SharedBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = `/trips/${Number(tripId)}/budget`;
    const res = await privateInstance.get<ApiEnvelope<SharedBudgetDto>>(finalPath);
    console.log(`[API] Fetched trip budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip budget for tripId ${tripId}:`, error);
    throw new Error('여행 예산 정보를 불러오는 데 실패했습니다.');
  }
};

export const updateDefaultCurrency = async (tripId: number, currency: string): Promise<UpdateDefaultCurrencyDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }

  try {
    const finalPath = apiPath.BUDGET.replace('{tripId}', String(tripId));
    const res = await privateInstance.patch<ApiEnvelope<UpdateDefaultCurrencyDto>>(finalPath, null, {
      params: { newDefaultCur: currency }
    });
    console.log(`[API] Fetched trip budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip budget for tripId ${tripId}:`, error);
    throw new Error('여행 기본 통화 정보를 변경하는 데 실패했습니다.');
  }
}

export const getSharedBudgetData = async (tripId: number): Promise<GetSharedBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.BUDGET.replace('{tripId}', String(tripId)) + '/details';
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
    const finalPath = apiPath.EXCHANGE;
    const res = await privateInstance.get<ApiEnvelope<GetExchangeRateDto>>(finalPath, { params: { bases } });
    console.log(`[API] Fetched exchange rate for bases ${bases}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get exchange rate for bases ${bases}:`, error);
    throw new Error('환율 정보를 불러오는 데 실패했습니다.');
  }
};

export const addSharedBudget = async (tripId: number, payload: UpdateSharedBudgetRequestDto): Promise<GetSharedBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.BUDGET.replace('{tripId}', String(tripId)) + '/add';
    const res = await privateInstance.post<ApiEnvelope<GetSharedBudgetDto>>(finalPath, payload);
    console.log(`[API] Added shared budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to add shared budget for tripId ${tripId}:`, error);
    throw new Error('여행 공동 경비를 추가하는 데 실패했습니다.');
  }
};

export const removeSharedBudget = async (tripId: number, payload: UpdateSharedBudgetRequestDto): Promise<GetSharedBudgetDto> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  
  try {
    const finalPath = apiPath.BUDGET.replace('{tripId}', String(tripId)) + '/remove';
    const res = await privateInstance.post<ApiEnvelope<GetSharedBudgetDto>>(finalPath, payload);
    console.log(`[API] Removed shared budget for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to remove shared budget for tripId ${tripId}:`, error);
    throw new Error('여행 공동 경비를 빼는 데 실패했습니다.');
  }
};

export const getCategoryExpense = async (tripId: string): Promise<GetCategoryExpenseDto> => {
  if (!tripId) {
    alert('유효하지 않은 여행 ID입니다. 다시 시도해주세요.')
  }

  try {
    const finalPath = apiPath.STATISTICS.replace('{tripId}', String(tripId));
    const res = await privateInstance.get<ApiEnvelope<GetCategoryExpenseDto>>(finalPath);
    console.log(`[API] getCategoryExpense for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API ERROR] 카테고리 지출 정보를 불러오는데 실패했습니다. ${tripId}:`, error);
    throw new Error('');
  }
}