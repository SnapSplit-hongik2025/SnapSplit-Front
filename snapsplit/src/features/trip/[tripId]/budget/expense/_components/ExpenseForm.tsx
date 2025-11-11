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

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createExpense } from '../api/expense-api';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import ReceiptDetailSection from './expense-form/ReceiptDetailSection';
import { getExpensePageData } from '../api/expense-api';
import type { CreateExpenseRequest, ExpensePageDataResponse } from '../api/expense-dto-type';

export default function ExpenseForm() {
  // tripId
  const params = useParams();
  const tripId = params.tripId as string;

  // mock
  const date = '2025-09-13';

  // 초기 상태
  const [pageData, setPageData] = useState<ExpensePageDataResponse | null>(null);
  const [form, setForm] = useState<CreateExpenseRequest>({
    expense: {
      date: date,
      amount: 0,
      currency: 'KRW',
      exchangeRate: 1,
      category: '',
      expenseName: '',
      expenseMemo: '',
      paymentMethod: 'cash',
    },
    payers: [
      { memberId: 1, payerAmount: 0 },
    ],
    splitters: [
      { memberId: 1, splitAmount: 0 },
    ],
  });

  // expense 필드 업데이트 핸들러
  const handleExpenseChange = <K extends keyof CreateExpenseRequest['expense']>(
    key: K,
    value: CreateExpenseRequest['expense'][K] | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, [key]: value },
    }));
  };

/*   // payer 업데이트 핸들러
  const handlePayerChange = (index: number, key: 'memberId' | 'payerAmount', value: number) => {
    setForm((prev) => {
      const nextPayers = [...prev.payers];
      nextPayers[index] = { ...nextPayers[index], [key]: value };
      return { ...prev, payers: nextPayers };
    });
  };

  // splitter 업데이트 핸들러
  const handleSplitterChange = (index: number, key: 'memberId' | 'splitAmount', value: number) => {
    setForm((prev) => {
      const nextSplitters = [...prev.splitters];
      nextSplitters[index] = { ...nextSplitters[index], [key]: value };
      return { ...prev, splitters: nextSplitters };
    });
  };

  // payer / splitter 추가
  const addPayer = () => setForm((p) => ({ ...p, payers: [...p.payers, { memberId: 0, payerAmount: 0 }] }));
  const addSplitter = () =>
    setForm((p) => ({ ...p, splitters: [...p.splitters, { memberId: 0, splitAmount: 0 }] }));
 */
  // receipt
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isFromReceipt = from === 'receipt';
  const receiptItems = useReceiptStore((s) => s.items);

  // init
  useEffect(() => {
    const date = '2025-09-13'; // 임시 데이터
    if (!tripId || !date) return;

    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        console.log('expensePageData : ', expensePageData);
        setPageData(expensePageData);
        setForm((prev) => ({
          ...prev,
          expense: {
            ...prev.expense,
            currency: expensePageData.defaultCurrency,
            exchangeRate: expensePageData.exchangeRates[expensePageData.defaultCurrency],
          }
        }))
      } catch (error) {
        console.error('지출 초기화 데이터 가져오기 실패 : ', error);
        // TODO: 에러 상태 표시
      }
    };
    fetchExpensePageData();
  }, [tripId]);

  const handleSubmit = async () => {
    if (!tripId) return;
    // TODO: Mock data DB에 들어가면 수정
    const res = await createExpense(Number(tripId), form);
    console.log('res : ', res);
  };

  if (!pageData) return null;

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard
        amount={form.expense.amount}
        setAmount={(amount) => handleExpenseChange('amount', amount)}
        currency={form.expense.currency}
        setCurrency={(currency) => handleExpenseChange('currency', currency)}
        exchangeRates={pageData.exchangeRates}
        availCurrencies={pageData.availCurrencies}
        mode="expense"
      />
      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection date={form.expense.date} setDate={(date) => handleExpenseChange('date', date)} startDate={pageData.settledDates[0]} endDate={pageData.settledDates[pageData.settledDates.length - 1]}/>
        <PaymentMethodSection paymentMethod={form.expense.paymentMethod} setPaymentMethod={(paymentMethod) => handleExpenseChange('paymentMethod', paymentMethod)} />
        <NameSection expenseName={form.expense.expenseName} setExpenseName={(expenseName) => handleExpenseChange('expenseName', expenseName)} />
        <MemoSection expenseMemo={form.expense.expenseMemo} setExpenseMemo={(expenseMemo) => handleExpenseChange('expenseMemo', expenseMemo)} />
        <CategorySection category={form.expense.category} setCategory={(category) => handleExpenseChange('category', category)} />
        {isFromReceipt && <ReceiptDetailSection items={receiptItems} />}
        <PaySection currency={form.expense.currency} />
        <SplitSection currency={form.expense.currency} />
      </div>
      <div className="flex items-center justify-center w-full py-5">
        <Button label="추가하기" onClick={handleSubmit} enabled={true} />
      </div>
    </div>
  );
}
  