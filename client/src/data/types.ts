/**
 * Country Data Types
 * These types define the structure for all country data files
 */

// Demographic data point (name-value pair)
export interface DataPoint {
  name: string;
  value: number;
}

// Demographic charts data
export interface DemographicsData {
  ageGroups: DataPoint[];
  religions: DataPoint[];
  urbanRural: DataPoint[];
  educationLevels: DataPoint[];
}

// Statistical charts data
export interface StatisticsData {
  gdpSectors: DataPoint[];
  employment: DataPoint[];
  trade: DataPoint[];
  spending: DataPoint[];
}

// Political leader information
export interface PoliticalLeader {
  name: string;
  title: string;
  party: string;
  inPowerSince: string; // Year or date when they took office
  imageUrl?: string; // Optional URL to the leader's image
  description: string; // Brief biography or description
}

// Political event
export interface PoliticalEvent {
  period: string;
  title: string;
  description: string;
  partyName: string;
  partyColor: string;
  tags: string[];
  order: number;
}

// Complete country data definition
export interface CountryData {
  // Basic information
  code: string;
  name: string;
  capital: string;
  population: number;
  region: string;
  flagCoordinates: [number, number];
  
  // Political leadership
  leader: PoliticalLeader;
  
  // Charts data
  demographics: DemographicsData;
  statistics: StatisticsData;
  
  // Political timeline
  events: PoliticalEvent[];
}