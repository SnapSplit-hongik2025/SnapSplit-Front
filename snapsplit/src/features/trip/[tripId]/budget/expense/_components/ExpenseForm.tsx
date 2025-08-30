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

import { useExpenseStore, Member, selectIsValid, selectIsInitialized } from '@/lib/zustand/useExpenseStore';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import EXPENSE_INIT_DATA from '@public/mocks/expense-init.json';
import { useExpenseInitStore, ExpenseInitData } from '@/lib/zustand/useExpenseInitStore';
import { expenseCreate } from '@/lib/api/expense';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import ReceiptDetailSection from './expense-form/ReceiptDetailSection';

export default function ExpenseForm() {
  // tripId
  const params = useParams();
  const tripId = params.tripId as string;

  // value & setters
  const setMembers = useExpenseStore((s) => s.setMembers);
  const amount = useExpenseStore((s) => s.amount);
  const setAmount = useExpenseStore((s) => s.setAmount);
  const currency = useExpenseStore((s) => s.currency);
  const setCurrency = useExpenseStore((s) => s.setCurrency);
  const date = useExpenseStore((s) => s.date);
  const setDate = useExpenseStore((s) => s.setDate);
  const paymentMethod = useExpenseStore((s) => s.paymentMethod);
  const setPaymentMethod = useExpenseStore((s) => s.setPaymentMethod);
  const expenseName = useExpenseStore((s) => s.expenseName);
  const setExpenseName = useExpenseStore((s) => s.setExpenseName);
  const expenseMemo = useExpenseStore((s) => s.expenseMemo);
  const setExpenseMemo = useExpenseStore((s) => s.setExpenseMemo);
  const category = useExpenseStore((s) => s.category);
  const setCategory = useExpenseStore((s) => s.setCategory);

  const exchangeRates = useExpenseInitStore((s) => s.exchangeRates);

  // derived & lifecycle
  const isInitialized = useExpenseStore(selectIsInitialized);
  const setInitialized = useExpenseStore((s) => s.setInitialized);
  const isValid = useExpenseStore(selectIsValid);
  const reset = useExpenseStore((s) => s.reset);

  const { setExpenseInitData } = useExpenseInitStore();

  const getData = useExpenseStore((s) => s.getData);

  // receipt
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isFromReceipt = from === 'receipt';
  const receiptItems = useReceiptStore((s) => s.items);

  useEffect(() => {
    // reset
    reset();

    if (!tripId) return;

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
  }, [tripId, setExpenseInitData, setCurrency, setDate, setMembers, setInitialized, reset]);

  const handleSubmit = () => {
    const data = getData();
    if (!tripId) return;
    expenseCreate(tripId, data);
  };

  if (!isInitialized) return null;

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard
        amount={amount}
        setAmount={setAmount}
        currency={currency}
        setCurrency={setCurrency}
        exchangeRates={exchangeRates}
        mode="expense"
      />
      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection date={date} setDate={setDate} />
        <PaymentMethodSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <NameSection expenseName={expenseName} setExpenseName={setExpenseName} />
        <MemoSection expenseMemo={expenseMemo} setExpenseMemo={setExpenseMemo} />
        <CategorySection category={category} setCategory={setCategory} />
        {isFromReceipt && <ReceiptDetailSection items={receiptItems} />}
        <PaySection />
        <SplitSection />
      </div>
      <div className="flex items-center justify-center w-full py-5">
        <Button label="추가하기" onClick={handleSubmit} enabled={isValid} />
      </div>
    </div>
  );
}
