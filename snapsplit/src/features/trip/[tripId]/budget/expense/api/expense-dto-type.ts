export type ExpensePageDataResponse = {
  defaultCurrency: string;
  availCurrencies: string[];
  exchangeRates: {
    [key: string]: number;
  };
  defaultDate: string;
  members: {
    memberId: number;
    name: string;
    memberType: string;
  }[];
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

export type CreateExpenseRequestWithReceipt = CreateExpenseRequest & {
  receiptUrl: string;
  items: {
    name: string;
    amount: number;
  }[];
};