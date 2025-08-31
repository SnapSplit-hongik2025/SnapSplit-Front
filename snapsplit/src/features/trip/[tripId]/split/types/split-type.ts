export interface SplitPageProps {
    tripId: string;
}

export interface SplitDatePickSectionProps {
  selectableDates: { date: string; hasExpense: boolean }[]; 
  tripStartDate: string;
}
