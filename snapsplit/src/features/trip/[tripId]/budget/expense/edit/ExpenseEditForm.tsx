'use client';

import ExpenseInputCard from '../_components/expense-form/ExpenseInputCard';
import TripDateSection from '../_components/expense-form/TripDateSection';
import PaymentMethodSection from '../_components/expense-form/PaymentMethodSection';
import NameSection from '../_components/expense-form/NameSection';
import MemoSection from '../_components/expense-form/MemoSection';
import CategorySection from '../_components/expense-form/CategorySection';
import ReceiptDetailSection from '../_components/expense-form/ReceiptDetailSection';
import PaySection from '../_components/expense-form/PaySection';
import SplitSection from '../_components/expense-form/SplitSection';
import Button from '@/shared/components/Button';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import { getExpensePageData } from '../api/expense-api';
import Loading from '@/shared/components/loading/Loading';

import { useEffect, useState } from 'react';
import type { CreateExpenseRequest } from '../api/expense-dto-type';
import { MemberState } from '../_components/ExpenseForm';
import { editExpense } from './api/expense-edit-api';
import type { ExpenseDetail, ResponseItem } from './types';

export default function ExpenseEditForm() {
  /* ───────────────────────────
   *  params / 기본 세팅
   * ─────────────────────────── */
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const expenseId = searchParams.get('expenseId') as string;
  const queryClient = useQueryClient();

  /* ───────────────────────────
   * 1) expenseDetail 가져오기
   * ─────────────────────────── */
  const expenseDetail: ExpenseDetail | null = queryClient.getQueryData(['expenseDetail', tripId, expenseId]) || null;

  const date = expenseDetail?.date ?? null;

  /* ───────────────────────────
   * 2) pageData 불러오기
   * ─────────────────────────── */
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['expensePageData', tripId, date],
    queryFn: () => getExpensePageData(Number(tripId), date!),
    enabled: !!date,
  });

  /* ───────────────────────────
   *  로컬 State들 (항상 선언)
   * ─────────────────────────── */
  const [membersState, setMembersState] = useState<Record<number, MemberState>>({});
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [items, setItems] = useState<ResponseItem[] | null>(null);
  const [isReceiptMode, setIsReceiptMode] = useState(false);

  const [form, setForm] = useState<CreateExpenseRequest | null>(null);

  /* ───────────────────────────
   * expenseDetail 들어오면 form 초기화
   * ─────────────────────────── */
  useEffect(() => {
    if (!expenseDetail || !pageData) return;

    const initialState: Record<number, MemberState> = {};

    pageData.members.forEach((m) => {
      const payer = expenseDetail.payers.find((p) => p.memberId === m.memberId);
      const splitter = expenseDetail.splitters.find((s) => s.memberId === m.memberId);

      initialState[m.memberId] = {
        isPayer: !!payer,
        isSplitter: !!splitter,
        payAmount: payer?.amount ?? 0,
        splitAmount: splitter?.amount ?? 0,
      };
    });

    setMembersState(initialState);

    // form 구성도 pageData 의존으로 옮기기
    setForm({
      expense: {
        date: expenseDetail.date,
        amount: expenseDetail.amount,
        currency: expenseDetail.currency,
        exchangeRate: 1,
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

    if (expenseDetail.receiptUrl) {
      setReceiptUrl(expenseDetail.receiptUrl);
      setItems(expenseDetail.receiptItems || null);
      setIsReceiptMode(true);
    }
  }, [expenseDetail, pageData]);

  /* ───────────────────────────
   * pageData → exchangeRate 업데이트
   * ─────────────────────────── */
  useEffect(() => {
    if (!form || !pageData) return;

    const exchangeRate = pageData.exchangeRates[form.expense.currency] ?? 1;

    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expense: {
          ...prev.expense,
          exchangeRate,
        },
      };
    });
  }, [pageData]);

  /* ───────────────────────────
   *  UI 분기 (Hook은 이미 위에서 모두 실행됨)
   * ─────────────────────────── */

  if (!expenseDetail || !form || isPageLoading || !pageData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  /* ───────────────────────────
   *  핸들러들
   * ─────────────────────────── */

  const handleExpenseChange = <K extends keyof CreateExpenseRequest['expense']>(
    key: K,
    value: CreateExpenseRequest['expense'][K] | null
  ) => {
    setForm((prev) => ({
      ...prev!,
      expense: { ...prev!.expense, [key]: value },
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

  const buildPayload = () => ({
    ...form!,
    payers: Object.entries(membersState)
      .filter(([, m]) => m.isPayer)
      .map(([id, m]) => ({ memberId: Number(id), payerAmount: m.payAmount })),
    splitters: Object.entries(membersState)
      .filter(([, m]) => m.isSplitter)
      .map(([id, m]) => ({ memberId: Number(id), splitAmount: m.splitAmount })),
    expense: {
      ...form!.expense,
      category: form!.expense.category.toLowerCase(),
      paymentMethod: form!.expense.paymentMethod.toUpperCase(),
    },
  });

  const handleSubmit = async () => {
    if (!tripId) return;
    try {
      await editExpense(Number(tripId), Number(expenseId), buildPayload());
      queryClient.invalidateQueries({ queryKey: ['expenseDetail', tripId, expenseId] });
      queryClient.invalidateQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      alert('지출이 성공적으로 수정되었습니다.');
      router.push(`/trip/${tripId}/budget`);
    } catch (error) {
      console.error(error);
      alert('지출 수정 중 오류가 발생했습니다.');
    }
  };

  const handleSubmitWithReceipt = async () => {
    if (!tripId || !receiptUrl || !items) return;

    const payload = {
      ...buildPayload(),
      receiptUrl,
      items: items.map((it) => ({
        name: it.name,
        amount: typeof it.amount === 'string' ? Number(it.amount) : it.amount,
      })),
    };

    try {
      await editExpense(Number(tripId), Number(expenseId), payload);
      queryClient.invalidateQueries({ queryKey: ['expenseDetail', tripId, expenseId] });
      queryClient.invalidateQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      alert('지출이 성공적으로 수정되었습니다.');
      router.push(`/trip/${tripId}/budget`);
    } catch (error) {
      console.error(error);
      alert('지출 수정 중 오류가 발생했습니다.');
    }
  };

  /* ───────────────────────────
   *  렌더링
   * ─────────────────────────── */

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard
        amount={form.expense.amount}
        setAmount={(v) => handleExpenseChange('amount', v)}
        currency={form.expense.currency}
        setCurrency={(v) => handleExpenseChange('currency', v)}
        exchangeRates={pageData.exchangeRates}
        setExchangeRate={(v) => handleExpenseChange('exchangeRate', v)}
        availCurrencies={['KRW', 'USD']}
        mode="expense"
      />

      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection
          date={form.expense.date}
          setDate={(v) => handleExpenseChange('date', v)}
          startDate={pageData.settledDates[0]}
          endDate={pageData.settledDates.at(-1) ?? ''}
        />

        <PaymentMethodSection
          paymentMethod={form.expense.paymentMethod}
          setPaymentMethod={(v) => handleExpenseChange('paymentMethod', v)}
        />

        <NameSection
          expenseName={form.expense.expenseName}
          setExpenseName={(v) => handleExpenseChange('expenseName', v)}
        />

        <MemoSection
          expenseMemo={form.expense.expenseMemo}
          setExpenseMemo={(v) => handleExpenseChange('expenseMemo', v)}
        />

        <CategorySection category={form.expense.category} setCategory={(v) => handleExpenseChange('category', v)} />

        {isReceiptMode && (
          <ReceiptDetailSection
            items={
              items?.map((it, index) => ({
                id: index,
                name: it.name,
                amount: it.amount,
              })) ?? []
            }
          />
        )}

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

      <div className="flex items-center justify-center w-full py-5">
        <Button label="수정하기" enabled={true} onClick={isReceiptMode ? handleSubmitWithReceipt : handleSubmit} />
      </div>
    </div>
  );
}
