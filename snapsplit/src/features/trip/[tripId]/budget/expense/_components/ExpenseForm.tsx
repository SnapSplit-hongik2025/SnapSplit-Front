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
import alert from '@public/svg/alert-circle-red.svg';
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

  // 1. 영수증 없는 일반 지출 등록 Mutation
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

  // 2. 영수증 포함 지출 등록 Mutation
  // refinedForm의 타입을 DTO에 맞게 정의하면 더 좋습니다. (현재 any)
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
  // [추가] 실시간 금액 검증 및 에러 메시지 생성 로직
  // --------------------------------------------------------------------------

  // 1. 결제자(Payer) 검증 데이터
  const selectedPayers = Object.entries(membersState).filter(([_, m]) => m.isPayer);
  const totalPayerAmount = selectedPayers.reduce((sum, [_, m]) => sum + (m.payAmount || 0), 0);
  const payerDiff = form.expense.amount - totalPayerAmount;

  // 2. 공동 경비 멤버 ID 찾기 및 결제 금액 계산
  const sharedFundMember = pageData?.members.find((member) => member.memberType === 'SHARED_FUND');
  const sharedFundMemberId = sharedFundMember?.memberId;
  const sharedFundPayment = sharedFundMemberId
    ? selectedPayers
        .filter(([id, _]) => Number(id) === sharedFundMemberId)
        .reduce((sum, [_, m]) => sum + (m.payAmount || 0), 0)
    : 0;

  // 3. 정산자(Splitter) 검증 데이터
  // 정산 필요 금액 = 전체 지출 금액 - 공동경비가 낸 금액
  const requiredSplitAmount = form.expense.amount - sharedFundPayment;
  const selectedSplitters = Object.entries(membersState).filter(([_, m]) => m.isSplitter);
  const totalSplitAmount = selectedSplitters.reduce((sum, [_, m]) => sum + (m.splitAmount || 0), 0);
  const splitDiff = requiredSplitAmount - totalSplitAmount;

  const getValidationError = () => {
    // 0. 초기 상태(0원)일 때는 에러 표시 안 함
    if (form.expense.amount === 0) return null;

    // 1. 결제자 금액 불일치
    if (payerDiff !== 0) {
      const status = payerDiff > 0 ? '부족' : '초과';
      return `결제 금액이 ${Math.abs(payerDiff).toLocaleString()}${getSymbol(form.expense.currency)} ${status}합니다`;
    }

    // 2. 정산자 금액 불일치 (정산 대상 금액이 있을 때만)
    if (requiredSplitAmount > 0 && splitDiff !== 0) {
      const status = splitDiff > 0 ? '부족' : '초과';
      return `정산자 금액이 ${Math.abs(splitDiff).toLocaleString()}${getSymbol(form.expense.currency)} ${status}합니다`;
    }

    // 3. 최소 인원 선택 검증
    if (selectedPayers.length === 0) return '결제자를 최소 1명 이상 선택해주세요.';
    if (requiredSplitAmount > 0 && selectedSplitters.length === 0) return '정산자를 최소 1명 이상 선택해주세요.';

    return null;
  };

  const validationErrorMessage = getValidationError();
  const isSubmitting = isCreating || isCreatingWithReceipt;

  // 폼 완전성 체크 - 필수 필드들이 모두 채워졌는지 확인
  const isFormComplete = Boolean(
    form.expense.date &&
      form.expense.amount > 0 &&
      form.expense.currency &&
      form.expense.exchangeRate > 0 &&
      form.expense.category &&
      form.expense.paymentMethod
  );

  const isFormValid = isFormComplete && !validationErrorMessage;

  const handleSubmit = () => {
    if (!tripId) return;

    // 공동 경비 예산 체크 (환전 적용)
    if (budgetData?.sharedFund && pageData?.exchangeRates) {
      const sharedFundCurrency = budgetData.sharedFund.defaultCurrency;
      const expenseCurrency = form.expense.currency;

      let expenseAmountInSharedFundCurrency = form.expense.amount;

      // 통화가 다를 경우 환전 적용
      if (sharedFundCurrency !== expenseCurrency) {
        const exchangeRate = pageData.exchangeRates[expenseCurrency];
        if (exchangeRate) {
          expenseAmountInSharedFundCurrency = form.expense.amount * exchangeRate;
        } else {
          alert(`${expenseCurrency} 통화의 환율 정보를 찾을 수 없습니다.`);
          return;
        }
      }

      if (expenseAmountInSharedFundCurrency > budgetData.sharedFund.balance) {
        alert(
          `지출 금액(${form.expense.amount.toLocaleString()} ${expenseCurrency})이 공동 경비 예산(${budgetData.sharedFund.balance.toLocaleString()} ${sharedFundCurrency})을 초과합니다.`
        );
        return;
      }
    }

    // payers/splitters 검증
    // 결제자 최소 1명 검증
    if (selectedPayers.length === 0) {
      alert('결제자를 최소 1명 이상 선택해주세요.');
      return;
    }

    // 결제 금액 총합 검증
    if (totalPayerAmount !== form.expense.amount) {
      alert(
        `결제 금액 총합(${totalPayerAmount.toLocaleString()}${getSymbol(form.expense.currency)})이 지출 금액(${form.expense.amount.toLocaleString()}${getSymbol(form.expense.currency)})과 일치하지 않습니다.`
      );
      return;
    }

    // 공동 경비 멤버 ID 찾기
    // (위에서 계산된 변수 사용)

    // 공동 경비 결제 금액 계산 (memberType이 SHARED_FUND인 멤버가 결제자로 선택된 경우)
    // (위에서 계산된 변수 사용)

    // 정산 필요 금액 계산
    // (위에서 계산된 변수 사용)

    // 정산자 검증 (정산 필요 금액이 1원 이상일 경우)
    if (requiredSplitAmount > 0 && selectedSplitters.length === 0) {
      alert('정산자를 최소 1명 이상 선택해주세요.');
      return;
    }

    // 정산 금액 총합 검증
    if (totalSplitAmount !== requiredSplitAmount) {
      alert(
        `정산 금액 총합(${totalSplitAmount.toLocaleString()}${getSymbol(form.expense.currency)})이 정산 대상 금액(${requiredSplitAmount.toLocaleString()}${getSymbol(form.expense.currency)})과 일치하지 않습니다.`
      );
      return;
    }

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
    if (!tripId || !receiptUrl || !items) return;

    // 공동 경비 예산 체크 (환전 적용)
    if (budgetData?.sharedFund && pageData?.exchangeRates) {
      const sharedFundCurrency = budgetData.sharedFund.defaultCurrency;
      const expenseCurrency = form.expense.currency;

      let expenseAmountInSharedFundCurrency = form.expense.amount;

      // 통화가 다를 경우 환전 적용
      if (sharedFundCurrency !== expenseCurrency) {
        const exchangeRate = pageData.exchangeRates[expenseCurrency];
        if (exchangeRate) {
          expenseAmountInSharedFundCurrency = form.expense.amount * exchangeRate;
        } else {
          alert(`${expenseCurrency} 통화의 환율 정보를 찾을 수 없습니다.`);
          return;
        }
      }

      if (expenseAmountInSharedFundCurrency > budgetData.sharedFund.balance) {
        alert(
          `지출 금액(${form.expense.amount.toLocaleString()} ${expenseCurrency})이 공동 경비 예산(${budgetData.sharedFund.balance.toLocaleString()} ${sharedFundCurrency})을 초과합니다.`
        );
        return;
      }
    }

    // payers/splitters 검증
    // 결제자 최소 1명 검증
    if (selectedPayers.length === 0) {
      alert('결제자를 최소 1명 이상 선택해주세요.');
      return;
    }

    // 결제 금액 총합 검증
    if (totalPayerAmount !== form.expense.amount) {
      alert(
        `결제 금액 총합(${totalPayerAmount.toLocaleString()}${getSymbol(form.expense.currency)})이 지출 금액(${form.expense.amount.toLocaleString()}${getSymbol(form.expense.currency)})과 일치하지 않습니다.`
      );
      return;
    }

    // 공동 경비 결제 금액 계산 (멤버 ID 4번이 공동 경비)
    // (위에서 계산된 변수 사용)

    // 정산 필요 금액 계산
    // (위에서 계산된 변수 사용)

    // 정산자 검증 (정산 필요 금액이 1원 이상일 경우)
    if (requiredSplitAmount > 0 && selectedSplitters.length === 0) {
      alert('정산자를 최소 1명 이상 선택해주세요.');
      return;
    }

    // 정산 금액 총합 검증
    if (totalSplitAmount !== requiredSplitAmount) {
      alert(
        `정산 금액 총합(${totalSplitAmount.toLocaleString()}${getSymbol(form.expense.currency)})이 정산 대상 금액(${requiredSplitAmount.toLocaleString()}${getSymbol(form.expense.currency)})과 일치하지 않습니다.`
      );
      return;
    }

    const refinedForm = {
      // (타입은 실제 DTO에 맞게 설정 권장)
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
        <CategorySection category={form.expense.category} setCategory={(c) => handleExpenseChange('category', c)} />
        {/* 영수증에서 온 경우 영수증 상세 항목 */}
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

      {/* ✅ 6. 제출 버튼 (로딩 상태 반영 및 에러 메시지 표시) */}
      <div className="flex flex-col items-center justify-center w-full py-5 gap-3">
        {/* 에러 메시지 렌더링 */}
        {validationErrorMessage && (
          <div className="flex flex-row gap-1 items-center justify-center w-full px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
            <Image src={alert} alt="error" width={24} height={24} />
            <span className="text-body-3 text-status_error font-medium">{validationErrorMessage}</span>
          </div>
        )}

        <Button
          label={isSubmitting ? '저장 중...' : '추가하기'}
          onClick={isFromReceipt ? handleSubmitWithReceipt : handleSubmit}
          enabled={!isSubmitting && isFormValid} // 로딩 중 및 폼 미완성(금액 오류 포함) 시 비활성화
        />
      </div>
    </div>
  );
}
