'use client';
import Button from '@/shared/components/Button';
import ExpenseInputCard from '@/features/trip/[tripId]/budget/expense/_components/expense-form/ExpenseInputCard';
import PaySection from '@/features/trip/[tripId]/budget/expense/_components/expense-form/PaySection';
import SplitSection from '@/features/trip/[tripId]/budget/expense/_components/expense-form/SplitSection';
import ReceiptAnalysisSection from '@/features/trip/[tripId]/budget/expense/receipt/_components/receipt-form/ReceiptAnalysisSection';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ReceiptThumbnail from './receipt-form/ReceiptThumbnail';
import { useState, useEffect } from 'react';
import FullScreenModal from '@/shared/components/modal/FullScreenModal';
import ZoomModal from './receipt-form/ZoomModal';
import { ExpensePageDataResponse } from '@/features/trip/[tripId]/budget/expense/api/expense-dto-type';
import { getExpensePageData } from '@/features/trip/[tripId]/budget/expense/api/expense-api';
import { MemberState } from '@/features/trip/[tripId]/budget/expense/_components/ExpenseForm';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';

export default function ReceiptForm() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;
  const searchParams = useSearchParams();
  const date = searchParams.get('date') as string;
  
  const [pageData, setPageData] = useState<ExpensePageDataResponse | null>(null);
  const { ocrResult, receiptUrl, setOcrResult } = useReceiptStore();

  const [zoomOpen, setZoomOpen] = useState(false);

  const handleNext = () => {
    router.push(`/trip/${tripId}/budget/expense?from=receipt`);
  };

  useEffect(() => {
    if (!tripId) return;
    const fetchExpensePageData = async () => {
      try {
        const expensePageData = await getExpensePageData(Number(tripId), date);
        setPageData(expensePageData);
      } catch (error) {
        console.error('지출 초기화 데이터 가져오기 실패 : ', error);
        // TODO: 에러 상태 표시
      }
    };
    fetchExpensePageData();
  }, [tripId]);

  if (!pageData) return null;

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <div className="text-title-1 w-full pb-4">영수증 정보가 맞나요?</div>
      <div className="flex flex-col items-center w-full gap-6">
        <ReceiptThumbnail setZoomOpen={setZoomOpen} receiptUrl={receiptUrl} />
        <ExpenseInputCard
          amount={0}
          setAmount={() => {}}
          currency={pageData.defaultCurrency}
          setCurrency={() => {}}
          availCurrencies={pageData.availCurrencies}
          exchangeRates={pageData.exchangeRates}
          mode="receipt"
        />
        <ReceiptAnalysisSection items={ocrResult?.items || []} setItems={(items) => setOcrResult({ ...ocrResult, items })} />
        <PaySection currency={pageData.defaultCurrency} members={pageData.members} membersState={pageData.members.reduce((acc, member) => {
          acc[member.memberId] = { isPayer: false, isSplitter: false, payAmount: 0, splitAmount: 0 };
          return acc;
        }, {} as Record<number, MemberState>)} handleCheck={() => {}} updateAmount={() => {}} />
        <SplitSection currency={pageData.defaultCurrency} members={pageData.members} membersState={pageData.members.reduce((acc, member) => {
          acc[member.memberId] = { isPayer: false, isSplitter: false, payAmount: 0, splitAmount: 0 };
          return acc;
        }, {} as Record<number, MemberState>)} handleCheck={() => {}} updateAmount={() => {}} />
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
