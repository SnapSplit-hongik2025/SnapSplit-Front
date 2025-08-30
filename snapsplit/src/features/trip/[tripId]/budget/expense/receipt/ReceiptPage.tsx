import ReceiptHeader from "@/features/trip/[tripId]/budget/expense/receipt/_components/ReceiptHeader";
import ReceiptForm from "@/features/trip/[tripId]/budget/expense/receipt/_components/ReceiptForm";

const ReceiptPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <ReceiptHeader />
      <ReceiptForm />
    </div>
  );
};

export default ReceiptPage;
