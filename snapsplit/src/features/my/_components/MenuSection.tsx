'use client';

import { useState } from 'react';
import OverlayModal from '@/shared/components/modal/OverlayModal';
import MyPageModal from '@/features/my/_components/modal/MyPageModal';
import { logOut as logOutApi } from '@/features/my/api/my-api';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { useRouter } from 'next/navigation';

export default function MenuSection() {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { logOut: logOutStore } = useAuthStore();
  const router = useRouter();

  const handleLogOut = async () => {
    await logOutApi();
    logOutStore();
    router.push('/');
  };

  const handleWithdraw = async () => {
    // await withdraw();
    // TODO: 회원탈퇴 후 페이지 이동
  };

  return (
    <div className="flex flex-col w-full gap-8 px-4">
      {/* Account Menu */}
      <div className="flex flex-col gap-4 items-start text-label-2">
        <p className="text-body-3 text-grey-550">내 계정</p>
        <button className="cursor-pointer" onClick={() => setIsLogOutModalOpen(true)}>
          로그아웃
        </button>
        <button className="cursor-pointer" onClick={() => setIsWithdrawModalOpen(true)}>
          회원탈퇴
        </button>
      </div>
      {/* Terms Menu */}
      <div className="flex flex-col gap-4 items-start text-label-2">
        <p className="text-body-3 text-grey-550">약관</p>
        <button className="cursor-pointer">오픈소스 라이선스</button>
        <button className="cursor-pointer">이용약관</button>
        <button className="cursor-pointer">개인정보 처리방침</button>
      </div>

      <OverlayModal isOpen={isLogOutModalOpen} onClose={() => setIsLogOutModalOpen(false)} position="center">
        <MyPageModal mode="logOut" onClose={() => setIsLogOutModalOpen(false)} onConfirm={handleLogOut} />
      </OverlayModal>

      <OverlayModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} position="center">
        <MyPageModal mode="withdraw" onClose={() => setIsWithdrawModalOpen(false)} onConfirm={handleWithdraw} />
      </OverlayModal>
    </div>
  );
}
