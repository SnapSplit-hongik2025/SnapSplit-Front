import { Expense } from "./api";

export type BudgetPageProps = {
  tripId: string;
};

// TripInfo.tsx
export type TripInfoProps = {
    tripName: string;
  countries: string[];
    startDate: string;
    endDate: string;
};
  
// SharedBudgetBar.tsx
export type SharedCurrency = {
    totalSharedCurrency: string;
    totalSharedAmount: number;
};
  
type topCategoryExpense = {
  category: string;
  amountKRW: number;
}
  
export type SharedBudgetBarProps = {
  tripId: number;
  sharedFund: { defaultCurrency: string; balance: number; }
  topExpense: topCategoryExpense;
};

// TripDateFilterBarProps.tsx
export type TripDateFilterBarProps = {
  startDate: string;
  endDate: string;
};

// DailyExpenseList.tsx
export type ExpenseItemProps = {
  expense: Expense;
  expenseDay: string;
};


export type DailyExpenseListProps = {
  expenses: Expense[];
};

export type User = {
  userId: number;
  userIconImg: string;
};


export type UserIconListProps = {
  users: User[];
};