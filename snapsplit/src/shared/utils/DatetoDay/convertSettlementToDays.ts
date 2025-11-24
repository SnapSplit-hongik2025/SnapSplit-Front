import { parseISO, differenceInCalendarDays, isValid } from 'date-fns';

type SettlementDay = {
  id: number;
  startDate: string;
  endDate: string;
  startDay: number;
  endDay: number;
};

export function convertSettlementToDays(
  tripStartDate: string,
  completeSettlements: { id: number; startDate: string; endDate: string }[]
): SettlementDay[] {
  if (!tripStartDate) {
    throw new Error('tripStartDate is required');
  }

  const tripStart = parseISO(tripStartDate);
  if (!isValid(tripStart)) {
    throw new Error('Invalid tripStartDate format');
  }

  return completeSettlements.map((settlement) => {
    const start = parseISO(settlement.startDate);
    const end = parseISO(settlement.endDate);

    if (!isValid(start) || !isValid(end)) {
      throw new Error(`Invalid date format in settlement ID ${settlement.id}`);
    }

    const startDiff = differenceInCalendarDays(start, tripStart);
    const endDiff = differenceInCalendarDays(end, tripStart);

    return {
      id: settlement.id,
      startDate: settlement.startDate,
      endDate: settlement.endDate,
      startDay: startDiff < 0 ? 0 : startDiff + 1,
      endDay: endDiff < 0 ? 0 : endDiff + 1,
    };
  });
}
