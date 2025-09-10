import SettlementDetailHeader from './_components/SettlementDetailHeader';
import TotalAmountInfo from './_components/TotalAmountInfo';
import DetailExpenses from './_components/DetailExpenses';
import { SettlementDetailPageProps } from './types/settlement-member-type';
import { getSettlementMemberData } from './api/settlement-member-api';
import { GetSettlementMemberDto } from './types/settlement-member-dto-type';
import getQueryClient from '@/lib/tanstack/getQueryClient';
import { cookies } from 'next/headers';
function isExpired(jwt?: string) {
  if (!jwt) return true;
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === 'number' && payload.exp <= now;
  } catch {
    return true; // 형식 깨지면 만료 취급
  }
}

const SettlementDetailPage = async ({ name, tripId, settlementId, memberId }: SettlementDetailPageProps) => {
  // 1. 서버 환경에서 쿠키를 읽어옵니다.
  const accessToken = cookies().get('refreshToken')?.value;
  console.log('[DEBUG] Access Token from cookies:', accessToken?.slice(0, 10) + '...');
  console.log('[DEBUG] SettlementDetailPage props:', { name, tripId, settlementId, memberId });

  // 디버그용 로그

  const queryClient = getQueryClient();
  const queryKey = ['settlementMember', tripId, settlementId, memberId];

  const data = await queryClient.fetchQuery({
    queryKey: queryKey,
    queryFn: () => getSettlementMemberData(tripId, settlementId, memberId, accessToken),
  });

  return (
    <div className="h-screen w-full flex flex-col overflow-y-auto scrollbar-hide">
      <SettlementDetailHeader />
      <TotalAmountInfo name={name} totalAmount={data.totalKRW} />
      <DetailExpenses settlementDetailsByMember={data.settlementDetailsByMember} />
    </div>
  );
};
export default SettlementDetailPage;
