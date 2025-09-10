import SettlementDetailPage from '@trip/[tripId]/split/[settlementId]/[memberId]/SettlementDetailPage';

export default async function Settlement({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; memberId?: string; settlementId?: string; tripId?: string }>;
}) {
  const { name, memberId, tripId, settlementId } = await searchParams;
  const safeName = name ?? '';
  const safeMemberId = memberId ?? '';
  const safeTripId = tripId ?? '';
  const safeSettlementId = settlementId ?? '';

  return (
    <SettlementDetailPage name={safeName} memberId={safeMemberId} tripId={safeTripId} settlementId={safeSettlementId} />
  );
}
