# World Political Map - Country Reference Guide

This documentation provides guidelines for adding new countries to the World Political Map application.

## Quick Start

The easiest way to add a new country is to use the included script:

```bash
node scripts/add-country.js
```

This interactive script will prompt you for all necessary country information and generate the code snippets you need to add.

## Manual Country Addition

If you prefer to add countries manually, follow these steps:

### 1. Country Data Structure

Each country requires the following information:

```typescript
// Country basic data
{
  code: string;        // 3-letter ISO code (lowercase)
  name: string;        // Full country name
  capital: string;     // Capital city name
  population: number;  // Approximate population
  color: string;       // Hex color code
  region: string;      // Geographic region
}

// Political leader data
{
  countryCode: string;    // Same 3-letter ISO code
  name: string;           // Leader's full name
  title: string;          // Official title
  party: string;          // Political party
  inPowerSince: string;   // Year they took power
  imageUrl: string;       // URL to leader image
  description: string;    // Brief description
}
```

### 2. Adding to the Application

To add a new country, edit `server/storage.ts`:

1. Create a country data object inside the `initializeData` method:

```typescript
const newCountryData: InsertCountry = {
  code: "iso",        // 3-letter ISO code in lowercase
  name: "Name",       // Full country name
  capital: "Capital", // Capital city
  population: 123456, // Approximate population
  color: "#HEX",      // Hex color (can use regionColors)
  region: "Region"    // Geographic region
};
```

2. Add the country to the storage:

```typescript
this.addCountry(newCountryData);
```

3. Add events using the addPoliticalEvent method or use the basic events helper:

```typescript
this.addBasicEventsForCountry("iso", "CountryName");
```

### 3. Custom Events

To add custom events for a specific country:

```typescript
const customEvents: InsertPoliticalEvent[] = [
  {
    countryCode: "iso",
    period: "YYYY-YYYY",
    title: "Event Title",
    description: "Detailed description of the political event...",
    partyColor: "PartyName", // Use a key from partyColorMap
    partyName: "Party Name",
    tags: ["Tag1", "Tag2"],
    order: 1 // Chronological order
  },
  // Additional events...
];

customEvents.forEach(event => this.addPoliticalEvent(event));
```

## Region Names

Consistent region names help with filtering and coloring:

- North America
- South America
- Europe
- Asia
- Africa
- Oceania
- Europe/Asia (for transcontinental countries)
- Middle East

## Color Guidelines

For visual consistency, use these color codes by region:

- Blue variants: #60A5FA, #93C5FD, #DBEAFE
- Use similar colors for countries in the same region
- Ensure neighboring countries have distinguishable colors

## ISO Country Codes

Use the 3-letter ISO 3166-1 alpha-3 country codes in lowercase.
Examples: usa, can, gbr, fra, deu, jpn, chn, ind, bra, aus, zaf, egy

## Political Leader Information

When adding political leader data:

- Use official titles (President, Prime Minister, Chancellor, etc.)
- Provide a brief, factual description of their political career
- Include the year they took office
- If including an image URL, ensure it's publicly available and has appropriate usage rights

## Additional Resources

- [ISO 3166-1 alpha-3 country codes reference](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)
- [World Leaders Database](https://en.wikipedia.org/wiki/List_of_current_heads_of_state_and_government)
