'use client';

import SettlementDetailHeader from './_components/SettlementDetailHeader';
import TotalAmountInfo from './_components/TotalAmountInfo';
import DetailExpenses from './_components/DetailExpenses';
import { SettlementDetailPageProps } from './types/settlement-member-type';
import { getSettlementMemberData } from './api/settlement-member-api';
import { GetSettlementMemberDto } from './types/settlement-member-dto-type';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/shared/components/loading/Loading';
import { GetTripBudgetDto } from '@trip/[tripId]/budget/types/budget-dto-type';
import { getTripBudgetData } from '@trip/[tripId]/budget/api/budget-api';

const SettlementDetailPage = ({ name, tripId, settlementId, memberId }: SettlementDetailPageProps) => {
  const {
    data: settlementByMemberData,
    isLoading: isLoadingSettlement,
    isError: isErrorSettlement,
    error: settlementError,
  } = useQuery<GetSettlementMemberDto, Error>({
    queryKey: ['settlementMember', tripId, settlementId, memberId],
    queryFn: () => getSettlementMemberData(tripId, settlementId, memberId),
    enabled: !!tripId && !!settlementId && !!memberId,
  });

  const {
    data: tripData,
    isLoading: isLoadingTrip,
    isError: isErrorTrip,
    error: tripError,
  } = useQuery<GetTripBudgetDto, Error>({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    enabled: !!tripId,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoadingSettlement || isLoadingTrip) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isErrorSettlement || isErrorTrip) {
    return <div>오류가 발생했습니다: {settlementError?.message || tripError?.message}</div>;
  }

  if (!settlementByMemberData || !tripData || !tripData.startDate) {
    return <div>데이터가 없습니다.</div>;
  }

  console.log('응답 데이터: ', settlementByMemberData);

  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto scrollbar-hide">
      <SettlementDetailHeader />
      <TotalAmountInfo name={name} totalAmount={settlementByMemberData.totalKRW} />
      <DetailExpenses
        settlementDetailsByMember={settlementByMemberData.settlementDetailsByMember}
        tripStartDate={tripData.startDate}
      />
    </div>
  );
};
export default SettlementDetailPage;
