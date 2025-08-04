'use client';

import { useCurrencySymbol } from '@/shared/utils/useCurrencySymbol';
import ExpenseAmount from './_components/ExpenseAmount';
import ExpenseDetailHeader from './_components/ExpenseDetailHeader';
import ExpenseDetailInfoItem from './_components/ExpenseDetailInfoItem';
import PersonalExpenseItem from './_components/PersonalExpenseItem';
import { ExpenseDetailPageProps, ExpenseDetailData } from './type';
import mock from '@public/mocks/expense-detail.json';
import { mapCategoryToKor } from '@/shared/utils/useCategoryMapper';

export default function ExpenseDetailPage({ tripId }: ExpenseDetailPageProps) {
  const expenseDetail = (mock as { data: ExpenseDetailData }).data;
  const { amount, amountKRW, currency, paymentMethod, date, expenseName, expenseMemo, category, payers, splitters } =
    expenseDetail;
  const korCategory = category ? mapCategoryToKor(category) : '기타';
  // 통화 기호 ($, €, etc.)
  const symbol = useCurrencySymbol(currency);

  return (
    <div className="h-screen w-full flex flex-col">
      <ExpenseDetailHeader tripId={tripId} />

      <div className="flex h-full flex-col w-full overflow-y-auto scrollbar-hide p-5">
        <ExpenseAmount amount={amount} symbol={symbol} amountKRW={amountKRW} />

        <div className="pt-6 space-y-6">
          <ExpenseDetailInfoItem label="여행 일자" value={date} />
          <ExpenseDetailInfoItem label="지출 형태" value={paymentMethod === 'card' ? '카드' : '현금'} />
          <ExpenseDetailInfoItem label="지출명" value={expenseName} />
          <ExpenseDetailInfoItem label="지출 내용 (선택)" value={expenseMemo} />
          <ExpenseDetailInfoItem label="카테고리 (선택)" value={korCategory} />

          {/* 결제자 리스트 */}
          <PersonalExpenseItem
            variant="payers"
            member={payers.map((p) => ({
              memberId: p.memberId,
              name: p.name,
              amount: p.amount,
            }))}
            symbol={symbol}
          />

          {/* 정산자 리스트 */}
          <PersonalExpenseItem
            variant="splitters"
            member={splitters.map((s) => ({
              memberId: s.memberId,
              name: s.name,
              amount: s.amount,
            }))}
            symbol={symbol}
          />
        </div>
      </div>
    </div>
  );
}
