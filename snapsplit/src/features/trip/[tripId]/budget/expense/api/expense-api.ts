
import privateInstance from "@/lib/api/instance/privateInstance";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import { ExpensePageDataResponse } from "./expense-dto-type";

export const getExpensePageData = async (tripId: number, date: string): Promise<ExpensePageDataResponse> => {
  if (!tripId) {
    throw new Error('유효하지 않은 여행 ID입니다.');
  }
  if (!date) {
    throw new Error('유효하지 않은 날짜입니다.');
  }
  
  try {
    const finalPath = apiPath.EXPENSE.replace('{tripId}', String(tripId));
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