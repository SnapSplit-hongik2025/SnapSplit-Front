export interface SplitPageProps {
    tripId: string;
}

export interface SplitDatePickSectionProps {
  tripId: string;
  selectableDates: { date: string; hasExpense: boolean }[]; 
  tripStartDate: string;
}
