import SettlementDetailPage from '@trip/[tripId]/split/[settlementId]/[memberId]/SettlementDetailPage';

export default async function Settlement({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string; settlementId: string; tripId: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { tripId, settlementId, memberId } = await params;

  const { name } = await searchParams;
  const safeName = name ?? '';
  const safeMemberId = memberId ?? '';
  const safeTripId = tripId ?? '';
  const safeSettlementId = settlementId ?? '';

  return (
    <SettlementDetailPage name={safeName} memberId={safeMemberId} tripId={safeTripId} settlementId={safeSettlementId} />
  );
}
