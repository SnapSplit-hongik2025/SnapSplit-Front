import SettlementDetailHeader from './_components/SettlementDetailHeader';
import TotalAmountInfo from './_components/TotalAmountInfo';
import DetailExpenses from './_components/DetailExpenses';
import { SettlementDetailPageProps } from './types/settlement-member-type';
import { getSettlementMemberData } from './api/settlement-member-api';
import { GetSettlementMemberDto } from './types/settlement-member-dto-type';
import getQueryClient from '@/lib/tanstack/getQueryClient';

const SettlementDetailPage = ({ name, tripId, settlementId, memberId }: SettlementDetailPageProps) => {
  const queryClient = getQueryClient();
  const queryKey = ['settlementMember', tripId, settlementId, memberId];

  // fetchQuery를 사용하여 데이터를 가져오고 그 결과를 data 변수에 할당합니다.
  // 이 데이터는 서버에서 렌더링할 때 즉시 사용됩니다.
  const data = await queryClient.fetchQuery({
    queryKey: queryKey,
    queryFn: () => getSettlementMemberData(tripId, settlementId, memberId),
  });

  // 이제 'data' 변수에 서버에서 가져온 데이터가 들어있습니다.
  // 이 데이터는 TanStack Query 캐시에도 저장되어 클라이언트 컴포넌트에서 재사용할 수 있습니다.

  // await Promise.all([
  //   queryClient.fetchQuery({
  //     queryKey: ['settlementMember', tripId, settlementId, memberId],
  //     queryFn: () => getSettlementMemberData(tripId, settlementId, memberId),
  //     // enabled: !!tripId && !!settlementId && !!memberId,
  //   }),
  // ]);

  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto scrollbar-hide">
      <SettlementDetailHeader />
      <TotalAmountInfo name={name} totalAmount={data.totalKRW} />
      <DetailExpenses settlementDetailsByMember={data.settlementDetailsByMember} />
    </div>
  );
};
export default SettlementDetailPage;
