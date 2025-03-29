/**
 * Country Data Loader
 * Automatically loads all country data from individual files
 */

import { countryCoordinates } from '../config/countryData';
import type { CountryData, PoliticalEvent as FrontendPoliticalEvent, PoliticalLeader as FrontendPoliticalLeader } from './types';

// Define types for the backend format
interface BackendCountry {
  id?: number;
  code: string;
  name: string;
  capital: string;
  population: number;
  color: string;
  region: string | null;
}

interface BackendPoliticalEvent {
  id?: number;
  countryCode: string;
  period: string;
  title: string;
  description: string;
  partyName: string | null;
  partyColor: string | null;
  tags: string[] | null;
  order: number;
}

interface BackendPoliticalLeader {
  id?: number;
  countryCode: string;
  name: string;
  title: string;
  party: string;
  inPowerSince: string;
  imageUrl: string | null;
  description: string;
}

// Dynamically import all country files from the countries directory
// This uses Vite's import.meta.glob feature to automatically include all files
const countryModules = import.meta.glob('./countries/*.ts', { eager: true });

// Extract the CountryData objects from the imported modules
export const countryDataCollection: CountryData[] = Object.values(countryModules)
  .map((module: any) => module.default)
  .filter((item): item is CountryData => !!item && typeof item === 'object' && 'code' in item);

// Log the loaded country data
console.log(`Loaded ${countryDataCollection.length} countries from data files`);
console.log(`Country codes loaded: ${countryDataCollection.map(c => c.code).join(', ')}`);

// Utility functions to access country data
export const getCountryCodes = (): string[] => {
  return countryDataCollection.map(country => country.code);
};

export const getCountryCoordinates = (): Record<string, [number, number]> => {
  // Combine hardcoded coordinates with flag coordinates from country files
  const coordinates: Record<string, [number, number]> = { ...countryCoordinates };
  
  countryDataCollection.forEach(country => {
    if (country.flagCoordinates) {
      coordinates[country.code] = country.flagCoordinates;
    }
  });
  
  return coordinates;
};

export const getCountryByCode = (code: string): CountryData | undefined => {
  return countryDataCollection.find(country => country.code === code);
};

// Convert frontend CountryData to backend Country format
export const convertToBackendFormat = (): BackendCountry[] => {
  return countryDataCollection.map(country => ({
    id: 0, // This will be assigned by the backend
    code: country.code,
    name: country.name,
    capital: country.capital,
    population: country.population,
    // Add a default color if not provided
    color: '#DBEAFE', 
    region: country.region || null
  }));
};

// Convert frontend PoliticalEvent to backend format
export const convertEventsToBackendFormat = (): BackendPoliticalEvent[] => {
  const events: BackendPoliticalEvent[] = [];
  
  countryDataCollection.forEach(country => {
    if (country.events && Array.isArray(country.events)) {
      country.events.forEach(event => {
        events.push({
          id: 0, // This will be assigned by the backend
          countryCode: country.code,
          period: event.period,
          title: event.title,
          description: event.description,
          partyName: event.partyName || null,
          partyColor: event.partyColor || null,
          tags: event.tags || null,
          order: event.order
        });
      });
    }
  });
  
  return events;
};

// Convert frontend PoliticalLeader to backend format
export const convertLeadersToBackendFormat = (): BackendPoliticalLeader[] => {
  const leaders: BackendPoliticalLeader[] = [];
  
  countryDataCollection.forEach(country => {
    if (country.leader) {
      leaders.push({
        id: 0, // This will be assigned by the backend
        countryCode: country.code,
        name: country.leader.name,
        title: country.leader.title,
        party: country.leader.party,
        inPowerSince: country.leader.inPowerSince,
        imageUrl: country.leader.imageUrl || null,
        description: country.leader.description
      });
    }
  });
  
  return leaders;
};

// Helper functions to get specific data for a country
export const getCountryDemographics = (countryCode: string) => {
  const country = getCountryByCode(countryCode);
  return country?.demographics;
};

export const getCountryStatistics = (countryCode: string) => {
  const country = getCountryByCode(countryCode);
  return country?.statistics;
};

export const getCountryEvents = (countryCode: string): FrontendPoliticalEvent[] | undefined => {
  const country = getCountryByCode(countryCode);
  return country?.events;
};

export const getCountryLeader = (countryCode: string): FrontendPoliticalLeader | undefined => {
  const country = getCountryByCode(countryCode);
  return country?.leader;
};

// Function to prepare the data in the format expected by the backend sync API
export const initializeBackendData = async () => {
  const countries = convertToBackendFormat();
  const events = convertEventsToBackendFormat();
  const leaders = convertLeadersToBackendFormat();
  
  console.log(`Country data loaded from files: ${countries.length} countries`);
  
  return {
    countries,
    events,
    leaders
  };
};

// Export the collection as the default export
export default countryDataCollection;