'use client';

import SplitRow from './payment/SplitRow';
import type { MemberState } from '../ExpenseForm';

type SplitSectionProps = {
  currency: string;
  totalAmount: number; // [추가] 총 지출 금액
  members: { memberId: number; name: string; memberType: string }[];
  membersState: Record<number, MemberState>;
  handleCheck: (id: number, key: 'isPayer' | 'isSplitter') => void;
  updateAmount: (id: number, key: 'payAmount' | 'splitAmount', value: number | null) => void;
};

export default function SplitSection({
  currency,
  totalAmount,
  members,
  membersState,
  handleCheck,
  updateAmount,
}: SplitSectionProps) {
  const handleNSplit = () => {
    // 1. 공동 경비 멤버 찾기
    const sharedFundMember = members.find((m) => m.memberType === 'SHARED_FUND');
    const sharedFundId = sharedFundMember?.memberId;

    // 2. 공동 경비가 결제한 금액 계산
    const sharedFundPayment = sharedFundId ? membersState[sharedFundId]?.payAmount || 0 : 0;

    // 3. N빵 대상 금액 (총 금액 - 공동경비 결제액)
    const targetAmount = totalAmount - sharedFundPayment;

    if (targetAmount <= 0) {
      alert('나눌 금액이 없습니다.');
      return;
    }

    // 4. 선택된 정산자 필터링 (공동경비 제외, 체크된 사람만)
    const selectedSplitters = members.filter(
      (m) => m.memberType !== 'SHARED_FUND' && membersState[m.memberId]?.isSplitter
    );

    const count = selectedSplitters.length;
    if (count === 0) {
      alert('정산자를 최소 1명 이상 선택해주세요.');
      return;
    }

    // [추가] 4-1. 선택되지 않은 정산자들의 금액을 0원으로 초기화
    const unselectedSplitters = members.filter(
      (m) => m.memberType !== 'SHARED_FUND' && !membersState[m.memberId]?.isSplitter
    );

    unselectedSplitters.forEach((member) => {
      updateAmount(member.memberId, 'splitAmount', 0);
    });

    // 5. 금액 분배 로직
    // 소수점 처리를 위해 정수화 -> 계산 -> 다시 복원 방식을 사용
    const amountStr = targetAmount.toString();
    // 소수점 이하 자리수 계산
    const decimalPlaces = amountStr.includes('.') ? amountStr.split('.')[1].length : 0;
    const multiplier = Math.pow(10, decimalPlaces);

    // 정수화 (예: 123.45 * 100 = 12345)
    const scaledTotal = Math.round(targetAmount * multiplier);

    // 몫과 나머지 계산
    const scaledBase = Math.floor(scaledTotal / count); // 1인당 기본 금액 (정수)
    const remainder = scaledTotal % count; // 남는 금액 (나머지)

    // 분배 및 적용
    selectedSplitters.forEach((member, index) => {
      // 기본 금액에, 인덱스가 나머지보다 작으면 1을 더해줌 (앞에서부터 1씩 분배)
      let currentScaledAmount = scaledBase;
      if (index < remainder) {
        currentScaledAmount += 1;
      }

      // 다시 원래 단위로 복구
      const finalAmount = currentScaledAmount / multiplier;

      // 상태 업데이트
      updateAmount(member.memberId, 'splitAmount', finalAmount);
    });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span>정산</span>
          {/* [추가] N빵하기 버튼 */}
          <button
            onClick={handleNSplit}
            className="px-2 py-0.5 text-xs font-medium text-primary bg-orange-100 rounded-md active:bg-orange-200 transition-colors"
          >
            N빵하기
          </button>
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
