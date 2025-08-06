'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { useState } from 'react';
import DateSelectSheet from './trip-date/DateSelectSheet';

export default function TripDateSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Day 1');
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">여행 일자</div>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250">
        <div className="flex-1 text-body-3 text-start">{selectedDate}</div>
        <Image src="/svg/arrow-bottom-grey-450.svg" alt="open" width={24} height={24} />
      </button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DateSelectSheet onClose={() => setIsOpen(false)} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </BottomSheet>
    </div>
  );
}
