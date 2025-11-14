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
import { ExpenseCreateData, Payer, Splitter } from '@/shared/types/expense';

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
  amount: number | null;
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
  setAmount: (amount: number | null) => void;
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
  getData: () => ExpenseCreateData;
  getPayers: () => Payer[];
  getSplitter: () => Splitter[];

  // reset
  reset: () => void;
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      // initial values
      isInitialized: false,
      date: '',
      amount: null,
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
          members: state.members.map((m) => (m.memberId === memberId ? { ...m, isPayer } : m)),
        })),
      setSplitter: (memberId, isSplitter) =>
        set((state) => ({
          members: state.members.map((m) => (m.memberId === memberId ? { ...m, isSplitter } : m)),
        })),
      updatePayAmount: (memberId, payAmount) =>
        set((state) => ({
          members: state.members.map((m) => (m.memberId === memberId ? { ...m, payAmount } : m)),
        })),
      updateSplitAmount: (memberId, splitAmount) =>
        set((state) => ({
          members: state.members.map((m) => (m.memberId === memberId ? { ...m, splitAmount } : m)),
        })),

      getPayers: () => {
        const payers: Payer[] = [];
        get().members.forEach((m) => {
          if (m.isPayer) {
            const payer: Payer = {
              memberId: m.memberId,
              payerAmount: m.payAmount || 0,
            };
            payers.push(payer);
          }
        });
        return payers;
      },
      getSplitter: () => {
        const splitters: Splitter[] = [];
        get().members.forEach((m) => {
          if (m.isSplitter) {
            const splitter: Splitter = {
              memberId: m.memberId,
              splitAmount: m.splitAmount || 0,
            };
            splitters.push(splitter);
          }
        });
        return splitters;
      },

      // helpers
      getData: () => ({
        expense: {
          date: get().date,
          amount: get().amount || 0,
          currency: get().currency,
          exchangeRate: get().exchangeRate,
          category: get().category,
          expenseName: get().expenseName,
          expenseMemo: get().expenseMemo,
          paymentMethod: get().paymentMethod,
        },
        payers: get().getPayers(),
        splitters: get().getSplitter(),
      }),

      // reset
      reset: () =>
        set({
          date: '',
          amount: null,
          currency: 'KRW',
          exchangeRate: 1,
          category: '',
          expenseName: '',
          expenseMemo: '',
          paymentMethod: '',
          members: [],
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
      }),
    }
  )
);
