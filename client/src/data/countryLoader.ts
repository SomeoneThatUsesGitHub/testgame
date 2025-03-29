/**
 * Country Data Loader
 * Automatically loads all country data from individual files
 */

import { CountryData } from "./types";
import { regionColorsMap, partyColorMap } from "../config/countryData";

// Import all country data files
// This will need to be updated when new country files are added
import usaData from "./countries/usa";
import fraData from "./countries/fra";
// import deuData from "./countries/deu";
// Add more country imports as they're created

// Compile all country data into a single collection
export const countryDataCollection: CountryData[] = [
  usaData,
  fraData,
  // deuData,
  // Add more countries as they're created
];

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