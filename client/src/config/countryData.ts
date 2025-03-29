/**
 * Country Data Configuration
 * This file serves as a central configuration for managing country data
 * in the geopolitical visualization platform.
 * 
 * HOW TO ADD A NEW COUNTRY:
 * 1. Add a new import for the flag SVG in the imports section
 * 2. Add the country to the countryFlagMap object with its ISO code and flag import
 * 3. Add the country to the countryCoordinates object with its map position
 * 
 * Note: Flag SVGs should be placed in client/src/assets/flags/ with the ISO code as filename
 * Example: usa.svg, deu.svg, fra.svg, etc.
 */

// Import color definitions from map-utils
import { regionColors as regionColorsMap, partyColorMap as partyColorsMap } from "../lib/map-utils";

// Flag SVG imports - add new flags here
import usaFlag from "../assets/flags/usa.svg";
import rusFlag from "../assets/flags/rus.svg";
import chnFlag from "../assets/flags/chn.svg";
import indFlag from "../assets/flags/ind.svg";
import fraFlag from "../assets/flags/fra.svg";
// Add more flag imports as needed
// import deuFlag from "../assets/flags/deu.svg";
// import gbrFlag from "../assets/flags/gbr.svg";

// Map of country ISO codes to flag images - add new entries here
export const countryFlagMap: Record<string, string> = {
  usa: usaFlag,  // United States
  rus: rusFlag,  // Russia
  chn: chnFlag,  // China
  ind: indFlag,  // India
  fra: fraFlag,  // France
  // Add more countries as needed:
  // deu: deuFlag, // Germany
  // gbr: gbrFlag, // United Kingdom
};

// Map of country ISO codes to map coordinates - add new entries here
export const countryCoordinates: Record<string, [number, number]> = {
  usa: [-98, 39],    // United States
  rus: [100, 62],    // Russia
  chn: [103, 35],    // China
  ind: [78, 22],     // India
  fra: [2.5, 46.5],  // France
  // Add more country coordinates as needed:
  // deu: [10.5, 51.5],  // Germany
  // gbr: [-2, 54],      // United Kingdom
};

// List of countries for which to display flags - manage visibility here
export const flagDisplayList = [
  "usa", "rus", "chn", "ind", "fra"
  // Add more country codes to show more flags
];

// Export the region colors and party colors for use in other components
export const regionColors = regionColorsMap;
export const partyColorMap = partyColorsMap;

/**
 * HOW TO ADD EVENTS FOR A COUNTRY:
 * 
 * In the server/storage.ts file, locate the initializeData() method and:
 * 
 * 1. Add a new country data object:
 *    const newCountryData: InsertCountry = {
 *      code: "iso",        // 3-letter ISO code in lowercase
 *      name: "Name",       // Full country name
 *      capital: "Capital", // Capital city
 *      population: 123456, // Approximate population
 *      color: "#HEX",      // Hex color (can use regionColors)
 *      region: "Region"    // Geographic region
 *    };
 * 
 * 2. Add the country to the storage:
 *    this.addCountry(newCountryData);
 * 
 * 3. Add events using the addPoliticalEvent method:
 *    this.addPoliticalEvent({
 *      countryCode: "iso",
 *      period: "YYYY-YYYY",
 *      title: "Event Title",
 *      description: "Detailed description of the political event...",
 *      partyColor: "PartyName", // Use a key from partyColorMap
 *      partyName: "Party Name",
 *      tags: ["Tag1", "Tag2"],
 *      order: 1 // Chronological order
 *    });
 */