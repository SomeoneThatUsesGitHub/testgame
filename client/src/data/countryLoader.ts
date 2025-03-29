/**
 * Country Data Loader
 * Automatically loads all country data from individual files
 */

import { CountryData } from "./types";
import { regionColorsMap, partyColorMap } from "../config/countryData";

// Auto-import all country data files using Vite's import.meta.glob
// This automatically includes any files in the countries directory
const countryModules = import.meta.glob('./countries/*.ts', { eager: true });

// Compile all country data into a single collection
export const countryDataCollection: CountryData[] = Object.values(countryModules)
  .filter((module: any) => module.default && module.default.code)
  .map((module: any) => module.default);

console.log(`Loaded ${countryDataCollection.length} countries from data files`);

// Get all country codes for flags to display
export const getCountryCodes = (): string[] => {
  return countryDataCollection.map(country => country.code);
};

// Get country flag coordinates
export const getCountryCoordinates = (): Record<string, [number, number]> => {
  const coordinates: Record<string, [number, number]> = {};
  
  countryDataCollection.forEach(country => {
    coordinates[country.code] = country.flagCoordinates;
  });
  
  return coordinates;
};

// Convert country data to backend-compatible format
export const convertToBackendFormat = () => {
  return countryDataCollection.map(country => ({
    id: 0, // Will be assigned by backend
    code: country.code,
    name: country.name,
    capital: country.capital,
    population: country.population,
    color: regionColorsMap[country.region] || "#CCCCCC",
    region: country.region
  }));
};

// Convert events to backend-compatible format
export const convertEventsToBackendFormat = () => {
  const allEvents: any[] = [];
  
  countryDataCollection.forEach(country => {
    const countryEvents = country.events.map(event => ({
      id: 0, // Will be assigned by backend
      countryCode: country.code,
      period: event.period,
      title: event.title,
      description: event.description,
      partyName: event.partyName,
      partyColor: event.partyColor,
      tags: event.tags,
      order: event.order
    }));
    
    allEvents.push(...countryEvents);
  });
  
  return allEvents;
};

// Get demographics data for a specific country
export const getCountryDemographics = (countryCode: string) => {
  const country = countryDataCollection.find(c => c.code === countryCode);
  return country ? country.demographics : null;
};

// Get statistics data for a specific country
export const getCountryStatistics = (countryCode: string) => {
  const country = countryDataCollection.find(c => c.code === countryCode);
  return country ? country.statistics : null;
};

// Get all events for a specific country
export const getCountryEvents = (countryCode: string) => {
  const country = countryDataCollection.find(c => c.code === countryCode);
  return country ? country.events : [];
};

// Export a function that will initialize the backend with data from files
export const initializeBackendData = async () => {
  const countries = convertToBackendFormat();
  const events = convertEventsToBackendFormat();
  
  // This would be used to sync with the backend
  console.log(`Loaded ${countries.length} countries with ${events.length} events from data files`);
  
  return { countries, events };
};