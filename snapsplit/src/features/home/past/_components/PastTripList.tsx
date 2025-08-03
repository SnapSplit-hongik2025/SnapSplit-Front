import Image from 'next/image';
import right_arrow from '@public/svg/rightArrow.svg';
import Link from 'next/link';

type PastTripCardProps = {
  tripName: string;
  dateRange: string;
  countryName: string;
};

export const PastTripCard = ({ tripName, dateRange, countryName }: PastTripCardProps) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl flex justify-between items-center">
      <div className="flex flex-col flex-1 gap-1">
        <div className="text-label-1 text-black">{tripName}</div>
        <div className="flex items-center gap-2 text-caption-1 text-grey-550 font-medium">
          <span className="whitespace-nowrap">{dateRange}</span>
          <div className="w-px h-3 bg-grey-350" />
          <span className="whitespace-nowrap">{countryName}</span>
        </div>
      </div>
      <Link href={'#'}>
        <Image src={right_arrow} alt="go trip pag" />
      </Link>
    </div>
  );
};

type PastTripListProps = {
  trips: PastTripCardProps[];
};

const PastTripList = ({ trips }: PastTripListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {trips.map((trip, index) => (
        <PastTripCard key={index} tripName={trip.tripName} dateRange={trip.dateRange} countryName={trip.countryName} />
      ))}
    </div>
  );
};

export default PastTripList;
