import EditNamePage from '@/features/trip/[tripId]/edit/name/page';

export default async function EditName({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <EditNamePage tripId={tripId} />;
}
