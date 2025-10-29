import { expenseMember } from "./expense-detail-type";
import { BackendCategory } from '@/shared/utils/useCategoryMapper';


export interface GetExpenseDetailDto {
  expenseId: number;
  amount: number;
  amountKRW: number;
  currency: string;
  paymentMethod: "CASH" | "CREDIT_CARD";
  date: string;
  expenseName: string;
  expenseMemo: string;
  category: BackendCategory;
  payers: expenseMember[];
  splitters: expenseMember[];
  receiptUrl?: string;
  receiptItems: ReceiptItemDto[];
}

export interface ReceiptItemDto{
  name: string;
  amount: number;
}