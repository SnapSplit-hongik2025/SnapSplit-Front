import { useMemo } from 'react';
import { parseISO, isValid, format } from 'date-fns';

/**
 * ISO 8601 문자열을 "YYYY. M. d" 형태로 포맷팅해줍니다.
 * @param isoDate "2025-06-01" 같은 날짜 문자열
 * @returns "2025. 6. 1"
 */
export function useISOtoFormattedDate(isoDate: string): string {
  return useMemo(() => {
    const date = parseISO(isoDate);
    if (!isValid(date)) return isoDate; // 유효하지 않으면 원본 그대로
    return format(date, 'yyyy. M. d');   // ↙ 여기 패턴 변경!
  }, [isoDate]);
}
