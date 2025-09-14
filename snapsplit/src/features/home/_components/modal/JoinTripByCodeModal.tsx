'use client';

import Image from 'next/image';
import close from '@public/svg/close-grey.svg';
import { useState } from 'react';
import { joinTripByCode } from '../../api/home-api';

type JoinTripByCodeModalProps = {
  onClose: () => void;
};

export default function JoinTripByCodeModal({ onClose }: JoinTripByCodeModalProps) {
  const [code, setCode] = useState('');

  // 8자리가 입력됐는지 여부
  const isValid = code.length === 8;

  return (
    <div className="bg-white rounded-xl p-5 pb-6 w-full flex flex-col justify-center items-center">
      <div className="flex w-full justify-end pb-2">
        <button onClick={onClose} className="cursor-pointer">
          <Image src={close} alt="close" />
        </button>
      </div>
      <label className="text-title-1 pb-3">초대코드를 입력해주세요</label>
      <input
        className="w-full border-1 mb-6 text-body-2 border-grey-250 rounded-xl py-[14px] px-4"
        placeholder="영문/숫자 8자리"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        disabled={!isValid}
        className={`w-full rounded-xl py-[14px] text-label-1  text-white ${
          isValid ? 'bg-primary cursor-pointer' : 'bg-light_green_deep cursor-not-allowed'
        }`}
        onClick={async () => {
          try {
            await joinTripByCode(code);
            alert('여행에 성공적으로 참여했습니다!');
          } catch (error) {
            console.error('여행 참여 실패:', error);
            alert('유효하지 않은 코드입니다.\n다시 시도해주세요.');
          }
        }}
      >
        참여하기
      </button>
    </div>
  );
}
