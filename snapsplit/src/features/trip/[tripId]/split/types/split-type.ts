import { DailyExpenseStatusDto } from './split-dto-type';

export interface SplitPageProps {
  tripId: string;
}

export interface SplitDatePickSectionProps {
  tripId: string;
  dailyExpenseStatus: DailyExpenseStatusDto[];
  tripStartDate: string;
}
