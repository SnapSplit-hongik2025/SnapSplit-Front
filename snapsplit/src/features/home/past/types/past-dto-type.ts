import { TripDto } from "../../types/home-type";

export type PastTripSummaryProps = {
  totalTrips: number;
  totalCountries: number;
};

export type GetPastTripResponseDto = {
  trips: TripDto[];
  totalTrips: number;
  totalCountries: number;
};
