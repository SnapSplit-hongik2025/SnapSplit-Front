import BudgetPage from '@/features/trip/[tripId]/budget/BudgetPage';

export default async function Budget({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <BudgetPage tripId={tripId} />;
}
