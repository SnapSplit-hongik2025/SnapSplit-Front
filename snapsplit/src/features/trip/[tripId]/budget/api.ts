export type Expense = {
    expenseId: number;
    expenseDate: string;
    expenseAmount: number;
    expenseCurrency: string;
    expenseCategory: string;
    expenseUsers: {
      userId: number;
      userName: string;
    }[];
  };
  