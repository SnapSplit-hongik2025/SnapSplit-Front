import { GroupedExpenses } from "@/shared/utils/groupExpenses";
import { ExpenseDto, TopCategoryExpenseDto, SharedFundDto } from "./budget-dto-type";

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
  groupedExpenses: GroupedExpenses[];
};

export type ExpenseDateBarProps = {
  label: string;
};

