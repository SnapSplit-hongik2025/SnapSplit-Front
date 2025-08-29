import { DailyExpenseDto, ExpenseDto, TopCategoryExpenseDto } from "./budget-dto-type";

export type BudgetPageProps = {
  tripId: string;
};

export type TripInfoProps = {
  tripName: string;
  countries: string[];
  startDate: string;
  endDate: string;
};

export type SharedCurrency = {
    totalSharedCurrency: string;
    totalSharedAmount: number;
};

export type SharedBudgetBarProps = {
  tripId: number;
  sharedFund: { defaultCurrency: string; balance: number; }
  topExpense: TopCategoryExpenseDto;
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
};

export type ExpenseDateBarProps = {
  expenseDate: string;
  tripStartDate: string;
};

