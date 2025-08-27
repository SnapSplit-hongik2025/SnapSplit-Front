import PastTripHeader from './_components/PastTripHeader';
import PastTripList from './_components/PastTripList';
import PastTripSummary from './_components/PastTripSummary';
import mock from '@public/mocks/past-trip-mock.json';

export default function PastTripPage() {
  return (
    <div className="flex flex-col px-5 pb-6 min-h-[100dvh] bg-light_grey overflow-auto">
      <PastTripHeader />
      <PastTripSummary totalTrips={mock.data.totalTrips} totalCountries={mock.data.totalCountries} />
      <PastTripList trips={mock.data.trips} />
    </div>
  );
}
