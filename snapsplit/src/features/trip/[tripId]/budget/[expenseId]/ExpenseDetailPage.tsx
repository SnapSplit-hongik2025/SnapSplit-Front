'use client';

import { getSymbol } from '@/shared/utils/currency';
import ExpenseAmount from './_components/ExpenseAmount';
import ExpenseDetailHeader from './_components/ExpenseDetailHeader';
import ExpenseDetailInfoItem from './_components/ExpenseDetailInfoItem';
import PersonalExpenseItem from './_components/PersonalExpenseItem';
import { ExpenseDetailPageProps } from './types/expense-detail-type';
import { mapCategoryToKor } from '@/shared/utils/useCategoryMapper';
import { getExpenseDetail } from './api/expense-detail';
import { useQuery } from '@tanstack/react-query';
import ReceiptImg from './_components/ReceiptImg';
import ReceiptItemsSection from './_components/ReceiptItemsSection';
import Loading from '@/shared/components/loading/Loading';

export default function ExpenseDetailPage({ tripId, expenseId }: ExpenseDetailPageProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['expenseDetail', tripId, expenseId],
    queryFn: () => getExpenseDetail(tripId, expenseId),
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  const korCategory = data.category ? mapCategoryToKor(data.category) : '기타';
  const symbol = getSymbol(data.currency);

  return (
    <div className="h-screen w-full flex flex-col">
      <ExpenseDetailHeader tripId={tripId} expenseId={expenseId} />
      <div className="flex h-full flex-col w-full overflow-y-auto scrollbar-hide p-5">
        <ExpenseAmount amount={data.amount} symbol={symbol} amountKRW={data.amountKRW} />
        {data.receiptUrl && <ReceiptImg receiptUrl={data.receiptUrl} />}
        <div className="pt-6 space-y-6">
          <ExpenseDetailInfoItem label="여행 일자" value={data.date} />
          <ExpenseDetailInfoItem label="지출 형태" value={data.paymentMethod === 'CREDIT_CARD' ? '카드' : '현금'} />
          <ExpenseDetailInfoItem label="지출명" value={data.expenseName} />
          <ExpenseDetailInfoItem label="지출 내용 (선택)" value={data.expenseMemo} />
          <ExpenseDetailInfoItem label="카테고리 (선택)" value={korCategory} />
          <PersonalExpenseItem
            variant="payers"
            member={data.payers.map((p) => ({
              memberId: p.memberId,
              name: p.name,
              amount: p.amount,
            }))}
            symbol={symbol}
          />
          <PersonalExpenseItem
            variant="splitters"
            member={data.splitters.map((s) => ({
              memberId: s.memberId,
              name: s.name,
              amount: s.amount,
            }))}
            symbol={symbol}
          />
        </div>
        {data.receiptItems && <ReceiptItemsSection symbol={symbol} receiptItems={data.receiptItems || []} />}
      </div>
    </div>
  );
}
