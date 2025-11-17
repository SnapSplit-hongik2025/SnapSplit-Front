import { settlementDetailsByMemberDto } from './settlement-member-dto-type';

export interface SettlementDetailPageProps {
  name: string;
  tripId: string;
  settlementId: string;
  memberId: string;
}

export interface TotalAmountInfoProps {
  name: string;
  totalAmount: number;
}

export interface DetailExpensesProps {
  settlementDetailsByMember: settlementDetailsByMemberDto[];
  tripStartDate: string;
}
