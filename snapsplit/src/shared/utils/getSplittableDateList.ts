import { format, addDays, isWithinInterval, parseISO } from 'date-fns';

type DateSelectable = {
  date: string; // yyyy-MM-dd
  selectable: boolean;
};

export function getSplittableDateList(tripStart: string, tripEnd: string, completeSettlements: { startDate: string, endDate: string }[]): DateSelectable[] {
  const start = addDays(parseISO(tripStart), -1); // 여행 시작 하루 전
  const end = parseISO(tripEnd);

  const allDates: DateSelectable[] = [];

  for (let d = start; d <= end; d = addDays(d, 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');

    const isInCompleteRange = completeSettlements.some(({ startDate, endDate }) =>
      isWithinInterval(d, {
        start: parseISO(startDate),
        end: parseISO(endDate)
      })
    );

    allDates.push({
      date: dateStr,
      selectable: !isInCompleteRange
    });
  }

  return allDates;
}
