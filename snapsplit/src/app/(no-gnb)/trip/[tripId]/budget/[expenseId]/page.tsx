import ExpenseDetailPage from '@/features/trip/[tripId]/budget/[expenseId]/ExpenseDetailPage';

export default async function ExpenseDetail({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <ExpenseDetailPage tripId={tripId} />;
}
