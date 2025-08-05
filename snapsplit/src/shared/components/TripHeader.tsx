'use client';

import { useState } from 'react';

import Kebab from '@public/svg/kebab-menu.svg';
import Link from 'next/link';
import Image from 'next/image';
import exit from '@public/svg/exit.svg';
import plus3Black from '@public/svg/plus-3-black.svg';
import OverlayModal from '@/shared/components/modal/OverlayModal';
import AddMemberModal from '@trip/[tripId]/budget/_components/modal/addMemberModal';
import BottomSheet from './bottom-sheet/BottomSheet';
import close from '@public/svg/close-grey-550.svg';
import Button from '@/shared/components/Button';

// 케밥 메뉴 바텀 시트
interface KebabMenuBottomSheetProps {
  onCloseMenu: () => void;
  onDeleteTrip: () => void;
  tripId: string;
}

const KebabMenuBottomSheet = ({ onCloseMenu, onDeleteTrip, tripId }: KebabMenuBottomSheetProps) => {
  return (
    <div className="flex flex-col w-full justify-start text-body-3">
      <Link href={`/trip/${tripId}/edit/country`} className="py-3" onClick={onCloseMenu}>
        여행지 수정
      </Link>
      <Link href={`/trip/${tripId}/edit/date`} className="py-3" onClick={onCloseMenu}>
        여행 일정 수정
      </Link>
      <Link href={`/trip/${tripId}/edit/name`} className="py-3" onClick={onCloseMenu}>
        여행명 및 대표 사진 수정
      </Link>
      <button
        className="py-3 text-left cursor-pointer"
        onClick={() => {
          onCloseMenu();
          onDeleteTrip();
        }}
      >
        여행 삭제
      </button>
    </div>
  );
};

// 여행 삭제 모달
interface DeleteTripModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteTripModal = ({ onClose, onDelete }: DeleteTripModalProps) => (
  <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
    <div className="flex items-end justify-end pb-2 w-full">
      <button onClick={onClose} className="cursor-pointer">
        <Image src={close} alt="close" />
      </button>
    </div>
    <span className="text-title-1 pb-6">정말 여행을 삭제하시겠습니까?</span>
    <div className="flex gap-3 w-full">
      <Button label="아니요" bg="bg-grey-650" onClick={onClose} />
      <Button
        label="네"
        bg="bg-primary"
        onClick={() => {
          onDelete(); /* 삭제 API */
          onClose();
        }}
      />
    </div>
  </div>
);

type TripHeaderProps = {
  tripId: string;
};

// 여행 공통 헤더
const TripHeader = ({ tripId }: TripHeaderProps) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);

  return (
    <>
      <header className="px-5 py-3 flex justify-between">
        <Link href="/home">
          <Image src={exit} alt="exit" aria-label="홈으로" />
        </Link>

        <div className="flex flex-row space-x-3 items-center justify-center">
          <button
            className="flex flex-row rounded-[20px] border-1 p-[2px] pr-2 cursor-pointer text-sm items-center justify-center"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <Image src={plus3Black} alt="동행추가" />
            동행
          </button>
          <button className="cursor-pointer" onClick={() => setIsMenuModalOpen(true)}>
            <Image src={Kebab} alt="menu" />
          </button>
        </div>
      </header>

      {/* 동행 추가 바텀시트 */}
      <OverlayModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} position="bottom">
        <AddMemberModal onClose={() => setIsAddMemberModalOpen(false)} />
      </OverlayModal>

      {/* 케밥 메뉴 바텀시트 */}
      <BottomSheet isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)}>
        <KebabMenuBottomSheet
          onCloseMenu={() => setIsMenuModalOpen(false)}
          onDeleteTrip={() => setIsDeleteTripModalOpen(true)}
          tripId={tripId}
        />
      </BottomSheet>

      {/* 여행 삭제 모달 */}
      <OverlayModal
        isOpen={isDeleteTripModalOpen}
        onClose={() => {
          setIsDeleteTripModalOpen(false);
        }}
        position="center"
      >
        <DeleteTripModal onClose={() => setIsDeleteTripModalOpen(false)} onDelete={() => {}} />
      </OverlayModal>
    </>
  );
};

export default TripHeader;
