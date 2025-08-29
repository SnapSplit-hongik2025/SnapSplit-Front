'use client';

import Link from 'next/link';
import CurrentTripList from './CurrentTripList';
import OverlayModal from '@/shared/components/modal/OverlayModal';
import JoinTripByCodeModal from './modal/JoinTripByCodeModal';
import { useState } from 'react';
import { CreateTripSectionProps } from '../types/home-type';
import { getDaysUntilTrip } from '@/shared/utils/DatetoDay/getDaysUntilTrip';

const CreateTripSection = ({ upcomingTrips, ongoingTrips }: CreateTripSectionProps) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const openJoinModal = () => setIsJoinModalOpen(true);
  const closeJoinModal = () => setIsJoinModalOpen(false);

  // 둘 중 하나라도 길이가 0 이상이면 렌더링
  const hasOngoing = ongoingTrips && ongoingTrips.length > 0;
  const hasUpcoming = upcomingTrips && upcomingTrips.length > 0;
  const hasCurrentTrips = hasOngoing || hasUpcoming;

  return (
    <section className="flex flex-col w-full pb-4 pt-2 rounded-b-3xl gap-5 bg-white">
      <span className="text-head-1 flex-auto px-5">
        {hasOngoing ? (
          <>
            지금 여행 중이시군요!
            <br /> 오늘도 즐거운 여행 되세요
          </>
        ) : hasUpcoming ? (
          <>
            {upcomingTrips[0].tripName}
            <br /> 여행이 {getDaysUntilTrip(upcomingTrips[0].startDate)}일 남았어요!
          </>
        ) : (
          <>
            스냅스플릿과 함께
            <br /> 재밌는 여행을 떠나볼까요?
          </>
        )}
      </span>
      {hasCurrentTrips && <CurrentTripList upcomingTrips={upcomingTrips} ongoingTrips={ongoingTrips} />}
      <div className="flex flex-col w-full gap-4 px-5">
        <Link href="/trip/createTrip" className="flex bg-primary py-[14px] px-5 justify-center text-grey-50 rounded-xl">
          여행 등록하기
        </Link>
        <button
          className="flex justify-center underline text-grey-550 text-body-2 items-center cursor-pointer"
          onClick={openJoinModal}
        >
          코드로 여행 참여하기
        </button>
      </div>
      <OverlayModal isOpen={isJoinModalOpen} onClose={closeJoinModal} position="center" className="px-5">
        <JoinTripByCodeModal onClose={closeJoinModal} />
      </OverlayModal>
    </section>
  );
};

export default CreateTripSection;
