// =============================================
// lib/zustand/useExpenseStore.ts (refactored)
// Key changes
// - Remove imperative isReady + formValidate from store
// - Introduce isInitialized for one-time init readiness
// - Add pure selectors to derive validation (isValid)
// - Keep persist clean (no derived state)
// =============================================

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const isClient = typeof window !== 'undefined';

export type Expense = {
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
  payAmount: number | null;
  isSplitter: boolean;
  splitAmount: number | null;
};

export type ExpenseState = {
  // form fields
  date: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  category: string;
  expenseName: string;
  expenseMemo: string;
  paymentMethod: string;
  members: Member[];

  // lifecycle
  isInitialized: boolean; // only for initial data mount readiness
  setInitialized: (v: boolean) => void;

  // setters
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setDate: (date: string) => void;
  setExchangeRate: (exchangeRate: number) => void;
  setCategory: (category: string) => void;
  setExpenseName: (expenseName: string) => void;
  setExpenseMemo: (expenseMemo: string) => void;
  setPaymentMethod: (paymentMethod: string) => void;
  setMembers: (members: Member[]) => void;
  setPayer: (memberId: number, isPayer: boolean) => void;
  updatePayAmount: (memberId: number, payAmount: Member['payAmount']) => void;
  updateSplitAmount: (memberId: number, splitAmount: Member['splitAmount']) => void;
  setSplitter: (memberId: number, isSplitter: boolean) => void;

  // helpers
  getData: () => { expense: Expense; members: Member[] };
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      // initial values
      isInitialized: false,
      date: '',
      amount: 0,
      currency: 'KRW',
      exchangeRate: 1,
      category: '',
      expenseName: '',
      expenseMemo: '',
      paymentMethod: '',
      members: [],

      // lifecycle
      setInitialized: (v) => set({ isInitialized: v }),

      // setters
      setAmount: (amount) => set({ amount }),
      setCurrency: (currency) => set({ currency }),
      setDate: (date) => set({ date }),
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
      setCategory: (category) => set({ category }),
      setExpenseName: (expenseName) => set({ expenseName }),
      setExpenseMemo: (expenseMemo) => set({ expenseMemo }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setMembers: (members) => set({ members }),
      setPayer: (memberId, isPayer) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.memberId === memberId ? { ...m, isPayer } : m
          ),
        })),
      setSplitter: (memberId, isSplitter) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.memberId === memberId ? { ...m, isSplitter } : m
          ),
        })),
      updatePayAmount: (memberId, payAmount) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.memberId === memberId ? { ...m, payAmount } : m
          ),
        })),
      updateSplitAmount: (memberId, splitAmount) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.memberId === memberId ? { ...m, splitAmount } : m
          ),
        })),

      // helpers
      getData: () => ({
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
      }),
    }),
    {
      name: 'expense',
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
      partialize: (s) => ({
        date: s.date,
        amount: s.amount,
        currency: s.currency,
        exchangeRate: s.exchangeRate,
        category: s.category,
        expenseName: s.expenseName,
        expenseMemo: s.expenseMemo,
        paymentMethod: s.paymentMethod,
        members: s.members,
      })
    }
  )
);


// =========================
// Derived helpers & selectors
// =========================

export const sumPay = (members: Member[]) => members.reduce((a, m) => a + (m.payAmount || 0), 0);
export const sumSplit = (members: Member[]) => members.reduce((a, m) => a + (m.splitAmount || 0), 0);
export const hasPayer = (members: Member[]) => members.some((m) => m.isPayer);
export const hasSplitter = (members: Member[]) => members.some((m) => m.isSplitter);

export const selectIsValid = (s: ExpenseState) => {
  const amountOk = s.amount > 0;
  const nameOk = s.expenseName.trim().length > 0;
  const memoOk = s.expenseMemo.trim().length > 0;
  const categoryOk = s.category.trim().length > 0;
  const methodOk = s.paymentMethod.trim().length > 0;
  const payerOk = hasPayer(s.members) && s.amount === sumPay(s.members);
  const splitterOk = hasSplitter(s.members) && s.amount === sumSplit(s.members);
  return amountOk && nameOk && memoOk && categoryOk && methodOk && payerOk && splitterOk;
};

export const selectIsInitialized = (s: ExpenseState) => s.isInitialized;
export const selectHasPayer = (s: ExpenseState) => hasPayer(s.members);
export const selectPaySum = (s: ExpenseState) => sumPay(s.members);
export const selectSplitSum = (s: ExpenseState) => sumSplit(s.members);