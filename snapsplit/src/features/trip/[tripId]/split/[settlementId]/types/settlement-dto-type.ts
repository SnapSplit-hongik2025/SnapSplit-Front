import { Member } from "@/shared/types/member";

export interface SettlementDetailDto {
  sender: Member;
  receiver: Member;
  amount: number;
}

export interface PersonalExpenseDto extends Member {
  amount: number;
  memberType: 'user' | 'shared_fund'; // 'user'는 개인 지출, 'shared_fund'는 공동 경비
}

export interface GetSettlementResponseDto {
  id: number;
  members: Member[];
  settlementDetails: SettlementDetailDto[];
  personalExpenses: PersonalExpenseDto[];
  totalAmount: number;
}