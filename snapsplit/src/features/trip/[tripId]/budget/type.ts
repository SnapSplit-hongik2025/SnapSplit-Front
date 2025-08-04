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

export type User = {
  userId: number;
  userIconImg: string;
};

export type UserIconListProps = {
  users: User[];
};

export type expense = {
  expenseId: number;
  category: string;
  expenseName: string;
  expenseMemo: string;
  amount: number;
  currency: string;
  splitters: string[];
};

export type dailyExpenses = {
  date: string;
  expenses: expense[];
};

export type DailyExpenseListProps = {
  dailyExpenses: dailyExpenses[];
  tripStartDate: string;
  tripEndDate: string;
};

export type ExpenseDateBarProps = {
  expenseDate: string;
  tripStartDate: string;
};