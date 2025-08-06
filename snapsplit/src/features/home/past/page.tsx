import PastTripHeader from './_components/PastTripHeader';
import PastTripList from './_components/PastTripList';
import PastTripSummary from './_components/PastTripSummary';
import mock from '@public/mocks/past-trip-mock.json';

// 임시 데이터
const tripCount = mock.length;
const countryCount = new Set(mock.map((trip: any) => trip.country)).size;

export default function PastTripPage() {
  return (
    <div className="flex flex-col px-5 pb-6 min-h-[100dvh] bg-light_grey overflow-auto">
      <PastTripHeader />
      <PastTripSummary tripCount={tripCount} countryCount={countryCount} />
      <PastTripList trips={mock} />
    </div>
  );
}
