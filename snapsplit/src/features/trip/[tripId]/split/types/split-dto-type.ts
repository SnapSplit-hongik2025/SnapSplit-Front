export interface completeSettlementDto {
  id: number;
  startDate: string;
  endDate: string;
}

export interface DailyExpenseStatusDto {
  date: string;
  hasExpense: boolean;
  settled: boolean;
}

export interface TripDateDto {
  startDate: string;
  endDate: string;
}

export interface GetSplitDto {
  trip: TripDateDto;
  completeSettlement: completeSettlementDto[];
  dailyExpenseStatus: DailyExpenseStatusDto[];
}

export type PostSettlementResponseDto = {
  settlementId: number;
};
