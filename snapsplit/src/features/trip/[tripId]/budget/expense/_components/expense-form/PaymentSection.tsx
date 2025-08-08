'use client';

import PaymentRow from "./payment/PaymentRow";
import { useExpenseStore } from "@/lib/zustand/useExpenseStore";

export default function PaymentSection() {
  const { members } = useExpenseStore();

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
        <PaymentRow payer={{ memberId: 0, name: "공동경비" }} />
        {members.map((member) => {
          if(member.memberType === 'SHARED_FUND') return null;
          return (
            <PaymentRow key={member.memberId} payer={{ memberId: member.memberId, name: member.name }} />
          );
        })}
      </div>
    </div>
  );
}