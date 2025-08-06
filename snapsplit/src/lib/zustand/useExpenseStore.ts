import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Expense = {
  date: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  category: string;
  expenseName: string;
  expenseMemo: string;
  paymentMethod: string;
};

type Payer = {
  memberId: number;
  payerAmount: number;
};

type Splitter = {
  memberId: number;
  splitAmount: number;
};

type ExpenseState = {
  date: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  category: string;
  expenseName: string;
  expenseMemo: string;
  paymentMethod: string;
  payers: Payer[];
  splitters: Splitter[];
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setDate: (date: string) => void;
  setExchangeRate: (exchangeRate: number) => void;
  setCategory: (category: string) => void;
  setExpenseName: (expenseName: string) => void;
  setExpenseMemo: (expenseMemo: string) => void;
  setPaymentMethod: (paymentMethod: string) => void;
  setPayers: (payers: Payer[]) => void;
  setSplitters: (splitters: Splitter[]) => void;
  getData: () => {
    expense: Expense;
    payers: Payer[];
    splitters: Splitter[];
  };
};

export const useExpenseStore = create<ExpenseState>()(
  persist((set, get) => ({
  date: '',
  amount: 0,
  currency: '한국 - KRW(원)',
  exchangeRate: 0,
  category: '',
  expenseName: '',
  expenseMemo: '',
  paymentMethod: '',
  payers: [],
  splitters: [],
  setAmount: (amount: number) => set(() => ({ amount })),
  setCurrency: (currency: string) => set(() => ({ currency })),
  setDate: (date: string) => set(() => ({ date })),
  setExchangeRate: (exchangeRate: number) => set(() => ({ exchangeRate })),
  setCategory: (category: string) => set(() => ({ category })),
  setExpenseName: (expenseName: string) => set(() => ({ expenseName })),
  setExpenseMemo: (expenseMemo: string) => set(() => ({ expenseMemo })),
  setPaymentMethod: (paymentMethod: string) => set(() => ({ paymentMethod })),
  setPayers: (payers: Payer[]) => set({ payers }),
  setSplitters: (splitters: Splitter[]) => set({ splitters }),
  getData: () => {
    return {
      expense: {
        date: get().date,
        amount: get().amount,
        currency: get().currency,
        exchangeRate: get().exchangeRate,
        category: get().category,
        expenseName: get().expenseName,
        expenseMemo: get().expenseMemo,
        paymentMethod: get().paymentMethod,
      },
      payers: get().payers,
      splitters: get().splitters,
    };
  },
}), {
  name: 'expense',
  storage: createJSONStorage(() => localStorage),
}),
);
