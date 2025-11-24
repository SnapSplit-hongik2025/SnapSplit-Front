import SettlementPage from '@trip/[tripId]/split/[settlementId]/SettlementPage';

export default async function Settlement({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string; settlementId: string }>;
  searchParams: Promise<{ startDay?: string; endDay?: string }>;
}) {
  const { tripId, settlementId } = await params;
  const startDay = (await searchParams).startDay
    ? isNaN(Number((await searchParams).startDay))
      ? undefined
      : Number((await searchParams).startDay)
    : undefined;
  const endDay = (await searchParams).endDay
    ? isNaN(Number((await searchParams).endDay))
      ? undefined
      : Number((await searchParams).endDay)
    : undefined;

  return <SettlementPage settlementId={settlementId} tripId={tripId} startDay={startDay} endDay={endDay} />;
}
