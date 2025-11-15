import axios from "axios";
import { CreateExpenseRequest } from "../../api/expense-dto-type";
import { EditExpenseRequestWithReceipt } from "./expense-edit-dto-type";

export const editExpense = async (tripId: number, expenseId: number, expense: CreateExpenseRequest | EditExpenseRequestWithReceipt) => {
    const response = await axios.put(`/trips/${tripId}/expense/${expenseId}`, expense);
    return response.data;
};