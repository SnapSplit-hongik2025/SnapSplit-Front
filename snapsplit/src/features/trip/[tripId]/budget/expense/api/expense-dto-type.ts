export type ExpensePageDataResponse = {
  tripId: number;
  tripName: string;
  memberProfileImages: string[];
  defaultCurrency: string;
  availCurrencies: string[];
  exchangeRates: {
    [key: string]: number;
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
  defaultDate: string;
  settledDates: string[];
};

export type CreateExpenseRequest = {
  expense: {
    date: string; // YYYY-MM-DD
    amount: number;
    currency: string; // e.g. "JPY", "USD", "KRW"
    exchangeRate: number;
    category: string; // e.g. "food", "transport", "accommodation"
    expenseName: string;
    expenseMemo: string;
    paymentMethod: string; // e.g. "cash", "credit_card"
  };
  payers: {
    memberId: number;
    payerAmount: number;
  }[];
  splitters: {
    memberId: number;
    splitAmount: number;
  }[];
};
