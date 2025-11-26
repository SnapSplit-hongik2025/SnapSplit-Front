import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export type OcrResponse = {
  currency: string;
  totalAmount: number;
  receiptUrl: string;
  items: { name: string; amount: number }[];
};

/**
 * OCR 이미지 업로드 및 파싱 요청
 * @param tripId 여행 ID
 * @param file 업로드할 이미지 파일
 * @param signal AbortSignal (선택)
 * @returns OCR 결과 데이터
 */
export const getParsedReceipt = async (
  tripId: number, // [수정] tripId 인자 추가
  file: File,
  signal?: AbortSignal
): Promise<OcrResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // [수정] tripId를 사용하여 경로 완성
    const finalPath = apiPath.OCR.replace('{tripId}', String(tripId));

    const res = await privateInstance.post<ApiEnvelope<OcrResponse>>(finalPath, formData, {
      signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  } catch (error) { 
    // [수정] ': any' 제거 (TypeScript는 기본적으로 catch 변수를 unknown으로 처리함)
    console.error('[API Error] Failed to parse OCR image:', error);
    
    // [수정] 에러를 그대로 던져야 호출하는 쪽(Button 컴포넌트)에서 status 코드를 확인할 수 있음
    throw error; 
  }
};