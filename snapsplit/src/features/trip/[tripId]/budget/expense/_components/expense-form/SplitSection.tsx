'use client';

import SplitRow from "./payment/SplitRow";
import { useExpenseStore } from "@/lib/zustand/useExpenseStore";

export default function SplitSection() {
  const members = useExpenseStore((s) => s.members);

  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <div className="flex items-center justify-between w-full">
        <div>정산</div>
        <div className="flex items-center text-center">
          <div className="w-20">정산포함</div>
          <div className="w-20">부담금액</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        {members.map((member) => {
          if(member.memberType === 'SHARED_FUND') return null;
          return (
            <SplitRow key={member.memberId} splitter={{ memberId: member.memberId, name: member.name }} />
          );
        })}
      </div>
    </div>
  );
}