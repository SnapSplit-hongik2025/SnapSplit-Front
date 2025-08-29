export type TripDto = {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  countryNames: string[];
  tripImage?: string;
};

export type GetHomeResponseDto = {
  upcomingTrips: TripDto[];
  ongoingTrips: TripDto[];
  pastTrips: TripDto[];
};

export interface CreateTripSectionProps{
  upcomingTrips?: TripDto[];
  ongoingTrips?: TripDto[];
}

export interface CurrentTripListProps {
  upcomingTrips?: TripDto[];
  ongoingTrips?: TripDto[];
}

export type UpcomingTripProps = {
  tripName: string;
  tripCountry: string;
  tripDate: string;
  dDay: string;
};

export interface PastTripImgCardListProps {
  pastTrips: TripDto[];
}

export type PastTripCardProp = {
  tripName: string;
  tripDate: string;
}

export type PastTripListProps = TripDto;


export interface AllPastTripListProps {
  pastTrips: TripDto[];
}