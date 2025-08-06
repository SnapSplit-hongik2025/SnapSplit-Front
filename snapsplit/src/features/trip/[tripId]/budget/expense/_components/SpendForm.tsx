import SpendInputCard from './SpendInputCard';
import TripDateSection from './spendForm/TripDateSection';
import PaymentMethodSection from './spendForm/PaymentMethodSection';
import TitleSection from './spendForm/TitleSection';
import DescriptionSection from './spendForm/DescriptionSection';
import CategorySection from './spendForm/CategorySection';
import PaySection from './spendForm/PaymentSection';
import SplitSection from './spendForm/SplitSection';

export default function SpendForm() {
  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <SpendInputCard />
      <div className="flex flex-col items-center gap-7 w-full pt-6">
        <TripDateSection />
        <PaymentMethodSection />
        <TitleSection />
        <DescriptionSection />
        <CategorySection />
        <PaySection />
        <SplitSection />
      </div>
      <div className="flex items-center justify-center w-full p-5">
        <button className="flex items-center justify-center w-full h-12 px-4 rounded-xl bg-primary text-white">
          추가하기
        </button>
      </div>
    </div>
  );
}
