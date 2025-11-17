'use client';

import Image from 'next/image';
import close from '@public/svg/close-grey.svg';
import { useState } from 'react';
import { joinTripByCode } from '../../api/home-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type JoinTripByCodeModalProps = {
  onClose: () => void;
};

export default function JoinTripByCodeModal({ onClose }: JoinTripByCodeModalProps) {
  const [code, setCode] = useState('');
  const queryClient = useQueryClient();

  const isValid = code.length === 8;

  const { mutate, isPending } = useMutation({
    mutationFn: (tripCode: string) => joinTripByCode(tripCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeData'] });
      queryClient.invalidateQueries({ queryKey: ['pastTrips'] });
      onClose();
      alert('여행에 성공적으로 참여했습니다!');
    },
    onError: (error) => {
      console.error('여행 참여 실패:', error);
      alert(`여행 참여에 실패했습니다: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (!isValid || isPending) return;
    mutate(code);
  };

  return (
    <div className="bg-white rounded-xl p-5 pb-6 w-full flex flex-col justify-center items-center">
      <div className="flex w-full justify-end pb-2">
        <button onClick={onClose} className="cursor-pointer" disabled={isPending}>
          <Image src={close} alt="close" />
        </button>
      </div>
      <label className="text-title-1 pb-3">초대코드를 입력해주세요</label>
      <input
        className="w-full border-1 mb-6 text-body-2 border-grey-250 rounded-xl py-[14px] px-4"
        placeholder="영문/숫자 8자리"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={isPending}
        maxLength={8}
      />
      <button
        disabled={!isValid || isPending}
        className={`w-full rounded-xl py-[14px] text-label-1  text-white ${
          isValid && !isPending ? 'bg-primary cursor-pointer' : 'bg-light_green_deep cursor-not-allowed'
        }`}
        onClick={handleSubmit}
      >
        {isPending ? '참여 중...' : '참여하기'}
      </button>
    </div>
  );
}
