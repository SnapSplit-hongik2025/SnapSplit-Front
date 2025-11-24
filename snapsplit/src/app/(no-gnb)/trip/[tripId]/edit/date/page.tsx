import EditDatePage from '@/features/trip/[tripId]/edit/date/page';

export default async function EditDate({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <EditDatePage tripId={tripId} />;
}
