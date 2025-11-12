'use client';

import PaymentRow from "./payment/PaymentRow";
import type { MemberState } from '../ExpenseForm';

type PaySectionProps = {
  currency: string;
  members: { memberId: number; name: string; memberType: string }[];
  membersState: Record<number, MemberState>;
  handleCheck: (id: number, key: 'isPayer' | 'isSplitter') => void;
  updateAmount: (id: number, key: 'payAmount' | 'splitAmount', value: number) => void;
};

export default function PaySection({ currency, members, membersState, handleCheck, updateAmount }: PaySectionProps) {
  const sharedFund = members.find((member) => member.memberType === 'SHARED_FUND');

  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <div className="flex items-center justify-between w-full">
        <div>결제</div>
        <div className="flex items-center text-center">
          <div className="w-20">결제자</div>
          <div className="w-20">결제 금액</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        {sharedFund && (
          <PaymentRow payer={{ memberId: sharedFund.memberId, name: "공동경비" }} currency={currency} membersState={membersState} handleCheck={handleCheck} updateAmount={updateAmount} />
        )}
        {members.map((member) => {
          if(member.memberType === 'SHARED_FUND') return null;
          return (
            <PaymentRow key={member.memberId} payer={{ memberId: member.memberId, name: member.name }} currency={currency} membersState={membersState} handleCheck={handleCheck} updateAmount={updateAmount} />
          );
        })}
      </div>
    </div>
  );
}