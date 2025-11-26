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
 */
export const getParsedReceipt = async (
  tripId: number,
  file: File,
  signal?: AbortSignal
): Promise<OcrResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const finalPath = apiPath.OCR.replace('{tripId}', String(tripId));

    const res = await privateInstance.post<ApiEnvelope<OcrResponse>>(finalPath, formData, {
      signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  } catch (error: any) {
    const status = error.response?.status || error.status;
    if (status !== 400) {
      console.error('[API Error] Failed to parse OCR image:', error);
    }
    throw error; 
  }
};