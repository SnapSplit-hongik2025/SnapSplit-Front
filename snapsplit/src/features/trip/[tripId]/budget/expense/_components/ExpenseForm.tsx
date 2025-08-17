'use client';

import ExpenseInputCard from './expense-form/ExpenseInputCard';
import TripDateSection from './expense-form/TripDateSection';
import PaymentMethodSection from './expense-form/PaymentMethodSection';
import NameSection from './expense-form/NameSection';
import MemoSection from './expense-form/MemoSection';
import CategorySection from './expense-form/CategorySection';
import PaySection from './expense-form/PaySection';
import SplitSection from './expense-form/SplitSection';
import Button from '@/shared/components/Button';

import {
  useExpenseStore,
  Member,
  selectIsValid,
  selectIsInitialized,
  selectHasPayer,
} from '@/lib/zustand/useExpenseStore';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import EXPENSE_INIT_DATA from '@public/mocks/expense-init.json';
import { useExpenseInitStore, ExpenseInitData } from '@/lib/zustand/useExpenseInitStore';

export default function ExpenseForm() {
  const tripId = useParams().tripId as string | undefined;

  // value & setters
  const setDate = useExpenseStore((s) => s.setDate);
  const setMembers = useExpenseStore((s) => s.setMembers);
  const setInitialized = useExpenseStore((s) => s.setInitialized);
  const amount = useExpenseStore((s) => s.amount);
  const setAmount = useExpenseStore((s) => s.setAmount);
  const currency = useExpenseStore((s) => s.currency);
  const setCurrency = useExpenseStore((s) => s.setCurrency);

  // derived & lifecycle
  const isInitialized = useExpenseStore(selectIsInitialized);
  const isValid = useExpenseStore(selectIsValid);
  const hasPayer = useExpenseStore(selectHasPayer);

  const { setExpenseInitData } = useExpenseInitStore();

  useEffect(() => {
    if (!tripId) return;

    setInitialized(false);

    try {
      // TODO: API 반환 데이터로 대체
      const res = EXPENSE_INIT_DATA as { data: ExpenseInitData };
      setExpenseInitData(res.data);

      // INIT
      // TODO: 초기화 로직 다듬기
      setCurrency(res.data.defaultCurrency);
      setDate('Day 1');

      const initMembers: Member[] = res.data.members.map((m) => ({
        ...m,
        isPayer: false,
        payAmount: null,
        isSplitter: false,
        splitAmount: null,
      }));
      setMembers(initMembers);
    } catch (error) {
      console.error('지출 초기화 데이터 가져오기 실패 : ', error);
      // TODO: 에러 상태 표시
    } finally {
      setInitialized(true);
    }
  }, [tripId, setExpenseInitData, setCurrency, setDate, setMembers, setInitialized]);

  if (!isInitialized) return null;

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard amount={amount} setAmount={setAmount} currency={currency} setCurrency={setCurrency}/>
      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection />
        <PaymentMethodSection />
        <NameSection />
        <MemoSection />
        <CategorySection />
        <PaySection />
        {hasPayer && <SplitSection />}
      </div>
      <div className="flex items-center justify-center w-full p-5">
        <Button
          label="추가하기"
          onClick={() => {
            /* TODO: submit handler */
          }}
          enabled={isValid}
        />
      </div>
    </div>
  );
}
