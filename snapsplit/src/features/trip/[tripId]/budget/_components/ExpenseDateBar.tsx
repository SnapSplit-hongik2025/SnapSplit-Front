import Image from 'next/image';
import devider from '@public/svg/devider.svg';
import { getKoreanDay } from '@/shared/utils/getKoreanDay';
import dayjs from 'dayjs';
import { ExpenseDateBarProps } from '../types/budget-type';

export default function ExpenseDateBar({ expenseDate, tripStartDate }: ExpenseDateBarProps) {
  const current = dayjs(expenseDate);
  const start = dayjs(tripStartDate);
  const diffDays = current.diff(start, 'day');
  const inTrip = diffDays >= 0;
  const dayIndex = diffDays + 1;
  const displayDate = `${current.month() + 1}.${current.date()}/${getKoreanDay(current)}`;

  const content = inTrip ? (
    <div className="flex gap-2 items-center pb-[6px]">
      <p className="text-body-1 text-grey-850">Day {dayIndex}</p>
      <Image alt="구분선" src={devider} />
      <p className="text-body-1 text-grey-550">{displayDate}</p>
    </div>
  ) : (
    <div className="flex gap-2 items-center pb-[6px]">
      <p className="text-body-1 text-grey-850">여행 준비</p>
    </div>
  );

  return content;
}
