import SettlementDetailHeader from './_components/SettlementDetailHeader';
import TotalAmountInfo from './_components/TotalAmountInfo';
import DetailExpenses from './_components/DetailExpenses';
import { SettlementDetailPageProps } from './types/settlement-member-type';
import { useQuery } from '@tanstack/react-query';
import { getSettlementMemberData } from './api/settlement-member-api';
import { GetSettlementMemberDto } from './types/settlement-member-dto-type';

const SettlementDetailPage = ({ name, tripId, settlementId, memberId }: SettlementDetailPageProps) => {
  const { data, isLoading, isError, error } = useQuery<GetSettlementMemberDto, Error>({
    queryKey: ['settlementMember', tripId, settlementId, memberId],
    queryFn: () => getSettlementMemberData(tripId, settlementId, memberId),
    enabled: !!tripId && !!settlementId && !!memberId,
  });

  if (isLoading) {
    return <div>정산 내역을 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto scrollbar-hide">
      <SettlementDetailHeader />
      <TotalAmountInfo name={name} totalAmount={data.totalKRW} />
      <DetailExpenses settlementDetailsByMember={data.settlementDetailsByMember} />
    </div>
  );
};
export default SettlementDetailPage;
