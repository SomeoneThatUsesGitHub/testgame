# Adding Countries to the Political World Map

This guide explains how to add new countries to the application using the template-based file system.

## Overview

The application is designed to be easily extendable with new country data. Each country is defined in its own file, and when you add or modify these files, the changes are automatically detected and displayed in the application.

## Quick Start

1. Copy the template file `client/src/data/countryTemplate.ts` to create a new country file
2. Name the new file using the 3-letter ISO country code, e.g., `jpn.ts` for Japan
3. Fill in all the required data fields
4. Save the file and refresh the application

## Detailed Steps

### Step 1: Create a new country file

Copy the template file:
```
cp client/src/data/countryTemplate.ts client/src/data/countries/[iso].ts
```

Replace `[iso]` with the 3-letter ISO country code (lowercase), for example:
- `usa.ts` for United States
- `jpn.ts` for Japan
- `bra.ts` for Brazil

### Step 2: Edit the country data

Open the new file and replace all the placeholder data with actual country information:

1. **Basic Information**:
   - `code`: 3-letter ISO code (lowercase)
   - `name`: Full country name
   - `capital`: Capital city name
   - `population`: Current population (approximate)
   - `region`: Geographic region or continent
   - `flagCoordinates`: [longitude, latitude] for map positioning

2. **Political Leadership**:
   - Add information about the current leader
   - Include a photo URL if available (Wikipedia images work well)
   - Provide a brief but informative description

3. **Demographics & Statistics**:
   - Fill in data for all the demographic and statistical charts
   - Ensure percentages add up to approximately 100% in each category
   - Use reliable sources for accurate data

4. **Political Timeline**:
   - Add at least 3-5 significant political periods
   - Cover the last 30 years when possible
   - Provide descriptive titles and detailed descriptions
   - Use the `partyColor` values from the predefined color map:
     - "Conservative" (blue)
     - "Progressive" (red)
     - "Centrist" (yellow)
     - "Green" (green)
     - "Nationalist" (dark blue)
     - "Democratic" (light blue)
     - "Republican" (light red)
     - "Labour" (dark red)
     - "Liberal" (orange)
     - "Socialist" (pink)

### Step 3: Test and verify

After saving the file, reload the application and:

1. Find your country on the map
2. Click on it to open the country panel
3. Verify all tabs display correctly (Political, Demographics, Statistics)
4. Check that timeline events are properly ordered
5. Make sure all charts display correctly with appropriate labels

## Data Sources

For accurate and reliable country data, consider using these sources:

- **Basic Information**: CIA World Factbook, United Nations data
- **Political Leadership**: Official government websites, Wikipedia
- **Demographics & Statistics**: World Bank, IMF, national statistics offices
- **Timeline Events**: Historical archives, encyclopedia entries, academic sources

## Synchronizing Data

If you notice that your new country doesn't appear in the application after refreshing, you can manually trigger a synchronization:

1. Open your browser's JavaScript console
2. Run this command to sync the country data to the backend:
   ```javascript
   import { syncNow } from './data/countrySyncer'; syncNow();
   ```
3. Refresh the page after the synchronization completes

## Troubleshooting

- **Country doesn't appear on the map**: Check that the `code` matches the ISO 3-letter code exactly
- **Charts don't display**: Verify that all data points have valid numeric values
- **Timeline appears empty**: Check the `order` field for proper sequencing
- **Leader photo doesn't show**: Confirm the `imageUrl` is a direct link to an image file

## Examples

For reference, look at these example country files:
- `client/src/data/countries/usa.ts` - United States
- `client/src/data/countries/deu.ts` - Germany
- `client/src/data/countries/fra.ts` - France