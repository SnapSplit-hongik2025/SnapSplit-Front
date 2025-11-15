'use client';

import ExpenseInputCard from '../_components/expense-form/ExpenseInputCard';
import TripDateSection from '../_components/expense-form/TripDateSection';
import PaymentMethodSection from '../_components/expense-form/PaymentMethodSection';
import NameSection from '../_components/expense-form/NameSection';
import MemoSection from '../_components/expense-form/MemoSection';
import CategorySection from '../_components/expense-form/CategorySection';
import ReceiptDetailSection from '../_components/expense-form/ReceiptDetailSection';
import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import PaySection from '../_components/expense-form/PaySection';
import SplitSection from '../_components/expense-form/SplitSection';
import Button from '@/shared/components/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getExpensePageData } from '../api/expense-api';
import Loading from '@/shared/components/loading/Loading';
import { useState } from 'react';
import type { CreateExpenseRequest } from '../api/expense-dto-type';
import { MemberState } from '../_components/ExpenseForm';
import { editExpense } from './api/expense-edit-api';
import { ExpenseDetail, ResponseItem } from './types';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ExpenseEditForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const expenseId = searchParams.get('expenseId') as string;
  const queryClient = useQueryClient();
  const isFromReceipt = searchParams.get('from') === 'receipt';

  const expenseDetail: ExpenseDetail | null = queryClient.getQueryData(['expenseDetail', tripId, expenseId]) || null;

  if (!expenseDetail) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const date = expenseDetail.date;

  // page 초기화 값
  const { data: pageData } = useQuery({
    queryKey: ['expensePageData', tripId, date],
    queryFn: () => getExpensePageData(Number(tripId), date),
  });

  const [membersState, setMembersState] = useState<Record<number, MemberState>>({});

  // 제출할 값
  const [form, setForm] = useState<CreateExpenseRequest>({
    expense: {
      date,
      amount: expenseDetail.amount,
      currency: expenseDetail.currency,
      exchangeRate: expenseDetail.exchangeRate,
      category: expenseDetail.category,
      expenseName: expenseDetail.expenseName,
      expenseMemo: expenseDetail.expenseMemo,
      paymentMethod: expenseDetail.paymentMethod,
    },
    payers: expenseDetail.payers.map((p) => ({
      memberId: p.memberId,
      payerAmount: p.amount,
    })),
    splitters: expenseDetail.splitters.map((s) => ({
      memberId: s.memberId,
      splitAmount: s.amount,
    })),
  });

  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [items, setItems] = useState<ResponseItem[] | null>(null);
  const [isReceiptMode, setIsReceiptMode] = useState(false);

  useEffect(() => {
    if (!expenseDetail) return;

    console.log('expenseDetail:', expenseDetail);
    console.log('expenseDetail.receiptUrl:', expenseDetail.receiptUrl);

    const initialState: Record<number, MemberState> = {};

    expenseDetail.payers.forEach((p) => {
      initialState[p.memberId] = {
        isPayer: true,
        isSplitter: false,
        payAmount: p.amount,
        splitAmount: 0,
      };
    });

    expenseDetail.splitters.forEach((s) => {
      initialState[s.memberId] = {
        isPayer: false,
        isSplitter: true,
        payAmount: 0,
        splitAmount: s.amount,
      };
    });

    setMembersState(initialState);

    // receiptUrl이 있으면 영수증 모드로 전환
    if (expenseDetail.receiptUrl) {
      console.log('Setting receipt mode with:', expenseDetail.receiptUrl, expenseDetail.receiptItems);
      setReceiptUrl(expenseDetail.receiptUrl);
      // receiptItems를 items로 변환
      setItems(expenseDetail.receiptItems || null);
      setIsReceiptMode(true);
    }
  }, [expenseDetail]);

  if (!pageData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleExpenseChange = <K extends keyof CreateExpenseRequest['expense']>(
    key: K,
    value: CreateExpenseRequest['expense'][K] | null
  ) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, [key]: value },
    }));
  };

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

  // 제출
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
      await editExpense(Number(tripId), Number(expenseId), refinedForm);
      alert('지출이 성공적으로 등록되었습니다.');
      // Todo: receipt 전역 공유 데이터 청소
      // Todo: react query 업데이트
      // Todo: routing
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
      await editExpense(Number(tripId), Number(expenseId), refinedForm);
      alert('지출이 성공적으로 등록되었습니다.');
      // Todo: receipt 전역 공유 데이터 청소
      // Todo: react query 업데이트
      // Todo: routing
    } catch (error) {
      console.error('지출 등록 실패:', error);
      alert('지출 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard
        amount={form.expense.amount}
        setAmount={(amount) => handleExpenseChange('amount', amount)}
        currency={form.expense.currency}
        setCurrency={(currency) => handleExpenseChange('currency', currency)}
        exchangeRates={pageData.exchangeRates}
        setExchangeRate={(exchangeRate) => handleExpenseChange('exchangeRate', exchangeRate)}
        availCurrencies={['KRW', 'USD']}
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
        {isReceiptMode && (
          <>
            {console.log('isReceiptMode:', isReceiptMode, 'items:', items)}
            <ReceiptDetailSection 
              items={items?.map((item, index) => ({
                id: index,
                name: item.name,
                amount: item.amount
              })) || []} 
            />
          </>
        )}

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
        <Button label="수정하기" onClick={isReceiptMode ? handleSubmitWithReceipt : handleSubmit} enabled={true} />
      </div>
    </div>
  );
}
