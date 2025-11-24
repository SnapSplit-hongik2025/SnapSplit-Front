import privateInstance from "@/lib/api/instance/privateInstance";
import { CreateExpenseRequest } from "../../api/expense-dto-type";
import { EditExpenseRequestWithReceipt } from "./expense-edit-dto-type";

export const editExpense = async (tripId: number, expenseId: number, expense: CreateExpenseRequest | EditExpenseRequestWithReceipt) => {
    const response = await privateInstance.put(`/trips/${tripId}/expense/${expenseId}`, expense);
    return response.data;
};

export const getExchangeRate = async (currency: string) => {
    const response = await privateInstance.get(`/exchangeRate?bases=${currency}`);
    return response.data;
};