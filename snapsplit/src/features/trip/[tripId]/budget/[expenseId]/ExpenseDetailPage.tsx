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

export default function ExpenseDetailPage({ tripId, expenseId }: ExpenseDetailPageProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['expenseDetail', tripId, expenseId],
    queryFn: () => getExpenseDetail(tripId, expenseId),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }
  const mock = {
    receiptItems: [
      { name: 'COLES STRAWB YOGHURT 1KG', amount: 4 },
      { name: 'A2 DAIRY LIGHT MILK 2LITRE', amount: 6.9 },
      { name: 'ANNIES OAT MILK 1LITRE', amount: 2.6 },
      { name: 'IMPERFECT APPLES 2KG', amount: 6.9 },
      { name: 'PREPACK CARROTS 1KG', amount: 1.7 },
      { name: 'BANANAS PERKG', amount: 5.09 },
      { name: 'WHITE PEACHES PERKG', amount: 1.81 },
    ],
  };
  const korCategory = data.category ? mapCategoryToKor(data.category) : '기타';
  const symbol = getSymbol(data.currency);

  // {data.receiptUrl && <ReceiptImg receiptUrl={data.receiptUrl} />}

  return (
    <div className="h-screen w-full flex flex-col">
      <ExpenseDetailHeader tripId={tripId} />
      <div className="flex h-full flex-col w-full overflow-y-auto scrollbar-hide p-5">
        <ExpenseAmount amount={data.amount} symbol={symbol} amountKRW={data.amountKRW} />
        <ReceiptImg
          receiptUrl={
            'https://snapsplit-assets.s3.ap-northeast-2.amazonaws.com/photos/0144acc6-50ce-4f0f-befd-b39fc9bd9b8e_IMG_0003.jpeg'
          }
        />
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
        <ReceiptItemsSection symbol={symbol} receiptItems={mock.receiptItems || []} />
      </div>
    </div>
  );
}
