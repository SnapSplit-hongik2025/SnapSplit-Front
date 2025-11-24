import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { DailyExpenseDto, ExpenseDto } from '@/features/trip/[tripId]/budget/types/budget-dto-type';
import { getKoreanDay } from './getKoreanDay';

dayjs.extend(isSameOrBefore);

export type GroupedExpenses = {
  id?: string; // 스크롤 이동용 ID
  type: 'PRE_TRIP' | 'IN_TRIP';
  dayIndex?: number;
  label: string; // ex. '8.29(금)', '여행준비'
  expenses: ExpenseDto[];
};

export function groupExpensesByDate(
  dailyExpenses: DailyExpenseDto[],
  tripStartDate: string,
  tripEndDate: string
): GroupedExpenses[] {
  const result: GroupedExpenses[] = [];

  // 1. dailyExpenses 배열을 펼쳐서 모든 지출을 하나의 배열로 만듭니다.
  // 2. 각 지출에 해당 날짜(date)를 추가합니다.
  const allExpenses = dailyExpenses.flatMap((daily) =>
    daily.expenses.map((expense) => ({
      ...expense,
      date: daily.date, // 각 지출(expense)에 부모의 날짜(date)를 추가
    }))
  );

  // 여행 준비 (여행 시작일 이전의 모든 지출)
  const preTripExpenses = allExpenses.filter((e) =>
    dayjs(e.date).isBefore(dayjs(tripStartDate))
  );

  if (preTripExpenses.length > 0) {
    result.push({
      type: 'PRE_TRIP',
      id: 'pre-trip',
      label: '여행준비',
      expenses: preTripExpenses,
    });
  }

  // 여행 중 (여행 시작일부터 종료일까지)
  let current = dayjs(tripStartDate);
  const end = dayjs(tripEndDate);
  let dayIndex = 1;

  while (current.isSameOrBefore(end)) {
    const dateKey = current.format('YYYY-MM-DD');
    const label = `${current.format('M.D')}(${getKoreanDay(current)})`;

    // 3. 펼쳐진 배열에서 해당 날짜의 지출만 필터링합니다.
    const expensesForDay = allExpenses.filter((e) =>
      dayjs(e.date).isSame(dateKey, 'day')
    );

    // 지출 내역이 없더라도 날짜 그룹은 표시되도록 result.push는 유지합니다.
    result.push({
      id: dateKey,
      type: 'IN_TRIP',
      dayIndex,
      label,
      expenses: expensesForDay,
    });

    current = current.add(1, 'day');
    dayIndex++;
  }

  return result;
}