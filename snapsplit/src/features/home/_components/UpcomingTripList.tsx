import { UpcomingTripProps } from '../types/home-type';

const UpcomingTrip = ({ tripName, tripCountry, tripDate, dDay }: UpcomingTripProps) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl">
      <div className="flex flex-col">
        <span className="text-label-1">{tripName}</span>
        <div className="text-caption-1 text-grey-550 flex gap-1">
          <span>{tripCountry}</span>
          <span>{tripDate}</span>
        </div>
      </div>
      <button className="w-[62px] py-2 justify-center h-fit items-center rounded-xl text-body-1 bg-grey-650 text-grey-50">
        {dDay}
      </button>
    </div>
  );
};

const UpcomingTripList = () => {
  return (
    <section className="flex flex-col justify-between gap-3 w-full p-4 border-b-8 border-grey-150">
      <UpcomingTrip
        tripName="스냅스플릿 연구팟"
        tripCountry="런던, 파리, 취리히"
        tripDate="2025.4.7 - 4.12"
        dDay="D-3"
      />

      <UpcomingTrip tripName="유luv여행" tripCountry="뉴욕, 도쿄" tripDate="2025.5.1 - 5.8" dDay="D-12" />
    </section>
  );
};

export default UpcomingTripList;
