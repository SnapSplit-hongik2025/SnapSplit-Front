export interface expenseMember {
  memberId: number;
  name: string;
  amount: number;
}

export interface ExpenseDetailPageProps {
  tripId: string;
  expenseId: string;

}

export interface ExpenseAmountProps {
  amount: number;
  symbol: string;
  amountKRW: number;
}

export interface PersonalExpenseItemProps {
  variant: 'payers' | 'splitters';
  member: expenseMember[];
  symbol: string;
}