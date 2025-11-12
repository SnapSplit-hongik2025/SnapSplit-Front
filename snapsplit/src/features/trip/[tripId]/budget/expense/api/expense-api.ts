
import privateInstance from "@/lib/api/instance/privateInstance";
import { ApiEnvelope } from "@/lib/api/type";
import { CreateExpenseRequest, ExpensePageDataResponse } from "./expense-dto-type";

export const getExpensePageData = async (tripId: number, date: string): Promise<ExpensePageDataResponse> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  if (!date) {
    throw new Error('유효하지 않은 날짜입니다.');
  }
  
  try {
    const finalPath = `trips/${tripId}/expense/new`;
    const res = await privateInstance.get<ApiEnvelope<ExpensePageDataResponse>>(finalPath, {
      params: {
        date,
      },
    });
    console.log(`[API] Fetched trip expense page data for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API Error] Failed to get trip expense page data for tripId ${tripId}:`, error);
    throw new Error('여행 지출 정보를 불러오는 데 실패했습니다.');
  }
};

export const createExpense = async (tripId: number, data: CreateExpenseRequest): Promise<ApiEnvelope<{expenseId: number}>> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  if (!data) {
    throw new Error('유효하지 않은 지출 데이터입니다.');
  }
  
  try {
    const finalPath = `trips/${tripId}/expense`;
    const res = await privateInstance.post<ApiEnvelope<{expenseId: number}>>(finalPath, data);
    console.log(`[API] Created expense for tripId ${tripId}:`, res.data.data);
    return res.data;
  } catch (error) {
    console.error(`[API Error] Failed to create expense for tripId ${tripId}:`, error);
    throw new Error('지출을 추가하는 데 실패했습니다.');
  }
};
