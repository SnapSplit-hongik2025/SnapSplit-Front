import privateInstance from '@/lib/api/instance/privateInstance';
import { apiPath } from '@/shared/constants/apipath';
import { ApiEnvelope } from '@/lib/api/type';

export type OcrResponse = {
  parsedText: string;
  totalAmount?: number;
  items?: Array<{ name: string; amount: number }>;
  currency: string;
};

/**
 * OCR 이미지 업로드 및 파싱 요청
 * @param file 업로드할 이미지 파일 (예: 촬영한 영수증)
 * @param signal AbortSignal (선택)
 * @returns OCR 결과 데이터
 */
export const getParsedReceipt = async (
  file: File,
  signal?: AbortSignal
): Promise<OcrResponse> => {
  try {
    // multipart/form-data 구성
    const formData = new FormData();
    formData.append('file', file);

    // API path (예시: /api/ocr)
    const finalPath = apiPath.OCR;

    // axios 요청
    const res = await privateInstance.post<ApiEnvelope<OcrResponse>>(finalPath, formData, {
      signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 서버에서 envelope 구조로 감싸서 응답한다고 가정
    return res.data.data;
  } catch (error) {
    console.error('[API Error] Failed to parse OCR image:', error);
    throw new Error('영수증 인식에 실패했습니다.');
  }
};
