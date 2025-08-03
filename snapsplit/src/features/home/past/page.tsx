import PastTripHeader from './_components/PastTripHeader';
import PastTripList from './_components/PastTripList';
import PastTripSummary from './_components/PastTripSummary';

const mock = { tripCount: 5, countryCount: 12 };
const mockTrips = [
  { tripName: '벚꽃 출사 투어', dateRange: '2025. 3. 25 - 2025. 4. 2', countryName: '일본' },
  { tripName: '방콕 힐링 여행', dateRange: '2025. 5. 10 - 2025. 5. 18', countryName: '태국' },
  { tripName: '파리 아트 산책', dateRange: '2025. 6. 1 - 2025. 6. 12', countryName: '프랑스' },
  { tripName: '바르셀로나 건축 탐험', dateRange: '2025. 7. 5 - 2025. 7. 15', countryName: '스페인' },
];

export default function PastTripPage() {
  return (
    <div className="flex flex-col px-5 pb-6 min-h-[100dvh] bg-light_grey overflow-auto">
      <PastTripHeader />
      <PastTripSummary tripCount={mock.tripCount} countryCount={mock.countryCount} />
      <PastTripList trips={mockTrips} />
    </div>
  );
}
