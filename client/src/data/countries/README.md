# Country Data Files

This folder contains individual country data files, each representing a single country in the application.

## How to Add a New Country

1. Create a new file named with the country's 3-letter ISO code (lowercase): `[iso].ts` (e.g., `usa.ts`, `fra.ts`, `deu.ts`).
2. Use the template in `client/src/data/countryTemplate.ts` as your starting point.
3. Fill in all the required data fields with accurate information.
4. Add a flag image in `client/src/assets/flags/[iso].svg` if desired.
5. The country will be automatically loaded into the application.

## Data Structure

Each country file must export a default `CountryData` object with the following structure:

```typescript
{
  // Basic Information
  code: string;         // 3-letter ISO code (lowercase)
  name: string;         // Full country name
  capital: string;      // Capital city name
  population: number;   // Total population
  region: string;       // Geographic region (must match a region in regionColors)
  flagCoordinates: [number, number]; // [longitude, latitude] center point
  
  // Leadership
  leader: {
    name: string;       // Leader's full name
    title: string;      // Official title
    party: string;      // Political party name
    inPowerSince: string; // Year of taking office
    imageUrl?: string;  // URL to leader's image (optional)
    description: string; // Brief biography
  };
  
  // Charts Data
  demographics: {...};  // Demographic information
  statistics: {...};    // Economic statistics
  
  // Political Timeline
  events: [{...}, ...]; // Political events of the last 30 years
}
```

## Example

See `usa.ts` or `fra.ts` for complete examples of properly formatted country data files.