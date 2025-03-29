# Adding Countries to the Geopolitics Visualization Platform

This guide explains how to easily add new countries or modify existing country data in the application. The system is designed to be maintainable by non-technical users with basic knowledge of data formatting.

## Quick Start Guide

1. Create a country data file in `client/src/data/countries/` folder using the 3-letter ISO code as the filename (e.g., `usa.ts`, `fra.ts`, `deu.ts`).
2. Copy the template from `client/src/data/countryTemplate.ts` into your new file.
3. Fill in all the required fields with accurate country information.
4. Save the file.
5. The country will be automatically loaded into the application - no code changes required!

## Detailed Process

### 1. Create the Country Data File

Each country is stored in its own file under the `client/src/data/countries/` directory. The filename should be the 3-letter ISO code for the country (in lowercase), for example:

- `usa.ts` for the United States
- `fra.ts` for France
- `deu.ts` for Germany
- `jpn.ts` for Japan

### 2. Use the Template

The easiest way to add a new country is to copy the template from `client/src/data/countryTemplate.ts`. This template contains all the required fields with sample/placeholder values.

### 3. Fill in Country Information

Edit your new country file, filling in all required information:

#### Basic Country Information
```typescript
// Basic Information
code: "xyz",                // 3-letter ISO code (lowercase)
name: "Country Name",       // Full country name
capital: "Capital City",    // Capital city name
population: 1000000,        // Total population
region: "Region",           // Geographic region (must match a region in regionColors)
flagCoordinates: [0, 0],    // [longitude, latitude] center point
```

#### Political Leadership
```typescript
// Current Political Leadership
leader: {
  name: "Leader Name",
  title: "President/Prime Minister/etc.",
  party: "Political Party", 
  inPowerSince: "YYYY",     // Year when they took office
  imageUrl: "https://example.com/leader-image.jpg", // Leader image URL
  description: "Brief biography or description of the current political leader..."
},
```

#### Demographics Data
```typescript
// Demographics Data (all values should be percentages)
demographics: {
  // Population by age group
  ageGroups: [
    { name: "0-14", value: 20 },     // 20% of population
    { name: "15-24", value: 15 },    // 15% of population
    // Add more age groups...
  ],
  // Population by religion
  religions: [
    { name: "Religion 1", value: 70 },
    { name: "Religion 2", value: 20 },
    { name: "Other", value: 10 }
  ],
  // Urban vs Rural
  urbanRural: [
    { name: "Urban", value: 75 },
    { name: "Rural", value: 25 }
  ],
  // Education levels
  educationLevels: [
    { name: "Primary", value: 95 },
    { name: "Secondary", value: 80 },
    { name: "Tertiary", value: 35 }
  ]
},
```

#### Economic Statistics
```typescript
// Economic Statistics
statistics: {
  // GDP Breakdown by sector (percentages)
  gdpSectors: [
    { name: "Agriculture", value: 5 },
    { name: "Industry", value: 25 },
    { name: "Services", value: 70 }
  ],
  // Employment by sector (percentages)
  employment: [
    { name: "Agriculture", value: 5 },
    { name: "Industry", value: 25 },
    { name: "Services", value: 70 }
  ],
  // Exports & Imports (% of GDP)
  trade: [
    { name: "Exports", value: 25 },
    { name: "Imports", value: 30 }
  ],
  // Government spending (% of GDP)
  spending: [
    { name: "Defense", value: 2 },
    { name: "Education", value: 5 },
    { name: "Healthcare", value: 10 }
  ]
},
```

#### Political Events
```typescript
// Political Events (last 30 years)
events: [
  {
    period: "1990-1995",            // Year span of the event
    title: "First Administration",
    description: "Detailed description of this political period...",
    partyName: "Party Name",        // Ruling party's name
    partyColor: "PartyName",        // Must match a party in partyColorMap
    tags: ["Tag1", "Tag2"],         // Short themes/keywords
    order: 1                        // Chronological order (1 is earliest)
  },
  {
    period: "1995-2000",
    title: "Second Administration",
    description: "Description of political changes during this period...",
    partyName: "Another Party",
    partyColor: "AnotherParty",
    tags: ["Reform", "Economic Growth"],
    order: 2
  },
  // Add more events...
]
```

### 4. Timeline Events Format

For the timeline events, follow these guidelines:

1. Events should be ordered chronologically.
2. Each event must have a unique `order` number (1 is earliest).
3. The `period` should be in "YYYY-YYYY" format (or "YYYY-Present" for ongoing periods).
4. The `partyColor` should match one of the color keys in `partyColorMap` (found in `client/src/lib/map-utils.ts`).
5. Include 2-4 relevant tags for each event.

### 5. Adding Flag Images (Optional)

If you want to add a flag image:

1. Save the flag as an SVG file in `client/src/assets/flags/` using the 3-letter ISO code as the filename (e.g., `usa.svg`).
2. Uncomment and update the flag import in your country file:
```typescript
import flagImage from "../../assets/flags/xyz.svg";
```

## Available Color Options

### Region Colors
These are used for coloring countries on the map. Use one of these region names:

- North America
- South America
- Europe
- Asia
- Africa
- Oceania
- Middle East

### Party Colors
These are used for coloring events in the timeline. Use one of these party names:

- Democratic
- Republican
- Conservative
- Labour
- Liberal
- Green
- Socialist
- Centrist
- Nationalist
- Communist
- Independent
- Coalition

## Testing Your Changes

After saving your new country file, the application will automatically load it. Verify your country data by:

1. Restarting the application if necessary
2. Clicking on your country on the map
3. Checking that all data displays correctly in the country panel

## Troubleshooting

If your country doesn't appear:

1. Check that the filename uses the correct 3-letter ISO code (lowercase)
2. Verify that all required fields are filled in correctly
3. Make sure the file exports the country data as the default export
4. Check for any formatting errors or typos