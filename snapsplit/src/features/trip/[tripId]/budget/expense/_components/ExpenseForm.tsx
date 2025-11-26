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
import alertIcon from '@public/svg/alert-circle-red.svg';
import Image from 'next/image';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createExpense, createExpenseWithReceipt, getExpensePageData } from '../api/expense-api';
import { getTripBudgetData } from '../../api/budget-api';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import ReceiptDetailSection from './expense-form/ReceiptDetailSection';
import type {
  CreateExpenseRequest,
  CreateExpenseRequestWithReceipt,
  ExpensePageDataResponse,
} from '../api/expense-dto-type';
import { GetTripBudgetDto } from '../../types/budget-dto-type';
import Loading from '@/shared/components/loading/Loading';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getSymbol } from '@/shared/utils/currency';
import errorIcon from '@public/svg/alert-circle-red.svg';

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

  const from = searchParams.get('from');
  const isFromReceipt = from === 'receipt';
  const { ocrResult, clearReceiptData, receiptUrl, items } = useReceiptStore();

  const [pageData, setPageData] = useState<ExpensePageDataResponse | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: budgetData } = useQuery<GetTripBudgetDto>({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
  });

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

  const [membersState, setMembersState] = useState<Record<number, MemberState>>({});

  const toggle = (id: number, key: 'isPayer' | 'isSplitter') => {
    setMembersState((prev) => {
      const nextState = { ...prev };
      const isNowChecked = !prev[id][key];

      nextState[id] = { ...prev[id], [key]: isNowChecked };

      if (key === 'isSplitter') {
        if (!isNowChecked) {
          nextState[id].splitAmount = 0;
        }

        if (pageData?.members) {
          const sharedFundMember = pageData.members.find((m) => m.memberType === 'SHARED_FUND');
          const sharedFundId = sharedFundMember?.memberId;
          const sharedFundPayment = sharedFundId ? nextState[sharedFundId]?.payAmount || 0 : 0;

          let targetAmount = form.expense.amount - sharedFundPayment;
          targetAmount = Math.round(targetAmount * 10000) / 10000;

          const activeSplitters = pageData.members.filter(
            (m) => m.memberType !== 'SHARED_FUND' && nextState[m.memberId].isSplitter
          );

          const count = activeSplitters.length;

          if (targetAmount > 0 && count > 0) {
            const amountStr = targetAmount.toString();
            const decimalPlaces = amountStr.includes('.') ? amountStr.split('.')[1].length : 0;
            const multiplier = Math.pow(10, decimalPlaces);

            const scaledTotal = Math.round(targetAmount * multiplier);
            const scaledBase = Math.floor(scaledTotal / count);
            const remainder = scaledTotal % count;

            activeSplitters.forEach((member, index) => {
              let currentScaledAmount = scaledBase;
              if (index < remainder) {
                currentScaledAmount += 1;
              }
              const finalAmount = currentScaledAmount / multiplier;

              nextState[member.memberId] = {
                ...nextState[member.memberId],
                splitAmount: finalAmount,
              };
            });
          } else if (targetAmount <= 0) {
            // [추가] 공동경비가 전액 결제 등으로 나눌 금액이 없으면 정산금액 0원 처리
            activeSplitters.forEach((member) => {
              nextState[member.memberId] = {
                ...nextState[member.memberId],
                splitAmount: 0,
              };
            });
          }
        }
      }

      return nextState;
    });
  };

  const updateAmount = (id: number, key: 'payAmount' | 'splitAmount', value: number | null) => {
    setMembersState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleExpenseChange = <K extends keyof CreateExpenseRequest['expense']>(
    key: K,
    value: CreateExpenseRequest['expense'][K] | null
  ) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, [key]: value },
    }));
  };

  useEffect(() => {
    if (!tripId || !date) return;

    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        setPageData(expensePageData);

        setMembersState(
          expensePageData.members.reduce(
            (acc, member) => {
              acc[member.memberId] = { isPayer: false, isSplitter: false, payAmount: 0, splitAmount: 0 };
              return acc;
            },
            {} as Record<number, MemberState>
          )
        );

        setForm((prev) => ({
          ...prev,
          expense: {
            ...prev.expense,
            currency: expensePageData.defaultCurrency,
            exchangeRate: expensePageData.exchangeRates[expensePageData.defaultCurrency],
          },
        }));

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
              paymentMethod: 'CASH',
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

  const { mutate: createExpenseMutate, isPending: isCreating } = useMutation({
    mutationFn: (refinedForm: CreateExpenseRequest) => createExpense(Number(tripId), refinedForm),

    onSuccess: async () => {
      clearReceiptData();
      await queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      await queryClient.refetchQueries({ queryKey: ['splitData', tripId] });
      router.push(`/trip/${tripId}/budget`);
    },
    onError: (error) => {
      console.error('지출 등록 실패:', error);
      alert('지출 등록 중 오류가 발생했습니다.');
    },
  });

  const { mutate: createExpenseWithReceiptMutate, isPending: isCreatingWithReceipt } = useMutation({
    mutationFn: (refinedForm: CreateExpenseRequestWithReceipt) => createExpenseWithReceipt(Number(tripId), refinedForm),

    onSuccess: async () => {
      clearReceiptData();
      await queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      await queryClient.refetchQueries({ queryKey: ['splitData', tripId] });
      router.push(`/trip/${tripId}/budget`);
    },
    onError: (error) => {
      console.error('지출 등록 실패:', error);
      alert('지출 등록 중 오류가 발생했습니다.');
    },
  });

  // --------------------------------------------------------------------------
  // [실시간 금액 검증 로직]
  // --------------------------------------------------------------------------

  const selectedPayers = Object.entries(membersState).filter(([_, m]) => m.isPayer);
  const totalPayerAmount = selectedPayers.reduce((sum, [_, m]) => sum + (m.payAmount || 0), 0);
  const rawPayerDiff = form.expense.amount - totalPayerAmount;
  const payerDiff = Math.round(rawPayerDiff * 10000) / 10000;

  const sharedFundMember = pageData?.members.find((member) => member.memberType === 'SHARED_FUND');
  const sharedFundMemberId = sharedFundMember?.memberId;
  const sharedFundPayment = sharedFundMemberId
    ? selectedPayers
        .filter(([id, _]) => Number(id) === sharedFundMemberId)
        .reduce((sum, [_, m]) => sum + (m.payAmount || 0), 0)
    : 0;

  let sharedFundErrorMsg: string | null = null;

  if (budgetData?.sharedFund && pageData?.exchangeRates && sharedFundPayment > 0) {
    const sharedFundCurrency = budgetData.sharedFund.defaultCurrency;
    const expenseCurrency = form.expense.currency;
    let paymentAmountInSharedFundCurrency = sharedFundPayment;

    if (sharedFundCurrency !== expenseCurrency) {
      const exchangeRate = pageData.exchangeRates[expenseCurrency];
      if (exchangeRate) {
        paymentAmountInSharedFundCurrency = sharedFundPayment * exchangeRate;
      }
    }

    if (paymentAmountInSharedFundCurrency > budgetData.sharedFund.balance) {
      sharedFundErrorMsg = `공동 경비 결제액이 예산을 초과합니다.`;
    }
  }

  const requiredSplitAmount = form.expense.amount - sharedFundPayment;
  const selectedSplitters = Object.entries(membersState).filter(([_, m]) => m.isSplitter);
  const totalSplitAmount = selectedSplitters.reduce((sum, [_, m]) => sum + (m.splitAmount || 0), 0);
  const rawSplitDiff = requiredSplitAmount - totalSplitAmount;
  const splitDiff = Math.round(rawSplitDiff * 10000) / 10000;

  const getValidationError = () => {
    if (form.expense.amount === 0) return null;

    if (sharedFundErrorMsg) return sharedFundErrorMsg;

    if (payerDiff !== 0) {
      const status = payerDiff > 0 ? '부족' : '초과';
      return `결제 금액이 ${Math.abs(payerDiff).toLocaleString()}${getSymbol(form.expense.currency)} ${status}합니다`;
    }

    // [추가] 공동경비가 전액(또는 그 이상) 결제했는데 정산자가 선택된 경우 에러
    if (requiredSplitAmount <= 0 && selectedSplitters.length > 0) {
      return '전액 공동경비 지출이므로 정산할 금액이 없습니다.';
    }

    if (requiredSplitAmount > 0 && splitDiff !== 0) {
      const status = splitDiff > 0 ? '부족' : '초과';
      return `정산자 금액이 ${Math.abs(splitDiff).toLocaleString()}${getSymbol(form.expense.currency)} ${status}합니다`;
    }

    if (selectedPayers.length === 0) return '결제자를 최소 1명 이상 선택해주세요.';
    // 공동경비 전액 결제가 아닌 경우에만 정산자 최소 선택 확인
    if (requiredSplitAmount > 0 && selectedSplitters.length === 0) return '정산자를 최소 1명 이상 선택해주세요.';

    return null;
  };

  const validationErrorMessage = getValidationError();
  const isSubmitting = isCreating || isCreatingWithReceipt;

  const isFormComplete = Boolean(
    form.expense.date &&
      form.expense.amount > 0 &&
      form.expense.currency &&
      form.expense.exchangeRate > 0 &&
      form.expense.paymentMethod
  );

  const isFormValid = isFormComplete && !validationErrorMessage;

  const handleSubmit = () => {
    setIsSubmitted(true);

    if (!tripId) return;
    if (!form.expense.category) return;
    if (!isFormValid) return;

    const refinedForm: CreateExpenseRequest = {
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

    createExpenseMutate(refinedForm);
  };

  const handleSubmitWithReceipt = () => {
    setIsSubmitted(true);

    if (!tripId || !receiptUrl || !items) return;
    if (!form.expense.category) return;
    if (!isFormValid) return;

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
      receiptUrl,
      items: items.map((item) => ({ name: item.name, amount: Number(item.amount) })),
    };

    createExpenseWithReceiptMutate(refinedForm);
  };

  if (!pageData || !budgetData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
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
        {budgetData.startDate && budgetData.endDate && date && (
          <TripDateSection
            date={form.expense.date}
            setDate={(date) => handleExpenseChange('date', date)}
            startDate={budgetData.startDate}
            endDate={budgetData.endDate}
            settledDates={pageData.settledDates}
          />
        )}

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

        <div className="w-full flex flex-col gap-1">
          <CategorySection category={form.expense.category} setCategory={(c) => handleExpenseChange('category', c)} />
          {isSubmitted && !form.expense.category && (
            <div className="flex pt-1 w-full items-center gap-1 justify-start text-center">
              <Image src={errorIcon} alt="error" width={18} height={18} />
              <span className="flex text-xs text-status_error text-center items-center justify-center">
                지출 카테고리를 선택해주세요.
              </span>
            </div>
          )}
        </div>

        {isFromReceipt && <ReceiptDetailSection items={ocrResult?.items || []} />}

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

      <div className="flex flex-col items-center justify-center w-full py-5 gap-3">
        {validationErrorMessage && (
          <div className="flex flex-row gap-1 items-center justify-center w-full px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
            <Image src={alertIcon} alt="error" width={24} height={24} />
            <span className="text-body-3 text-red-400 font-medium">{validationErrorMessage}</span>
          </div>
        )}

        <Button
          label={isSubmitting ? '저장 중...' : '추가하기'}
          onClick={isFromReceipt ? handleSubmitWithReceipt : handleSubmit}
          enabled={!isSubmitting && isFormValid}
        />
      </div>
    </div>
  );
}
