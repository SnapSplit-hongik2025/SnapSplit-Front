import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Expense } from '@/features/trip/[tripId]/budget/api/api';
import { getKoreanDay } from './getKoreanDay';

dayjs.extend(isSameOrBefore);
type GroupedExpenses = {
  id?: string; // 스크롤 이동용 ID
  type: 'PRE_TRIP' | 'IN_TRIP';
  dayIndex?: number;
  label: string; // ex. '4.7(월)', '여행준비'
  expenses: Expense[];
};

export function groupExpensesByDate(
  expenses: Expense[],
  tripStartDate: string,
  tripEndDate: string
): GroupedExpenses[] {
  const result: GroupedExpenses[] = [];

  // 여행 준비
  const preTripExpenses = expenses.filter((e) =>
    dayjs(e.expenseDate).isBefore(dayjs(tripStartDate))
  );
  if (preTripExpenses.length > 0) {
    result.push({
      type: 'PRE_TRIP',
      label: '여행준비',
      expenses: preTripExpenses,
    });
  }

  // 여행 중
  let current = dayjs(tripStartDate);
  const end = dayjs(tripEndDate);
  let dayIndex = 1;

  while (current.isSameOrBefore(end)) {
    const dateKey = current.format('YYYY-MM-DD');
    const label = `${current.format('M.D')}/${getKoreanDay(current)}`;
    const dayExpenses = expenses.filter((e) =>
      dayjs(e.expenseDate).isSame(dateKey, 'day')
    );

    result.push({
      id: dateKey,
      type: 'IN_TRIP',
      dayIndex,
      label,
      expenses: dayExpenses,
    });

    current = current.add(1, 'day');
    dayIndex++;
  }

  return result;
}
