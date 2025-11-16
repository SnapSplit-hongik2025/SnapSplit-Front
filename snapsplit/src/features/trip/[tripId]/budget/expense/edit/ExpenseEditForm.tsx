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

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import { getExpensePageData } from '../api/expense-api';
import { editExpense } from './api/expense-edit-api';
import { getTripBudgetData } from '../../api/budget-api';

import Loading from '@/shared/components/loading/Loading';

import { useEffect, useState } from 'react';
import type { CreateExpenseRequest, CreateExpenseRequestWithReceipt } from '../api/expense-dto-type';
import type { ExpenseDetail, ResponseItem } from './types';
import type { MemberState } from '../_components/ExpenseForm';

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
   * 1) expenseDetail 가져오기 (캐시에서)
   * ─────────────────────────── */
  const expenseDetail: ExpenseDetail | null =
    queryClient.getQueryData(['expenseDetail', tripId, expenseId]) || null;

  const date = expenseDetail?.date ?? null;

  const { data: tripBudgetData } = useQuery({
    queryKey: ['tripBudget', Number(tripId)],
    queryFn: () => getTripBudgetData(Number(tripId)),
  });

  /* ───────────────────────────
   * 2) pageData 불러오기
   * ─────────────────────────── */
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['expensePageData', tripId, date],
    queryFn: () => getExpensePageData(Number(tripId), date!),
    enabled: !!date,
  });

  /* ───────────────────────────
   *  로컬 State들
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

    // 1) memberState 구성
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

    // 2) 기본 form 구성
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

    // 3) 영수증 모드
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
   * Mutation 적용
   * ─────────────────────────── */
  const { mutate: editExpenseMutate, isPending: isEditing } = useMutation({
    mutationFn: (payload: CreateExpenseRequest) =>
      editExpense(Number(tripId), Number(expenseId), payload),

    onSuccess: () => {
      alert('지출이 성공적으로 수정되었습니다.');

      queryClient.invalidateQueries({ queryKey: ['tripBudget', tripId] });

      router.push(`/trip/${tripId}/budget`);
    },

    onError: () => {
      alert('지출 수정 중 오류가 발생했습니다.');
    },
  });

  const { mutate: editExpenseWithReceiptMutate, isPending: isEditingWithReceipt } = useMutation({
    mutationFn: (payload: CreateExpenseRequestWithReceipt) =>
      editExpense(Number(tripId), Number(expenseId), payload),

    onSuccess: () => {
      alert('지출이 성공적으로 수정되었습니다.');

      queryClient.invalidateQueries({ queryKey: ['expenseDetail', tripId, expenseId] });
      queryClient.invalidateQueries({ queryKey: ['tripBudget', tripId] });

      router.push(`/trip/${tripId}/budget`);
    },

    onError: () => {
      alert('지출 수정 중 오류가 발생했습니다.');
    },
  });

  /* ───────────────────────────
   * Payload Builder
   * ─────────────────────────── */
  const buildPayload = (): CreateExpenseRequest => ({
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

  /* ───────────────────────────
   * Submit Handlers
   * ─────────────────────────── */
  const handleSubmit = () => {
    if (!form) return;
    const payload = buildPayload();
    editExpenseMutate(payload);
  };

  const handleSubmitWithReceipt = () => {
    if (!form || !receiptUrl || !items) return;

    const payload = {
      ...buildPayload(),
      receiptUrl,
      items: items.map((it) => ({
        name: it.name,
        amount: typeof it.amount === 'string' ? Number(it.amount) : it.amount,
      })),
    };

    editExpenseWithReceiptMutate(payload);
  };

  /* ───────────────────────────
   * UI 로딩 처리
   * ─────────────────────────── */
  if (!expenseDetail || !form || isPageLoading || !pageData || !tripBudgetData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isSubmitting = isEditing || isEditingWithReceipt;

  /* ───────────────────────────
   *  렌더링
   * ─────────────────────────── */
  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard
        amount={form.expense.amount}
        setAmount={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, amount: v } }))}
        currency={form.expense.currency}
        setCurrency={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, currency: v } }))}
        exchangeRates={pageData.exchangeRates}
        setExchangeRate={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, exchangeRate: v } }))}
        availCurrencies={['KRW', 'USD']}
        mode="expense"
      />

      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection
          date={form.expense.date}
          setDate={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, date: v } }))}
          startDate={tripBudgetData?.startDate}
          endDate={tripBudgetData?.endDate}
        />

        <PaymentMethodSection
          paymentMethod={form.expense.paymentMethod}
          setPaymentMethod={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, paymentMethod: v } }))}
        />

        <NameSection
          expenseName={form.expense.expenseName}
          setExpenseName={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, expenseName: v } }))}
        />

        <MemoSection
          expenseMemo={form.expense.expenseMemo}
          setExpenseMemo={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, expenseMemo: v } }))}
        />

        <CategorySection
          category={form.expense.category}
          setCategory={(v) => setForm((prev) => ({ ...prev!, expense: { ...prev!.expense, category: v } }))}
        />

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
          handleCheck={(id, key) =>
            setMembersState((prev) => ({
              ...prev,
              [id]: { ...prev[id], [key]: !prev[id][key] },
            }))
          }
          updateAmount={(id, key, value) =>
            setMembersState((prev) => ({
              ...prev,
              [id]: { ...prev[id], [key]: value },
            }))
          }
        />

        <SplitSection
          currency={form.expense.currency}
          members={pageData.members}
          membersState={membersState}
          handleCheck={(id, key) =>
            setMembersState((prev) => ({
              ...prev,
              [id]: { ...prev[id], [key]: !prev[id][key] },
            }))
          }
          updateAmount={(id, key, value) =>
            setMembersState((prev) => ({
              ...prev,
              [id]: { ...prev[id], [key]: value },
            }))
          }
        />
      </div>

      <div className="flex items-center justify-center w-full py-5">
        <Button
          label={isSubmitting ? '저장 중...' : '수정하기'}
          enabled={!isSubmitting}
          onClick={isReceiptMode ? handleSubmitWithReceipt : handleSubmit}
        />
      </div>
    </div>
  );
}
