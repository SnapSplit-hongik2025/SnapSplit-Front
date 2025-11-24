import arrow from '@public/svg/arrow-right-grey-550.svg';
import Image from 'next/image';
import Link from 'next/link';

export interface SplitReciptCardProps {
  startDate?: string;
  endDate?: string;
  settlementId?: number;
  startDay: number;
  endDay: number;
}
export default function SplitReciptCard({ startDate, endDate, settlementId, startDay, endDay }: SplitReciptCardProps) {
  const formatDay = (day: number) => (day === 0 ? '여행 준비' : `Day ${day}`);

  return (
    <Link
      className="w-full flex p-4 bg-white rounded-xl gap-2"
      href={{
        pathname: `split/${settlementId}`,
        query: {
          startDay,
          endDay,
        },
      }}
    >
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <div className="text-body-3">
          {formatDay(startDay)} ~ {formatDay(endDay)}
        </div>
        <div className="self-stretch inline-flex justify-start items-center">
          <div className="text-grey-550 text-caption-2">
            {startDate} - {endDate}
          </div>
        </div>
      </div>
      <Image src={arrow} alt="go detail page" />
    </Link>
  );
}
