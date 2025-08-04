'use client';

import Image from 'next/image';
import arrow from '@public/svg/arrow-left-grey-1000.svg';
import { useRouter } from 'next/navigation';

export default function SettlementDetailHeader() {
  const router = useRouter();

  return (
    <header className="flex px-5 py-3 justify-between text-label-1 items-center">
      <button onClick={() => router.back()}>
        <Image src={arrow} alt="back button" />
      </button>
      개별 지출 금액
      <div className="w-5 h-5" />
    </header>
  );
}
