import { CreateExpenseRequest } from "../../api/expense-dto-type";

type Item = {
    name: string;
    amount: number;
}

export type EditExpenseRequestWithReceipt = {
    expense: CreateExpenseRequest['expense'];
    payers: CreateExpenseRequest['payers'];
    splitters: CreateExpenseRequest['splitters'];
    receiptUrl: string;
    items: Item[];
}