import ExpenseDetailPage from '@/features/trip/[tripId]/budget/[expenseId]/ExpenseDetailPage';

export default async function ExpenseDetail({ params }: { params: Promise<{ tripId: string; expenseId: string }> }) {
  const { tripId, expenseId } = await params;

  return <ExpenseDetailPage tripId={tripId} expenseId={expenseId} />;
}
