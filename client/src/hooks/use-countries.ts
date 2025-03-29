import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";

export function useCountries() {
  return useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });
}

export function useCountry(code: string | null) {
  return useQuery<Country>({
    queryKey: ["/api/countries", code],
    enabled: !!code,
  });
}

export function useSearchCountries(query: string) {
  return useQuery<Country[]>({
    queryKey: ["/api/search", query],
    enabled: query.length > 0,
  });
}
