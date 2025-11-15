import SnapPage from '@/features/trip/[tripId]/snap/SnapPage';

export default async function Snap({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <SnapPage tripId={tripId} />;
}