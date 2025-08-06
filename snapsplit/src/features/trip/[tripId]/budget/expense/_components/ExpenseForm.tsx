import ExpenseInputCard from './ExpenseInputCard';
import TripDateSection from './expense-form/TripDateSection';
import PaymentMethodSection from './expense-form/PaymentMethodSection';
import TitleSection from './expense-form/TitleSection';
import DescriptionSection from './expense-form/DescriptionSection';
import CategorySection from './expense-form/CategorySection';
import PaySection from './expense-form/PaymentSection';
import SplitSection from './expense-form/SplitSection';

export default function ExpenseForm() {
  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <ExpenseInputCard />
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
