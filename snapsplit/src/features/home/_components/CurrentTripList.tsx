'use client';

import { useDragScroll } from '@/shared/utils/useDragScroll';
import { CurrentTripListProps } from '../type/home-type';
import { getDaysUntilTrip } from '@/shared/utils/DatetoDay/getDaysUntilTrip';
import Link from 'next/link';

type CurrentTripItemProps = {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  countryNames: string[];
};

const CurrentTripItem = ({ tripId, tripName, startDate, endDate, countryNames }: CurrentTripItemProps) => {
  const daysLeft = getDaysUntilTrip(startDate);

  let dLabel: string;
  if (daysLeft > 0) {
    dLabel = `D-${daysLeft}`;
  } else if (daysLeft < 0) {
    dLabel = `Day ${Math.abs(daysLeft)}`;
  } else {
    dLabel = 'D-day';
  }

  return (
    <Link
      href={`/trip/${tripId}/budget`}
      className="flex-shrink-0 flex items-center p-[1px] rounded-[12px] bg-gradient-to-br from-primary to-transparent w-[296px] mr-2"
    >
      <div className="flex items-center w-full rounded-[12px] bg-[#41D59626]">
        <div className="flex flex-col w-full gap-1 bg-bg_green rounded-[11px] p-4">
          <div className="flex gap-[6px]">
            <div className="flex px-2 py-[2px] rounded-[40px] bg-primary text-white text-body-1">{dLabel}</div>
            <p className="text-label-1">{tripName}</p>
          </div>
          <div
            className="text-caption-1 text-grey-550 w-full overflow-hidden whitespace-nowrap truncate"
            title={countryNames.join(', ')}
          >
            {startDate} - {endDate} |{' '}
            {countryNames.map((country, idx) => (
              <span key={country + idx}>
                {country}
                {idx < countryNames.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

const CurrentTripList = ({ upcomingTrips, ongoingTrips }: CurrentTripListProps) => {
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp } = useDragScroll('x');

  const hasOngoing = ongoingTrips && ongoingTrips.length > 0;
  const hasUpcoming = upcomingTrips && upcomingTrips.length > 0;

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="flex overflow-x-auto scrollbar-hide px-8"
    >
      {hasOngoing &&
        ongoingTrips.map((trip) => (
          <CurrentTripItem
            key={trip.tripId}
            tripId={trip.tripId}
            tripName={trip.tripName}
            startDate={trip.startDate}
            endDate={trip.endDate}
            countryNames={trip.countryNames}
          />
        ))}
      {hasUpcoming &&
        upcomingTrips.map((trip) => (
          <CurrentTripItem
            key={trip.tripId}
            tripId={trip.tripId}
            tripName={trip.tripName}
            startDate={trip.startDate}
            endDate={trip.endDate}
            countryNames={trip.countryNames}
          />
        ))}
    </div>
  );
};

export default CurrentTripList;
