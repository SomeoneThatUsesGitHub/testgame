/**
 * Country Data Template
 * 
 * HOW TO USE:
 * 1. Copy this file to client/src/data/countries/[iso].ts (e.g., usa.ts, deu.ts)
 * 2. Replace the placeholder data with actual country information
 * 3. Import and add the flag SVG file to assets/flags/[iso].svg
 * 4. The country will be automatically added to the application
 */

import { CountryData } from "./types";
// Uncomment and adjust the path to the actual flag file
// import flagImage from "../assets/flags/xyz.svg";

const countryData: CountryData = {
  // Basic Information
  code: "xyz", // 3-letter ISO code (lowercase)
  name: "Country Name",
  capital: "Capital City",
  population: 0, // Total population
  region: "Region", // Must match a region in regionColors (map-utils.ts)
  flagCoordinates: [0, 0], // [longitude, latitude] center point of country
  
  // Demographics Data
  demographics: {
    // Population by age group (percentages)
    ageGroups: [
      { name: "0-14", value: 0 },
      { name: "15-24", value: 0 },
      { name: "25-54", value: 0 },
      { name: "55-64", value: 0 },
      { name: "65+", value: 0 }
    ],
    // Population by religion (percentages)
    religions: [
      { name: "Religion 1", value: 0 },
      { name: "Religion 2", value: 0 },
      { name: "Other", value: 0 }
    ],
    // Urban vs Rural (percentages)
    urbanRural: [
      { name: "Urban", value: 0 },
      { name: "Rural", value: 0 }
    ],
    // Education levels (percentages)
    educationLevels: [
      { name: "Primary", value: 0 },
      { name: "Secondary", value: 0 },
      { name: "Tertiary", value: 0 }
    ]
  },
  
  // Economic Statistics
  statistics: {
    // GDP Breakdown by sector (percentages)
    gdpSectors: [
      { name: "Agriculture", value: 0 },
      { name: "Industry", value: 0 },
      { name: "Services", value: 0 }
    ],
    // Employment by sector (percentages)
    employment: [
      { name: "Agriculture", value: 0 },
      { name: "Industry", value: 0 },
      { name: "Services", value: 0 }
    ],
    // Exports & Imports (annual in billions USD)
    trade: [
      { name: "Exports", value: 0 },
      { name: "Imports", value: 0 }
    ],
    // Government spending (% of GDP)
    spending: [
      { name: "Defense", value: 0 },
      { name: "Education", value: 0 },
      { name: "Healthcare", value: 0 }
    ]
  },
  
  // Political Events (last 30 years)
  events: [
    {
      period: "YYYY-YYYY", // Year span of the event
      title: "Event Title",
      description: "Event description with details about political significance...",
      partyName: "Political Party", 
      partyColor: "PartyName", // Must match a party in partyColorMap (map-utils.ts)
      tags: ["Tag1", "Tag2"], // Short themes/keywords
      order: 1 // Chronological order (1 is earliest)
    },
    // Add more events as needed...
  ]
};

export default countryData;