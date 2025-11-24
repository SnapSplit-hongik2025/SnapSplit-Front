'use client';

import devider from '@public/svg/devider.svg';
import Image from 'next/image';
import { TripInfoProps } from '../types/budget-type';
import UserIconList from './UserIconList/UserIconList';
import { useISOtoFormattedDate } from '@/shared/utils/useISOtoFormattedDate';

const TripInfo = ({ memberProfileImages, tripName, countries, startDate, endDate }: TripInfoProps) => {
  return (
    <div className="flex flex-col p-5 pt-0 gap-1 pb-4">
      <UserIconList memberProfileImages={memberProfileImages} />
      <div className="flex flex-row space-x-3 items-center">
        <p className="text-grey-850 text-head-0">{tripName}</p>
      </div>
      <div className="flex flex-row gap-2 items-center text-grey-650">
        <p className="text-body-2 whitespace-nowrap">
          {useISOtoFormattedDate(startDate)} - {useISOtoFormattedDate(endDate)}
        </p>
        <Image alt="|" src={devider} />
        <p className="text-body-2 truncate">{countries?.map((c) => c).join(', ') || '국가 정보 없음'}</p>
      </div>
    </div>
  );
};

export default TripInfo;
