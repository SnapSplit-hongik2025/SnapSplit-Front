import { PastTripSummaryProps } from '../types';

const PastTripSummary = ({ totalTrips, totalCountries }: PastTripSummaryProps) => {
  return (
    <main className="text-head-1 pt-2 pb-6">
      지금까지 <span className="text-primary">{totalTrips}</span>번의 여행,
      <br />
      <span className="text-primary">{totalCountries}</span>개의 나라에 가봤어요!
    </main>
  );
};

export default PastTripSummary;
