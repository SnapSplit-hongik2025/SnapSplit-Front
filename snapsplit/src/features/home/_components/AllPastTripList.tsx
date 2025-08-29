import Link from 'next/link';
import { PastTripListProps, AllPastTripListProps } from '../types/home-type';
import { useISOtoFormattedDate } from '@/shared/utils/useISOtoFormattedDate';
import Image from 'next/image';

const PastTripItem = ({ tripId, tripName, startDate, endDate, tripImage }: PastTripListProps) => {
  return (
    <Link className="space-x-[14px] py-4" href={`trip/${tripId}/budget`}>
      <div className="flex flex-row gap-3">
        {tripImage && (
          <Image src={tripImage} alt="trip image" quality={10} width={40} height={40} className="rounded-xl" />
        )}
        <div className="flex flex-col text-body-1">
          <p>{tripName}</p>
          <div className="flex flex-row text-grey-550 text-caption-1">
            <span>
              {useISOtoFormattedDate(startDate)} - {useISOtoFormattedDate(endDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const AllPastTripList = ({ pastTrips }: AllPastTripListProps) => {
  const hasPastTrip = pastTrips && pastTrips.length > 0;

  return (
    <div className="px-5">
      <section className="flex flex-col bg-white rounded-[20px] py-4 px-5">
        <div className="flex justify-between pb-1">
          <label className="text-label-1">다녀온 여행들</label>
          <Link href="/home/past" className="text-body-2 text-grey-550">
            전체보기
          </Link>
        </div>

        {hasPastTrip &&
          pastTrips.map((trip) => (
            <PastTripItem
              key={trip.tripId}
              tripId={trip.tripId}
              tripName={trip.tripName}
              startDate={trip.startDate}
              endDate={trip.endDate}
              countryNames={trip.countryNames}
              tripImage={trip.tripImage}
            />
          ))}
      </section>
    </div>
  );
};

export default AllPastTripList;
