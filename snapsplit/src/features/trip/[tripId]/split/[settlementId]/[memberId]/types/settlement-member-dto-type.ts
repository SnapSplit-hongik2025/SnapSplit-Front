export interface GetSettlementMemberDto {
  settlementDetailsByMember: settlementDetailsByMemberDto[];
  totalKRW: number;
}

export interface settlementDetailsByMemberDto {
  date: string;
  items: expenseItemDto[];
}

// 이 부분 지출 상세 내역 페이지와 타입 연관 있음
export interface expenseItemDto {
  expenseName: string;
  expenseMemo: string;
  amount: number;
  amountKRW: number;
  expenseCurrency: string;
}
