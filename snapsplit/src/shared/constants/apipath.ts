export const enum apiPath {
  home = "/home",
  past = "/trips/past",
  joinTrip = "/trips/join",
  countries = "/countries",
  split = "/trips/{tripId}/settlements",
  users = "/users/code/{userCode}",
  budget = "/trips/{tripId}/expenses",
  tripCode = "/trips/{tripId}/tripcode",
  trips = "/trips/{tripId}",
}