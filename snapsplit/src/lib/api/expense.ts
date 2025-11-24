import privateInstance from './instance/privateInstance';
import { ExpenseCreateData } from '@/shared/types/expense';

export const expenseInitData = async (tripId: string) => {
  try {
    const res = await privateInstance.get(`/trip/${tripId}/expense/new`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const expenseCreate = async (tripId: string, data: ExpenseCreateData) => {
  try {
    const res = await privateInstance.post(`/trip/${tripId}/expense`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};