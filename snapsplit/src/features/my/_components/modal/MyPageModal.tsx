'use client';

import Image from 'next/image';
import Button from '@/shared/components/Button';

type MyPageModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  mode: 'logOut' | 'withdraw';
};

export default function MyPageModal({ onClose, onConfirm, mode }: MyPageModalProps) {
  return (
    <div className="w-full px-5">
      <div className="flex flex-col items-center w-full gap-2 px-5 py-6 bg-white rounded-xl">
        <div className="flex items-center w-full">
          <button onClick={onClose} className="cursor-pointer ml-auto">
            <Image src="/svg/exit-grey.svg" alt="exit" aria-label="닫기" width={24} height={24} />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-6">
          <p className="text-title-1">{mode === 'logOut' ? '로그아웃 할까요?' : '정말 탈퇴하시겠습니까?'}</p>
          <div className="flex items-center justify-between w-full gap-3">
            <Button label="아니요" bg="bg-grey-650" onClick={onClose} />
            <Button label="네" bg="bg-primary" onClick={() => {onClose(); onConfirm();}} />
          </div>
        </div>
      </div>
    </div>
  );
}
