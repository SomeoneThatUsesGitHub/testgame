import { useQuery } from "@tanstack/react-query";
import { CountryWithEvents, PoliticalEvent, PoliticalLeader } from "@shared/schema";

export function useCountryWithEvents(countryCode: string | null) {
  return useQuery<CountryWithEvents>({
    queryKey: [`/api/countries/${countryCode}/with-events`],
    enabled: !!countryCode,
  });
}

export function usePoliticalEvents(countryCode: string | null) {
  return useQuery<PoliticalEvent[]>({
    queryKey: [`/api/countries/${countryCode}/events`],
    enabled: !!countryCode,
  });
}

export function usePoliticalLeader(countryCode: string | null) {
  return useQuery<PoliticalLeader>({
    queryKey: [`/api/countries/${countryCode}/leader`],
    enabled: !!countryCode,
  });
}
