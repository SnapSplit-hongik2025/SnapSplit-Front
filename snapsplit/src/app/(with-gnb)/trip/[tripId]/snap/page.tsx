import SnapPage from '@/features/trip/[tripId]/snap/SnapPage';

export default function Page({ params }: { params: { tripId: string } }) {
  return <SnapPage tripId={params.tripId} />;
}
