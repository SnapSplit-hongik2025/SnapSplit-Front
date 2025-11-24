import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

export function getDateRangeArray(start: string, end: string): dayjs.Dayjs[] {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  const dates: dayjs.Dayjs[] = [];

  let current = startDate;
  while (current.isSameOrBefore(endDate)) {
    dates.push(current);
    current = current.add(1, 'day');
  }

  return dates;
}
