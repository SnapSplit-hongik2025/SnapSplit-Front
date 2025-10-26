export type ExpensePageDataResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    defaultCurrency: string;
    availCurrencies: string[];
    exchangeRates: Record<string, number>; // key: 통화코드, value: 환율
    defaultDate: string; // YYYY-MM-DD
    members: {
      memberId: number;
      name: string;
      memberType: 'USER' | 'SHARED_FUND';
    }[];
    settledDates: string[];
  };
};
