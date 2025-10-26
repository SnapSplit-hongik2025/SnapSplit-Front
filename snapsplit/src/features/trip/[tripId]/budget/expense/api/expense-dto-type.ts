export type ExpensePageDataResponse = {
  tripId: number;
  tripName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  countries: string[];
  memberProfileImages: string[];
  sharedFund: {
    defaultCurrency: string;
    balance: number;
  };
  topCategoryExpense: {
    category: string;
    amountKRW: number;
  };
  dailyExpenses: {
    date: string; // YYYY-MM-DD
    expenses: {
      expenseId: number;
      category: string;
      expenseName: string;
      expenseMemo: string;
      amount: number;
      currency: string;
      splitters: string[];
    }[];
  }[];
  totalExpense: number;
};
