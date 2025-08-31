export interface SplitPageProps {
    tripId: string;
}

export interface SplitDatePickSectionProps {
  selectableDates: { date: string; selectable: boolean }[];
  tripStartDate: string;
}

export interface TripDateInfo {
  startDate: string;
  endDate: string;
}