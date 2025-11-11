import privateInstance from "@/lib/api/instance/privateInstance";
import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import { GetExpenseDetailDto } from "../types/expense-detail-dto";

export const getExpenseDetail = async (tripId: string, expenseId: string): Promise<GetExpenseDetailDto> => {
  if (!tripId) {
    alert('유효하지 않은 여행 ID입니다. 다시 시도해주세요.');
  }
    
  if (!expenseId) {
    alert('유효하지 않은 exepnse ID입니다. 다시 시도해주세요.');
  }

  try {
    const finalPath = apiPath.EXPENSE_DETAIL.replace('{tripId}', String(tripId)).replace('{expenseId}',expenseId.toString());;
    const res = await privateInstance.get<ApiEnvelope<GetExpenseDetailDto>>(finalPath);
    console.log(`[API] getExpenseDetail for tripId ${tripId}:`, res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(`[API ERROR] 지출 상세 정보를 불러오는데 실패했습니다. ${tripId}:`, error);
    throw new Error('지출 상세 정보를 불러오기 실패');
  }
}