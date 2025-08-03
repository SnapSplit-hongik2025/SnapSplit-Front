 export type Trip = {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  countryNames: string[];
 };

export interface CreateTripSectionProps{
  upcomingTrips: Trip[];
  ongoingTrips: Trip[];
}

export interface CurrentTripListProps {
  upcomingTrips: Trip[];
  ongoingTrips: Trip[];
}

export type UpcomingTripProps = {
  tripName: string;
  tripCountry: string;
  tripDate: string;
  dDay: string;
};

export type PastTripCardProp = {
  tripName: string;
  tripDate: string;
}

export type PastTripListProps = {
  tripName: string;
  tripStartDate: string;
  tripEndDate: string;
}