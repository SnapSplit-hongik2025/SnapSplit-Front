import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Member = {
  memberId: number;
  name: string;
  memberType: 'USER' | 'SHARED_FUND';
};

export type ExpenseInitData = {
  defaultCurrency: string;
  availCurrencies: string[];
  exchangeRates: Record<string, number>; // 예: { "USD": 1350, "KRW": 1 }
  defaultDate: string;
  members: Member[];
};

type ExpenseInitState = {
  defaultCurrency: string;
  availCurrencies: string[];
  exchangeRates: Record<string, number>;
  defaultDate: string;
  members: Member[];
  setExpenseInitData: (data: ExpenseInitData) => void;
  clearExpenseInitData: () => void;
};

export const useExpenseInitStore = create<ExpenseInitState>()(
  persist((set) => ({
  defaultCurrency: '',
  availCurrencies: [],
  exchangeRates: {},
  defaultDate: '',
  members: [],
  setExpenseInitData: (data: ExpenseInitData) =>
    set({
      defaultCurrency: data.defaultCurrency,
      availCurrencies: data.availCurrencies,
      exchangeRates: data.exchangeRates,
      defaultDate: data.defaultDate,
      members: data.members,
    }),
  clearExpenseInitData: () =>
    set({
      defaultCurrency: '',
      availCurrencies: [],
      exchangeRates: {},
      defaultDate: '',
      members: [],
    }),
}), {
  name: 'expenseInitData',
  storage: createJSONStorage(() => localStorage),
}),
);
