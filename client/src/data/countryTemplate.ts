/**
 * Country Data Template
 * 
 * HOW TO USE:
 * 1. Copy this file to client/src/data/countries/[iso].ts (e.g., usa.ts, deu.ts)
 * 2. Replace the placeholder data with actual country information
 * 3. Import and add the flag SVG file to assets/flags/[iso].svg
 * 4. The country will be automatically added to the application
 */

import type { CountryData } from '../types';

const countryData: CountryData = {
  // Basic country information
  code: "xyz", // 3-letter ISO code (lowercase)
  name: "Country Name",
  capital: "Capital City", 
  population: 50000000,
  region: "Continent or Region",
  flagCoordinates: [0, 0], // [longitude, latitude] for map positioning
  
  // Current political leader
  leader: {
    name: "Leader Name",
    title: "President/Prime Minister/etc.",
    party: "Political Party",
    inPowerSince: "2020", // Year when took office
    imageUrl: "https://example.com/leader.jpg", // Optional: URL to leader image
    description: "Brief biography of the leader including background, political journey, and significant achievements."
  },
  
  // Demographics data (for pie charts)
  demographics: {
    // Age distribution
    ageGroups: [
      { name: "0-14", value: 20 },
      { name: "15-24", value: 15 },
      { name: "25-54", value: 40 },
      { name: "55-64", value: 15 },
      { name: "65+", value: 10 }
    ],
    
    // Religious distribution
    religions: [
      { name: "Major Religion", value: 75 },
      { name: "Secondary Religion", value: 15 },
      { name: "Other Religions", value: 5 },
      { name: "Non-religious", value: 5 }
    ],
    
    // Urban/Rural distribution
    urbanRural: [
      { name: "Urban", value: 70 },
      { name: "Rural", value: 30 }
    ],
    
    // Education level distribution
    educationLevels: [
      { name: "Primary", value: 20 },
      { name: "Secondary", value: 40 },
      { name: "Tertiary", value: 30 },
      { name: "None", value: 10 }
    ]
  },
  
  // Economic statistics (for pie charts)
  statistics: {
    // GDP by sector
    gdpSectors: [
      { name: "Agriculture", value: 10 },
      { name: "Industry", value: 30 },
      { name: "Services", value: 60 }
    ],
    
    // Employment by sector
    employment: [
      { name: "Agriculture", value: 15 },
      { name: "Industry", value: 25 },
      { name: "Services", value: 60 }
    ],
    
    // Trade partners (top 4)
    trade: [
      { name: "Partner 1", value: 30 },
      { name: "Partner 2", value: 25 },
      { name: "Partner 3", value: 15 },
      { name: "Partner 4", value: 10 }
    ],
    
    // Government spending by category
    spending: [
      { name: "Healthcare", value: 20 },
      { name: "Education", value: 15 },
      { name: "Defense", value: 10 },
      { name: "Infrastructure", value: 15 },
      { name: "Other", value: 40 }
    ]
  },
  
  // Political timeline events (sorted chronologically by order field)
  events: [
    {
      period: "1990-1995",
      title: "First Political Period",
      description: "Description of significant political events that occurred during this period.",
      partyName: "Ruling Party",
      partyColor: "Conservative", // Use value from partyColorMap in map-utils.ts
      tags: ["Democracy", "Reform"],
      order: 1
    },
    {
      period: "1995-2002",
      title: "Second Political Period",
      description: "Description of significant political events that occurred during this period.",
      partyName: "Opposition Party",
      partyColor: "Progressive", // Use value from partyColorMap in map-utils.ts
      tags: ["Social Welfare", "Economic Growth"],
      order: 2
    },
    {
      period: "2002-2010",
      title: "Third Political Period",
      description: "Description of significant political events that occurred during this period.",
      partyName: "Coalition Government",
      partyColor: "Centrist", // Use value from partyColorMap in map-utils.ts
      tags: ["International Relations", "Security"],
      order: 3
    },
    {
      period: "2010-2018",
      title: "Fourth Political Period",
      description: "Description of significant political events that occurred during this period.",
      partyName: "Ruling Party",
      partyColor: "Conservative", // Use value from partyColorMap in map-utils.ts
      tags: ["Economic Reform", "Technology"],
      order: 4
    },
    {
      period: "2018-Present",
      title: "Current Political Period",
      description: "Description of ongoing political developments and current administration policies.",
      partyName: "Current Ruling Party",
      partyColor: "Progressive", // Use value from partyColorMap in map-utils.ts
      tags: ["Climate Policy", "Digital Transformation"],
      order: 5
    }
  ]
};

export default countryData;