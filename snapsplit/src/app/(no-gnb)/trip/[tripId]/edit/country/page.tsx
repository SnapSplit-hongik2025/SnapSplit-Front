import EditCountryPage from '@trip/[tripId]/edit/country/page';

export default async function EditCountry({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return <EditCountryPage tripId={tripId} />;
}
