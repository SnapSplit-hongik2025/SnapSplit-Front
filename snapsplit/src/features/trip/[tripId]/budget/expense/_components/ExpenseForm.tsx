/* eslint-disable @typescript-eslint/no-unused-vars */

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

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createExpense, createExpenseWithReceipt, getExpensePageData } from '../api/expense-api';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import ReceiptDetailSection from './expense-form/ReceiptDetailSection';
import type { CreateExpenseRequest, ExpensePageDataResponse } from '../api/expense-dto-type';
import Loading from '@/shared/components/loading/Loading';
import { useQueryClient } from '@tanstack/react-query';

export type MemberState = {
  isPayer: boolean;
  isSplitter: boolean;
  payAmount: number;
  splitAmount: number;
};

export default function ExpenseForm() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;
  const searchParams = useSearchParams();
  const date = searchParams.get('date') as string;

  const queryClient = useQueryClient();

  // ✅ ReceiptForm에서 넘어온 상태 감지
  const from = searchParams.get('from');
  const isFromReceipt = from === 'receipt';
  const { ocrResult, clearReceiptData, receiptUrl, items } = useReceiptStore();
  console.log('ocrResult: ', ocrResult);

  const [pageData, setPageData] = useState<ExpensePageDataResponse | null>(null);

  // ✅ form 초기값
  const [form, setForm] = useState<CreateExpenseRequest>({
    expense: {
      date,
      amount: 0,
      currency: 'KRW',
      exchangeRate: 1,
      category: '',
      expenseName: '',
      expenseMemo: '',
      paymentMethod: 'CASH',
    },
    payers: [],
    splitters: [],
  });

  // ✅ 멤버별 상태
  const [membersState, setMembersState] = useState<Record<number, MemberState>>({});

  const toggle = (id: number, key: 'isPayer' | 'isSplitter') => {
    setMembersState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: !prev[id][key] },
    }));
  };

  const updateAmount = (id: number, key: 'payAmount' | 'splitAmount', value: number | null) => {
    setMembersState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  // ✅ expense 필드 변경
  const handleExpenseChange = <K extends keyof CreateExpenseRequest['expense']>(
    key: K,
    value: CreateExpenseRequest['expense'][K] | null
  ) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, [key]: value },
    }));
  };

  // ✅ init (pageData fetch + Receipt 데이터 반영)
  useEffect(() => {
    if (!tripId || !date) return;

    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        setPageData(expensePageData);

        // ✅ 멤버 상태 초기화
        setMembersState(
          expensePageData.members.reduce(
            (acc, member) => {
              acc[member.memberId] = { isPayer: false, isSplitter: false, payAmount: 0, splitAmount: 0 };
              return acc;
            },
            {} as Record<number, MemberState>
          )
        );

        // ✅ 기본 폼 상태 초기화
        setForm((prev) => ({
          ...prev,
          expense: {
            ...prev.expense,
            currency: expensePageData.defaultCurrency,
            exchangeRate: expensePageData.exchangeRates[expensePageData.defaultCurrency],
          },
        }));

        // ✅ Receipt에서 넘어온 경우 OCR 결과를 form에 반영
        if (isFromReceipt && ocrResult) {
          setForm({
            expense: {
              date,
              amount: ocrResult.totalAmount || 0,
              currency: ocrResult.currency || expensePageData.defaultCurrency,
              exchangeRate: expensePageData.exchangeRates[ocrResult.currency || expensePageData.defaultCurrency],
              category: '',
              expenseName: '',
              expenseMemo: '',
              paymentMethod: 'cash',
            },
            payers: [],
            splitters: [],
          });
        }
      } catch (error) {
        console.error('지출 초기화 데이터 가져오기 실패:', error);
      }
    };

    fetchExpensePageData();
  }, [tripId, date, isFromReceipt, ocrResult]);

  // ✅ 제출 핸들러
  const handleSubmit = async () => {
    if (!tripId) return;

    const refinedForm = {
      ...form,
      payers: Object.entries(membersState)
        .filter(([_, m]) => m.isPayer)
        .map(([id, m]) => ({ memberId: Number(id), payerAmount: m.payAmount })),
      splitters: Object.entries(membersState)
        .filter(([_, m]) => m.isSplitter)
        .map(([id, m]) => ({ memberId: Number(id), splitAmount: m.splitAmount })),
      expense: {
        ...form.expense,
        category: form.expense.category.toLowerCase(),
        paymentMethod: form.expense.paymentMethod.toUpperCase(),
      },
    };

    try {
      await createExpense(Number(tripId), refinedForm);
      alert('지출이 성공적으로 등록되었습니다.');
      clearReceiptData(); // ✅ Receipt 상태 초기화 (이름 맞게 수정됨)
      queryClient.invalidateQueries({
        queryKey: ['tripBudget', tripId],
      });
      queryClient.refetchQueries({
        queryKey: ['tripBudget', tripId],
      });
      router.push(`/trip/${tripId}/budget`);
    } catch (error) {
      console.error('지출 등록 실패:', error);
      alert('지출 등록 중 오류가 발생했습니다.');
    }
  };

  const handleSubmitWithReceipt = async () => {
    if (!tripId) return;
    if (!receiptUrl) return;
    if (!items) return;

    const refinedForm = {
      ...form,
      payers: Object.entries(membersState)
        .filter(([_, m]) => m.isPayer)
        .map(([id, m]) => ({ memberId: Number(id), payerAmount: m.payAmount })),
      splitters: Object.entries(membersState)
        .filter(([_, m]) => m.isSplitter)
        .map(([id, m]) => ({ memberId: Number(id), splitAmount: m.splitAmount })),
      expense: {
        ...form.expense,
        category: form.expense.category.toLowerCase(),
        paymentMethod: form.expense.paymentMethod.toUpperCase(),
      },
      receiptUrl: receiptUrl,
      items: items.map((item) => {
        const rawAmount = item.amount;
        const parsedAmount = typeof rawAmount === 'string' ? Number(rawAmount) : rawAmount;

        return {
          name: item.name,
          amount: parsedAmount,
        };
      }),
    };

    try {
      await createExpenseWithReceipt(Number(tripId), refinedForm);
      alert('지출이 성공적으로 등록되었습니다.');
      clearReceiptData(); // ✅ Receipt 상태 초기화 (이름 맞게 수정됨)
      queryClient.invalidateQueries({
        queryKey: ['tripBudget', tripId],
      });
      queryClient.refetchQueries({
        queryKey: ['tripBudget', tripId],
      });
      router.push(`/trip/${tripId}/budget`);
    } catch (error) {
      console.error('지출 등록 실패:', error);
      alert('지출 등록 중 오류가 발생했습니다.');
    }
  };

  if (!pageData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      {/* 금액 / 통화 */}
      <ExpenseInputCard
        amount={form.expense.amount}
        setAmount={(amount) => handleExpenseChange('amount', amount)}
        currency={form.expense.currency}
        setCurrency={(currency) => handleExpenseChange('currency', currency)}
        exchangeRates={pageData.exchangeRates}
        setExchangeRate={(exchangeRate) => handleExpenseChange('exchangeRate', exchangeRate)}
        availCurrencies={pageData.availCurrencies}
        mode="expense"
      />

      <div className="flex flex-col items-center gap-7 w-full pt-6">
        {/* 기본 폼 */}
        <TripDateSection
          date={form.expense.date}
          setDate={(date) => handleExpenseChange('date', date)}
          startDate={pageData.settledDates[0]}
          endDate={pageData.settledDates[pageData.settledDates.length - 1]}
        />
        <PaymentMethodSection
          paymentMethod={form.expense.paymentMethod}
          setPaymentMethod={(m) => handleExpenseChange('paymentMethod', m)}
        />
        <NameSection
          expenseName={form.expense.expenseName}
          setExpenseName={(name) => handleExpenseChange('expenseName', name)}
        />
        <MemoSection
          expenseMemo={form.expense.expenseMemo}
          setExpenseMemo={(memo) => handleExpenseChange('expenseMemo', memo)}
        />
        <CategorySection category={form.expense.category} setCategory={(c) => handleExpenseChange('category', c)} />

        {/* ✅ ReceiptForm에서 넘어온 경우 영수증 상세 표시 */}
        {isFromReceipt && <ReceiptDetailSection items={ocrResult?.items || []} />}

        {/* 결제자/분할자 */}
        <PaySection
          currency={form.expense.currency}
          members={pageData.members}
          membersState={membersState}
          handleCheck={toggle}
          updateAmount={updateAmount}
        />
        <SplitSection
          currency={form.expense.currency}
          members={pageData.members}
          membersState={membersState}
          handleCheck={toggle}
          updateAmount={updateAmount}
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex items-center justify-center w-full py-5">
        <Button label="추가하기" onClick={isFromReceipt ? handleSubmitWithReceipt : handleSubmit} enabled={true} />
      </div>
    </div>
  );
}
