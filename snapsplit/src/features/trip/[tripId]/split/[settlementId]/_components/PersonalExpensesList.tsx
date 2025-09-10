import Divider from '@/shared/components/Divider';
import Image from 'next/image';
import arrow from '@public/svg/arrow-right-grey-550.svg';
import Link from 'next/link';

export type Expense = {
  memberId: number;
  name: string;
  amount: number;
  memberType?: string;
};

export interface PersonalExpensesListProps {
  settlementId: string;
  expenses: Expense[];
  totalAmount: number;
  tripId: string;
}

export interface PersonalExpensesItemProps {
  settlementId: string;
  expense: Expense;
  tripId: string;
}

const PersonalExpensesItem = ({ expense, settlementId, tripId }: PersonalExpensesItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <span>{expense.name}</span>
      <div className="flex items-center">
        <p>{expense.amount?.toLocaleString()}원</p>
        <Link
          href={{
            pathname: `${settlementId}/${expense.memberId}`,
            query: { name: expense.name, tripId: tripId },
          }}
          className="cursor-pointer"
        >
          <Image src={arrow} alt="arrow" />
        </Link>
      </div>
    </div>
  );
};

export default function PersonalExpensesList({
  settlementId,
  expenses = [],
  totalAmount = 0,
  tripId,
}: PersonalExpensesListProps) {
  return (
    <>
      <h2 className="text-label-1">개별 지출 금액</h2>
      <div className="flex flex-col gap-3 w-full bg-white p-4 rounded-xl">
        {expenses.map((expense, idx) => (
          <PersonalExpensesItem key={idx} expense={expense} settlementId={settlementId} tripId={tripId} />
        ))}

        <Divider p="py-[0.5px]" className="my-1" />

        <div className="flex justify-between items-center">
          <label>총 지출 합계</label>
          <div className="flex items-center pr-6">
            <p>{totalAmount.toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </>
  );
}
