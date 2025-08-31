import { parseISO, differenceInCalendarDays, isValid } from 'date-fns';

export function convertSelectableDateToDay(
  tripStartDate: string,
  selectableDates: { date: string; hasExpense: boolean }[]
) {
  
  // tripStartDate 파싱 & 검증
  const tripStart = parseISO(tripStartDate);
  if (!isValid(tripStart)) {
    throw new Error('Invalid tripStartDate format');
  }

  return selectableDates.map(({ date, hasExpense }) => {
    // date 파싱 & 검증
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      throw new Error(`Invalid date format in selectableDates for date "${date}"`);
    }

    // 차이 계산
    const diff = differenceInCalendarDays(parsedDate, tripStart);
    const dayNumber = diff < 0 ? 0 : diff + 1;

    return {
      day: dayNumber,
      hasExpense,
    };
  });
}
