import { parseISO, differenceInCalendarDays, isValid } from 'date-fns';

/**
 * 여행 시작일까지 남은 일수를 계산합니다.
 * @param tripStartDate ISO 형식의 여행 시작 날짜 문자열 (예: '2025-08-10')
 * @returns 남은 일수 (음수면 이미 시작된 상태)
 */
export function getDaysUntilTrip(tripStartDate: string): number {
  const start = parseISO(tripStartDate);
  if (!isValid(start)) {
    throw new Error(`Invalid date format: ${tripStartDate}`);
  }

  const today = new Date();
  return differenceInCalendarDays(start, today);
}
