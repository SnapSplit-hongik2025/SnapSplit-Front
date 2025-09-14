'use client';

import Image from 'next/image';
import Button from '@/shared/components/Button';
import { useState } from 'react';

type MyPageModalProps = {
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function MyPageModal({ onClose, onConfirm }: MyPageModalProps) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="w-full px-5">
      <div className="flex flex-col items-center w-full gap-2 px-5 py-6 bg-white rounded-xl">
        <div className="flex items-center w-full">
          <button onClick={onClose} className="cursor-pointer ml-auto">
            <Image src="/svg/exit-grey.svg" alt="exit" aria-label="닫기" width={24} height={24} />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-6">
          <p className="text-title-1">로그아웃 할까요?</p>
          <div className="flex items-center justify-between w-full gap-3">
            <Button label="아니요" bg="bg-grey-650" onClick={onClose} enabled={!submitting} />
            <Button
              label="네"
              bg="bg-primary"
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await onConfirm();
                  onClose();
                } catch (e) {
                  console.error('로그아웃 실패:', e);
                  alert('로그아웃 실패');
                } finally {
                  setSubmitting(false);
                }
              }}
              enabled={!submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
