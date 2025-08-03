import HomeHeader from './_components/HomeHeader';
import CreateTripSection from './_components/CreateTripSection';
import PastTripImgCardList from './_components/PastTripImgCardList';
import AllPastTripList from './_components/AllPastTripList';
import mock from '@public/mocks/home-mock.json';

export default function HomePage() {
  return (
    <div className="bg-grey-50 min-h-[100dvh] pb-6">
      <HomeHeader />
      <CreateTripSection upcomingTrips={mock.data.upcomingTrips} ongoingTrips={mock.data.ongoingTrips} />
      <PastTripImgCardList />
      <AllPastTripList />
    </div>
  );
}
