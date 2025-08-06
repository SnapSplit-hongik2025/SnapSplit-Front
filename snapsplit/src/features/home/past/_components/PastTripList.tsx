import Image from 'next/image';
import right_arrow from '@public/svg/rightArrow.svg';
import Link from 'next/link';
import { Trip } from '@home/types';

type PastTripCardProps = {
  tripName: string;
  startDate: string;
  endDate: string;
  countryNames: string[];
};

export const PastTripCard = ({ tripName, startDate, endDate, countryNames }: PastTripCardProps) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl flex justify-between items-center">
      <div className="flex flex-col flex-1 gap-1">
        <div className="text-label-1 text-black">{tripName}</div>
        <div className="flex items-center gap-2 text-caption-1 text-grey-550 font-medium">
          <span className="whitespace-nowrap">
            {startDate} - {endDate}
          </span>
          <div className="w-[1px] h-3 bg-grey-350" />
          <span className="max-w-[100px] whitespace-nowrap overflow-hidden truncate">
            {countryNames.map((name, idx) => (
              <span key={idx}>
                {name}
                {idx < countryNames.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
      </div>
      <Link href={'#'}>
        <Image src={right_arrow} alt="go trip pag" />
      </Link>
    </div>
  );
};

type PastTripListProps = {
  trips: Trip[];
};

const PastTripList = ({ trips }: PastTripListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {trips.map((trip, index) => (
        <PastTripCard
          key={index}
          tripName={trip.tripName}
          startDate={trip.startDate}
          endDate={trip.endDate}
          countryNames={trip.countryNames}
        />
      ))}
    </div>
  );
};

export default PastTripList;
