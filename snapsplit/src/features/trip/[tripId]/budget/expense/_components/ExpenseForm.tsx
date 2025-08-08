'use client';

import ExpenseInputCard from './expense-form/ExpenseInputCard';
import TripDateSection from './expense-form/TripDateSection';
import PaymentMethodSection from './expense-form/PaymentMethodSection';
import NameSection from './expense-form/NameSection';
import MemoSection from './expense-form/MemoSection';
import CategorySection from './expense-form/CategorySection';
import PaySection from './expense-form/PaymentSection';
import SplitSection from './expense-form/SplitSection';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
// import { expenseInitData } from '@/lib/api/expense';
import EXPENSE_INIT_DATA from '@public/mocks/expense-init.json'
import { useExpenseInitStore, ExpenseInitData } from '@/lib/zustand/useExpenseInitStore';
import Button from '@/shared/components/Button';

export default function ExpenseForm() {
  const tripId = useParams().tripId;
  const { payers, setCurrency, setDate, setReady, isReady, amount, expenseName, expenseMemo, category, paymentMethod, splitters } = useExpenseStore();
  const { setExpenseInitData } = useExpenseInitStore();

  const formValidate = () => {
    // 1. 통화: 기본값 있음
    // 2. 금액: 기본값 없음
    if(amount === 0) {
      return false;
    }
    // 3. 날짜: 기본값 있음
    // 4. 지출명: 기본값 없음
    if(expenseName === '') {
      return false;
    }
    // 5. 지출 내용: 기본값 없음
    if(expenseMemo === '') {
      return false;
    }
    // 6. 카테고리: 기본값 없음
    if(category === '') {
      return false;
    }
    // 7. 결제 방법: 기본값 없음
    if(paymentMethod === '') {
      return false;
    }
    // 8. 결제자: 기본값 없음
    if(payers.length === 0) {
      return false;
    } else {
      for(const payer of payers) {
        if(payer.isSelected && payer.payerAmount === 0) {
          return false;
        }
      }
    }
    // 9. 정산자: 기본값 없음
    if(splitters.length === 0) {
      return false;
    } else {
      for(const splitter of splitters) {
        if(splitter.isSelected && splitter.splitAmount === 0) {
          return false;
        }
      }
    }
    return true;
  }

  useEffect(() => {
    if (tripId) {
      // expenseInitData(tripId as string);
      const res = EXPENSE_INIT_DATA;
      setExpenseInitData(res.data as ExpenseInitData);
      setCurrency(res.data.defaultCurrency);
      setDate('Day 1');
      setReady(true);
    }
  }, [tripId, setExpenseInitData, setCurrency, setDate]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard />
      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection />
        <PaymentMethodSection />
        <NameSection />
        <MemoSection />
        <CategorySection />
        <PaySection />
        {payers.length > 0 && <SplitSection />}
      </div>
      <div className="flex items-center justify-center w-full p-5">
        <Button label="추가하기" onClick={() => {}} enabled={formValidate()} />
      </div>
    </div>
  );
}
