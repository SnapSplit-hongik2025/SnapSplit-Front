import { ExpenseDto, TopCategoryExpenseDto, SharedFundDto, DailyExpenseDto } from './budget-dto-type';

export type BudgetPageProps = {
  tripId: string;
};

export type TripInfoProps = {
  tripName: string;
  countries: string[];
  startDate: string;
  endDate: string;
};

export type SharedBudgetBarProps = {
  tripId: number;
  sharedFund: SharedFundDto;
  topExpense?: TopCategoryExpenseDto;
};

export type TripDateFilterBarProps = {
  startDate: string;
  endDate: string;
};

export type ExpenseItemProps = {
  expense: ExpenseDto;
  expenseDay: string;
};

// 이미지만 받는 걸로 수정 필요 - 1
export type User = {
  userId: number;
  userIconImg: string;
};

// 이미지만 받는 걸로 수정 필요 - 2
export type UserIconListProps = {
  users: User[];
};

export type DailyExpenseListProps = {
  dailyExpenses: DailyExpenseDto[];
  tripStartDate: string;
  tripEndDate: string;
  tripId: string;
};

export type ExpenseDateBarProps = {
  expenseDate: string;
  tripStartDate: string;
};

// GetSharedBudgetDto 서브 타입
// 개별 아이템
export interface SharedBudgetItem {
  type: 'deposit' | 'expense';
  title: string;
  memo: string | null;
  amount: number;
  amountKRW: number;
}

// 날짜별 공유 예산 상세
export interface SharedBudgetDetail {
  date: string; // ISO date string
  items: SharedBudgetItem[];
}

// 통화별 총액
export interface TotalSharedBudget {
  currency: string; // e.g., "KRW", "EUR", "GBP"
  amount: number;
}
