import FaceTestPage from '@/features/trip/[tripId]/snap/face-test/FaceTestPage';

export default async function FaceTest({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <FaceTestPage tripId={tripId} />;
}
