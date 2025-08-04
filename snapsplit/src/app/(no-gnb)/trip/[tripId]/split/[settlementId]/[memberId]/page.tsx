import SettlementDetailPage from '@trip/[tripId]/split/[settlementId]/[memberId]/SettlementDetailPage';

export default async function Settlement({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const safeName = name ?? '';

  return <SettlementDetailPage name={safeName} />;
}
