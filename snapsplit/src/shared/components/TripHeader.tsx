'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

import { getTripCodeData } from '@trip/[tripId]/api/trip-api';
import { GetTripCodeDto } from '@trip/[tripId]/types/trip-type';
import { deleteTrip } from '@trip/[tripId]/edit/api/edit-trip-api';

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
  isDeleting: boolean;
}

const DeleteTripModal = ({ onClose, onDelete, isDeleting }: DeleteTripModalProps) => (
  <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
    <div className="flex items-end justify-end pb-2 w-full">
      <button onClick={onClose} className="cursor-pointer" disabled={isDeleting}>
        <Image src={close} alt="close" />
      </button>
    </div>
    <span className="text-title-1 pb-6">정말 여행을 삭제하시겠습니까?</span>
    <div className="flex gap-3 w-full">
      <Button label="아니요" bg="bg-grey-650" onClick={onClose} enabled={!isDeleting} />
      <Button
        label="네"
        bg="bg-primary"
        onClick={onDelete} // '네' 버튼 클릭 시 onDelete (mutate 함수) 실행
        enabled={!isDeleting} // 삭제 중일 때 버튼 비활성화
      />
    </div>
  </div>
);

type TripHeaderProps = {
  tripId: string;
};

const TripHeader = ({ tripId }: TripHeaderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient(); // 쿼리 무효화를 위한 클라이언트

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);

  // 여행 코드 조회
  const {
    data: tripCodeData,
    isFetching, // isLoading 대신 isFetching 사용 (재요청 시에도 로딩 상태 표시)
    isError,
  } = useQuery<GetTripCodeDto, Error>({
    queryKey: ['tripCode', tripId],
    queryFn: ({ signal }) => getTripCodeData(tripId, signal), // 3. signal 전달
    // 4. 모달이 열렸을 때만 쿼리를 실행하도록 설정
    enabled: isAddMemberModalOpen && !!tripId,
    // 5. 캐싱 관련 옵션 추가 (성능 최적화)
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  });

  // 여행 삭제
  const { mutate: deleteTripMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTrip(tripId), // 삭제를 실행할 함수
    onSuccess: () => {
      alert('여행이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      router.push('/home');
    },
    onError: (error) => {
      alert('여행 삭제에 실패했습니다. 다시 시도해주세요.');
      console.log(error);
    },
  });

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
        <AddMemberModal
          onClose={() => setIsAddMemberModalOpen(false)}
          tripCode={tripCodeData?.tripCode}
          isLoading={isFetching}
          isError={isError}
        />
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
      <OverlayModal isOpen={isDeleteTripModalOpen} onClose={() => setIsDeleteTripModalOpen(false)} position="center">
        <DeleteTripModal
          onClose={() => setIsDeleteTripModalOpen(false)}
          onDelete={deleteTripMutation} // 6. mutate 함수를 onDelete prop으로 전달
          isDeleting={isDeleting} // 7. 삭제 진행 중 상태 전달 (버튼 비활성화 등)
        />
      </OverlayModal>
    </>
  );
};

export default TripHeader;
