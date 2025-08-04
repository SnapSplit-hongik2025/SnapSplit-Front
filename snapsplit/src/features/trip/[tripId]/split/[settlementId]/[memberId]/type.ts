export interface SettlementDetailPageProps {
  name: string;
}

export interface TotalAmountInfoProps {
  name: string;
  totalAmount: number;
}

export type ExpenseDetail = {
  expenseName: string;
  expenseMemo: string;
  amount: number;
  amountKRW: number;
  expenseCurrency: string;
};

export type SharedBudgetDetail = {
  date: string;               // "2025-04-09"
  items: ExpenseDetail[];
};

export interface DetailExpensesProps {
  sharedBudgetDetails: SharedBudgetDetail[];
}