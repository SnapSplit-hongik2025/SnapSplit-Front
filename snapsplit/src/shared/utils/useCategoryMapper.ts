export const backendToKor = {
  FOOD:           '식비',
  FLIGHT:         '항공',
  ACCOMMODATION:  '숙소',
  TRANSPORTATION: '교통',
  TOUR:           '관광',
  SHOPPING:       '쇼핑',
  OTHERS:         '기타',
} as const;

export type BackendCategory = keyof typeof backendToKor;
export type KorCategory = typeof backendToKor[BackendCategory];

/**
 * 백엔드 응답(영문 카테고리)을 한글로 변환.
 * @param category 백엔드가 주는 문자열
 * @returns 매핑된 한글. 없으면 '기타'
 */
export function mapCategoryToKor(category: string): KorCategory {
  // 런타임에 category 가 key 에 속하는지 확인
  if (category in backendToKor) {
    return backendToKor[category as BackendCategory];
  }
  return backendToKor.OTHERS;
}
