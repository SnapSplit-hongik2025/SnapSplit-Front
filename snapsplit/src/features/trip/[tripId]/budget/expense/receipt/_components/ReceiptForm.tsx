/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Button from '@/shared/components/Button';
import ExpenseInputCard from '@/features/trip/[tripId]/budget/expense/_components/expense-form/ExpenseInputCard';
import ReceiptAnalysisSection from '@/features/trip/[tripId]/budget/expense/receipt/_components/receipt-form/ReceiptAnalysisSection';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ReceiptThumbnail from './receipt-form/ReceiptThumbnail';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';
import ZoomModal from './receipt-form/ZoomModal';
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
  const [zoomOpen, setZoomOpen] = useState(false);

  // ✅ Zustand에서 OCR 결과 / 통화정보 관리
  const { ocrResult, receiptUrl, currency, setOcrResult, clearReceiptData } = useReceiptStore();

  // ✅ form 상태 초기화
  const [form, setForm] = useState<CreateExpenseRequest>({
    expense: {
      date: date,
      amount: ocrResult?.totalAmount ?? 0,
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
      setOcrResult({ ...ocrResult, items } as OcrResult);
    },
    [ocrResult, setOcrResult]
  );

  // init
  useEffect(() => {
    if (!tripId || !date) return;

    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        setPageData(expensePageData);
        setForm((prev) => ({
          ...prev,
          expense: {
            ...prev.expense,
            currency: currency,
            exchangeRate: expensePageData.exchangeRates[currency],
            amount: ocrResult?.totalAmount ?? 0,
          },
        }));
        console.log('form.amount: ', form.expense.amount);
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
  }, [tripId, date, currency, form, ocrResult]);

  const handleAmountChange = (amount: number) => {
    setForm((prev) => ({
      ...prev,
      expense: { ...prev.expense, amount: amount },
    }));
  };

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
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <div className="text-title-1 w-full pb-4">영수증 정보가 맞나요?</div>

      <div className="flex flex-col items-center w-full gap-6">
        <ReceiptThumbnail setZoomOpen={setZoomOpen} receiptUrl={receiptUrl} />

        {/* 금액 및 통화 */}
        <ExpenseInputCard
          amount={form.expense.amount}
          setAmount={(amount) => handleExpenseChange('amount', amount)}
          currency={form.expense.currency}
          setCurrency={(currency) => handleExpenseChange('currency', currency)}
          availCurrencies={pageData.availCurrencies}
          exchangeRates={pageData.exchangeRates}
          setExchangeRate={(exchangeRate) => handleExpenseChange('exchangeRate', exchangeRate)}
          mode="receipt"
        />

        {/* OCR 분석 항목 */}
        <ReceiptAnalysisSection items={ocrResult?.items || []} setItems={handleItemChange} setAmount={handleAmountChange} />
      </div>

      <div className="flex items-center justify-center w-full py-5">
        <Button label="다음으로" onClick={handleNext} enabled={true} />
      </div>

      {zoomOpen && (
        <FullScreenModal>
          <ZoomModal onClose={() => setZoomOpen(false)} receiptUrl={receiptUrl} />
        </FullScreenModal>
      )}
    </div>
  );
}
