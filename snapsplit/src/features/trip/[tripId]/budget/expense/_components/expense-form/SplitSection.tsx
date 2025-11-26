'use client';

import SplitRow from './payment/SplitRow';
import type { MemberState } from '../ExpenseForm';

type SplitSectionProps = {
  currency: string;
  // [삭제] totalAmount 제거
  members: { memberId: number; name: string; memberType: string }[];
  membersState: Record<number, MemberState>;
  handleCheck: (id: number, key: 'isPayer' | 'isSplitter') => void;
  updateAmount: (id: number, key: 'payAmount' | 'splitAmount', value: number | null) => void;
};

export default function SplitSection({
  currency,
  members,
  membersState,
  handleCheck,
  updateAmount,
}: SplitSectionProps) {
  // [삭제] handleNSplit 및 관련 로직 제거

  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span>정산</span>
          {/* [삭제] N빵하기 버튼 제거 */}
        </div>
        <div className="flex items-center text-center">
          <div className="w-20">정산포함</div>
          <div className="w-20">부담금액</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        {members.map((member) => {
          if (member.memberType === 'SHARED_FUND') return null;
          return (
            <SplitRow
              key={member.memberId}
              splitter={{ memberId: member.memberId, name: member.name }}
              currency={currency}
              membersState={membersState}
              handleCheck={handleCheck}
              updateAmount={updateAmount}
            />
          );
        })}
      </div>
    </div>
  );
}
