'use client';

import { useDragScroll } from '@/shared/utils/useDragScroll';
import { PastTripImgCardListProps } from '../type/home-type';
import { format } from 'date-fns';
import Image from 'next/image';

type PastTripCardProp = {
  tripName: string;
  startDate: string;
  tripImage: string;
};

const PastTripCard = ({ tripName, startDate, tripImage }: PastTripCardProp) => {
  return (
    <div className="flex-shrink-0 flex flex-col justify-center items-center bg-white rounded-2xl w-52 h-[262px] mr-4">
      <div className="bg-grey-250 rounded-2xl w-[184px] h-[184px] mb-3">
        <Image
          src={tripImage}
          alt="trip image"
          width={184}
          height={184}
          className="rounded-2xl object-cover w-[184px] h-[184px]"
        />
      </div>
      {/* 여행 이미지 */}
      <p className="text-body-1">{tripName}</p>
      <p className="text-body-2 text-grey-550">{format(startDate, 'yyyy. M. d')}</p>
    </div>
  );
};

const PastTripImgCardList = ({ pastTrips }: PastTripImgCardListProps) => {
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp } = useDragScroll('x');

  return (
    <div className="flex flex-col gap-3 pl-5 py-6">
      <label className="text-title-1">지난 여행을 추억해봐요!</label>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex overflow-x-auto scrollbar-hide"
      >
        {pastTrips.map((trip, tripId) => (
          <PastTripCard key={tripId} tripName={trip.tripName} startDate={trip.startDate} tripImage={trip.tripImage} />
        ))}
      </div>
    </div>
  );
};

export default PastTripImgCardList;
