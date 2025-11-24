import SplitPage from '@features/trip/[tripId]/split/SplitPage';

export default async function Split({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <SplitPage tripId={tripId} />;
}
