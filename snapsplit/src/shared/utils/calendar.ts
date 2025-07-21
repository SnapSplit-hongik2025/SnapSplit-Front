import { addDays, addMonths, endOfMonth, eachDayOfInterval, getDay, startOfMonth } from 'date-fns';

export const generateDates = (currentMonth: Date) => {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const startDay = getDay(start);

  // 이전 달의 날짜 계산
  const prevMonthEnd = endOfMonth(addMonths(start, -1));
  const prevDates =
    startDay === 0
      ? []
      : eachDayOfInterval({
          start: addDays(prevMonthEnd, -startDay + 1),
          end: prevMonthEnd,
        });

  // 현재 달의 날짜 계산
  const currentDates = eachDayOfInterval({ start, end });

  // 총 필요한 셀 수 (6주 * 7일 = 42일)
  const totalCells = 6 * 7;
  const currentCells = prevDates.length + currentDates.length;
  const nextDatesCount = totalCells - currentCells;

  // 다음 달의 날짜 계산
  const nextMonthStart = startOfMonth(addMonths(start, 1));
  const nextDates = Array.from({ length: nextDatesCount }, (_, i) => addDays(nextMonthStart, i));

  return [...prevDates, ...currentDates, ...nextDates];
};