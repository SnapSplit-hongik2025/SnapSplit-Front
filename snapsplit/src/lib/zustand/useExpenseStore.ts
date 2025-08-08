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

export type Member = {
  memberId: number;
  name: string;
  memberType: 'USER' | 'SHARED_FUND';
  isPayer: boolean;
  payAmount: number;
  isSplitter: boolean;
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
  members: Member[];
  isReady: boolean;
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setDate: (date: string) => void;
  setExchangeRate: (exchangeRate: number) => void;
  setCategory: (category: string) => void;
  setExpenseName: (expenseName: string) => void;
  setExpenseMemo: (expenseMemo: string) => void;
  setPaymentMethod: (paymentMethod: string) => void;
  isPayerExist: () => boolean;
  setPayer: (memberId: number) => void;
  updatePayAmount: (memberId: number, payAmount: number) => void;
  setMembers: (members: Member[]) => void;
  getData: () => {
    expense: Expense;
    members: Member[];
  };
  setReady: (isReady: boolean) => void;
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      isReady: false,
      date: '',
      amount: 0,
      currency: '한국 - KRW(원)',
      exchangeRate: 0,
      category: '',
      expenseName: '',
      expenseMemo: '',
      paymentMethod: '',
      members: [],
      setAmount: (amount: number) => set(() => ({ amount })),
      setCurrency: (currency: string) => set(() => ({ currency })),
      setDate: (date: string) => set(() => ({ date })),
      setExchangeRate: (exchangeRate: number) => set(() => ({ exchangeRate })),
      setCategory: (category: string) => set(() => ({ category })),
      setExpenseName: (expenseName: string) => set(() => ({ expenseName })),
      setExpenseMemo: (expenseMemo: string) => set(() => ({ expenseMemo })),
      setPaymentMethod: (paymentMethod: string) => set(() => ({ paymentMethod })),
      isPayerExist: () => get().members.some((member) => member.isPayer),
      setPayer: (memberId: number) => set((state) => ({ members: state.members.map((member) => (member.memberId === memberId ? { ...member, isPayer: true } : member)) })),
      updatePayAmount: (memberId: number, payAmount: number) => set((state) => ({ members: state.members.map((member) => (member.memberId === memberId ? { ...member, payAmount } : member)) })),
      setMembers: (members: Member[]) => set(() => ({ members })),
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
          members: get().members,
        };
      },
      setReady: (isReady: boolean) => set(() => ({ isReady })),
    }),
    {
      name: 'expense',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
