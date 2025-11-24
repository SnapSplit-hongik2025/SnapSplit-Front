'use client';

import { useState } from 'react';
import Image from 'next/image';

import arrow from '@public/svg/arrow-bottom-grey-450.svg';
import { SettlementInfoSectionProps } from '../types/settlement-type';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import MemberPickBottomSheet from './MemberPickBottomSheet';
import SettlementFlowCard from './SettlementFlowCard';

export default function SettlementInfoSection({
  startDay,
  endDay,
  members,
  settlementDetails,
}: SettlementInfoSectionProps) {
  // members가 있을 때만 0번째 멤버의 id로 초기화
  const [selectedMemberId, setSelectedMemberId] = useState<null | number>(
    members && members.length > 0 ? members[0].memberId : null
  );
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const selectedMember = members?.find((m) => m.memberId === selectedMemberId);

  // 선택한 멤버의 보낼 돈/받을 돈 필터링
  const sendList = (settlementDetails ?? []).filter((item) => item.sender.memberId === selectedMemberId);
  const receiveList = (settlementDetails ?? []).filter((item) => item.receiver.memberId === selectedMemberId);

  return (
    <>
      <div className="flex w-full justify-between items-end pb-6">
        <h1 className="text-head-1">
          <span className="text-primary">
            Day {startDay} ~ Day {endDay}
          </span>
          까지의
          <br />
          정산 내역이에요
        </h1>
        <button
          onClick={() => setIsMemberModalOpen(true)}
          className="flex items-center whitespace-nowrap cursor-pointer pl-3 pr-[6px] py-1 rounded-[20px] bg-white border-1 border-grey-250 text-body-2"
        >
          {selectedMember ? selectedMember.name : '멤버 선택'}
          <Image src={arrow} alt="member Pick" width={24} height={24} />
        </button>

        <BottomSheet isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)}>
          <MemberPickBottomSheet
            members={members}
            setSelectedMemberId={setSelectedMemberId}
            selectedMemberId={selectedMemberId}
            onClose={() => setIsMemberModalOpen(false)}
          />
        </BottomSheet>
      </div>
      <SettlementFlowCard className="mb-3" settlementDetails={sendList} type="send" />
      <SettlementFlowCard className="mb-4" settlementDetails={receiveList} type="receive" />
    </>
  );
}
