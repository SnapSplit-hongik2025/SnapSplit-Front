export type ExpenseCreateData = {
  expense: {
    date: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    category: string;
    expenseName: string;
    expenseMemo: string;
    paymentMethod: string;
  };
  payers: Payer[];
  splitters: Splitter[];
};

export type Payer = {
  memberId: number;
  payerAmount: number;
};

export type Splitter = {
  memberId: number;
  splitAmount: number;
};