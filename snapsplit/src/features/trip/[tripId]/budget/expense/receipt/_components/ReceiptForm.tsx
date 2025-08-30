'use client';
import Button from '@/shared/components/Button';
import ExpenseInputCard from '@/features/trip/[tripId]/budget/expense/_components/expense-form/ExpenseInputCard';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { useExpenseInitStore } from '@/lib/zustand/useExpenseInitStore';
import PaySection from '@/features/trip/[tripId]/budget/expense/_components/expense-form/PaySection';
import SplitSection from '@/features/trip/[tripId]/budget/expense/_components/expense-form/SplitSection';
import ReceiptAnalysisSection from '@/features/trip/[tripId]/budget/expense/receipt/_components/receipt-form/ReceiptAnalysisSection';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ReceiptForm() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;

  const amount = useExpenseStore((state) => state.amount);
  const setAmount = useExpenseStore((state) => state.setAmount);
  const currency = useExpenseStore((state) => state.currency);
  const setCurrency = useExpenseStore((state) => state.setCurrency);
  const exchangeRates = useExpenseInitStore((state) => state.exchangeRates);
  const items = useReceiptStore((state) => state.items);
  const setItems = useReceiptStore((state) => state.setItems);

  const handleNext = () => {
    router.push(`/trip/${tripId}/budget/expense`);
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <div className="text-title-1 w-full pb-4">영수증 정보가 맞나요?</div>
      <div className="flex flex-col items-center w-full gap-6">
        <div className="bg-grey-250 w-full h-50 rounded-xl"></div>
        <ExpenseInputCard
          amount={amount}
          setAmount={setAmount}
          currency={currency}
          setCurrency={setCurrency}
          exchangeRates={exchangeRates}
          mode="receipt"
        />
        <ReceiptAnalysisSection items={items} setItems={setItems}/>
        <PaySection />
        <SplitSection />
      </div>

      <div className="flex items-center justify-center w-full py-5">
        <Button label="다음으로" onClick={handleNext} enabled={true} />
      </div>
    </div>
  );
}
