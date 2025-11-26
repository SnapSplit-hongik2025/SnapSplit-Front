/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Button from '@/shared/components/Button';
import ExpenseInputCard from '@/features/trip/[tripId]/budget/expense/_components/expense-form/ExpenseInputCard';
import ReceiptAnalysisSection from '@/features/trip/[tripId]/budget/expense/receipt/_components/receipt-form/ReceiptAnalysisSection';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ReceiptThumbnail from './receipt-form/ReceiptThumbnail';
import { useState, useEffect, useCallback } from 'react';
import { ExpensePageDataResponse } from '@/features/trip/[tripId]/budget/expense/api/expense-dto-type';
import { getExpensePageData } from '@/features/trip/[tripId]/budget/expense/api/expense-api';
import { MemberState } from '@/features/trip/[tripId]/budget/expense/_components/ExpenseForm';
import { OcrResult, ReceiptItem, useReceiptStore } from '@/lib/zustand/useReceiptStore';
import type { CreateExpenseRequest } from '@/features/trip/[tripId]/budget/expense/api/expense-dto-type';
import Loading from '@/shared/components/loading/Loading';

export default function ReceiptForm() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;
  const searchParams = useSearchParams();
  const date = searchParams.get('date') as string;
  const [pageData, setPageData] = useState<ExpensePageDataResponse | null>(null);

  // ✅ Zustand에서 OCR 결과 / 통화정보 관리
  const { ocrResult, receiptUrl, currency, setOcrResult } = useReceiptStore();

  // ✅ form 상태 초기화
  const [form, setForm] = useState<CreateExpenseRequest>({
    expense: {
      date: date,
      amount: 0, // 초기값은 0, useEffect에서 계산됨
      currency: currency,
      exchangeRate: 1,
      category: '',
      expenseName: '',
      expenseMemo: '',
      paymentMethod: 'cash',
    },
    payers: [],
    splitters: [],
  });

  // ✅ 멤버 상태
  const [_, setMembersState] = useState<Record<number, MemberState>>({});

  // ✅ expense 필드 변경
  const handleExpenseChange = useCallback(
    <K extends keyof CreateExpenseRequest['expense']>(key: K, value: CreateExpenseRequest['expense'][K] | null) => {
      setForm((prev) => ({
        ...prev,
        expense: { ...prev.expense, [key]: value },
      }));
    },
    []
  );

  // ✅ OCR item 변경
  const handleItemChange = useCallback(
    (items: ReceiptItem[]) => {
      if (!ocrResult) return;
      setOcrResult({ ...ocrResult, items } as OcrResult);
    },
    [ocrResult, setOcrResult]
  );

  // ✅ 금액 변경 (ReceiptAnalysisSection에서 호출됨)
  const handleAmountChange = useCallback((amount: number) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, amount: amount },
    }));
  }, []);

  // init
  useEffect(() => {
    if (!tripId || !date) return;

    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        console.log('지출 초기화 데이터 : ', expensePageData);
        setPageData(expensePageData);

        // [수정] 초기 로드 시, OCR 아이템들의 합계를 계산하여 amount에 설정
        const initialItems = ocrResult?.items ?? [];
        const calculatedTotal = initialItems.reduce((acc, item) => acc + Number(item.amount || 0), 0);

        setForm((prev) => ({
          ...prev,
          expense: {
            ...prev.expense,
            currency: currency,
            exchangeRate: expensePageData.exchangeRates[currency],
            amount: calculatedTotal, // 계산된 합계 적용
          },
        }));

        setMembersState(
          expensePageData.members.reduce(
            (acc, member) => {
              acc[member.memberId] = { isPayer: false, isSplitter: false, payAmount: 0, splitAmount: 0 };
              return acc;
            },
            {} as Record<number, MemberState>
          )
        );
      } catch (error) {
        console.error('지출 초기화 데이터 가져오기 실패 : ', error);
      }
    };

    fetchExpensePageData();
  }, [tripId, date, currency]); // 의존성 배열에서 ocrResult 등 제거

  const handleNext = () => {
    setOcrResult({
      ...ocrResult,
      totalAmount: form.expense.amount,
      currency: form.expense.currency,
      items: ocrResult?.items ?? [],
      receiptUrl: receiptUrl ?? '',
    });

    // ✅ date를 URL 쿼리로 같이 전달
    router.push(`/trip/${tripId}/budget/expense?from=receipt&date=${date}`);
  };

  if (!pageData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  console.log('[receiptForm] receiptUrl: ', receiptUrl);

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <div className="text-title-1 w-full pb-4">영수증 정보가 맞나요?</div>

      <div className="flex flex-col items-center w-full gap-6">
        <ReceiptThumbnail receiptUrl={receiptUrl} />

        {/* 금액 및 통화 (readOnly 적용) */}
        <ExpenseInputCard
          amount={form.expense.amount}
          setAmount={handleAmountChange} // 내부 로직상 readOnly일 땐 호출되지 않지만 타입 유지를 위해 전달
          currency={form.expense.currency}
          setCurrency={(currency) => handleExpenseChange('currency', currency)}
          availCurrencies={pageData.availCurrencies}
          exchangeRates={pageData.exchangeRates}
          setExchangeRate={(exchangeRate) => handleExpenseChange('exchangeRate', exchangeRate)}
          mode="receipt"
          readOnly={true} // [수정] 입력 불가능하도록 설정
        />

        {/* OCR 분석 항목 */}
        <ReceiptAnalysisSection
          items={ocrResult?.items || []}
          setItems={handleItemChange}
          setAmount={handleAmountChange}
        />
      </div>

      <div className="flex items-center justify-center w-full py-5">
        <Button label="다음으로" onClick={handleNext} enabled={true} />
      </div>
    </div>
  );
}
