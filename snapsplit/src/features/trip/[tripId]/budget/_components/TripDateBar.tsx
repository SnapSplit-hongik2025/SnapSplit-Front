'use client';

import { TripDateFilterBarProps } from '../type';
import Image from 'next/image';
import search from '@public/svg/search.svg';
import { getDateRangeArray } from '@/shared/utils/makeDateList';
import { getKoreanDay } from '@/shared/utils/getKoreanDay';
import { useState } from 'react';
import { useDragScroll } from '@/shared/utils/useDragScroll';

const TripDateBar = ({ startDate, endDate }: TripDateFilterBarProps) => {
  const dateList = getDateRangeArray(startDate, endDate);
  const [selectedKey, setSelectedKey] = useState<string>('전체');

  const handleClick = (key: string) => {
    // 선택된 날짜로 상태 업데이트
    if (key === selectedKey) return; // 이미 선택된 날짜는 무시
    setSelectedKey(key);

    // 선택된 날짜로 스크롤 이동
    const el = document.getElementById(`day-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`[TripDateBar] 스크롤 대상 day-${key} 을(를) 찾지 못했습니다.`);
    }
  };

  // 선택된 날짜가 현재 선택된 키와 같은지 확인
  const isSelected = (key: string) => selectedKey === key;

  // 마우스 드래그
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp } = useDragScroll('x');

  // 조건부 스타일
  const baseButtonClass = 'cursor-pointer min-w-12 max-w-12 h-16 flex flex-col items-center justify-center shrink-0';
  const selectedClass = 'bg-grey-650 text-white rounded-tl-xl rounded-tr-xl';

  return (
    <div className="w-full pl-5 flex items-end whitespace-nowrap overflow-hidden">
      {/* '전체' 탭 */}
      <button
        onClick={() => handleClick('전체')}
        className={`${baseButtonClass} text-body-2 ${isSelected('전체') ? selectedClass : 'text-grey-650'}`}
      >
        전체
      </button>

      {/* '준비' 탭 */}
      <button
        onClick={() => handleClick('준비')}
        className={`${baseButtonClass} ${isSelected('준비') ? selectedClass : 'text-grey-550'}`}
      >
        <p className="text-caption-2">준비</p>
        <Image alt="search" src={search} />
      </button>

      {/* 날짜들 */}
      <div
        className="flex overflow-x-auto scrollbar-hide pr-5"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {dateList.map((date) => {
          const key = date.format('YYYY-MM-DD');
          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`${baseButtonClass} ${isSelected(key) ? selectedClass : 'text-grey-550'}`}
            >
              <p className="text-caption-2">{getKoreanDay(date)}</p>
              <p className="text-body-2">{date.date()}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TripDateBar;
