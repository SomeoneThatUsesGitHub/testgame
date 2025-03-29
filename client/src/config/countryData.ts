/**
 * Country Data Configuration
 * This file contains mappings and settings for country data display
 */

import { regionColors, partyColorMap as partyColors } from "../lib/map-utils";

// Map of country codes to flag image paths (for future use with SVG flags)
export const countryFlagMap: Record<string, string> = {
  "usa": "/src/assets/flags/usa.svg",
  "fra": "/src/assets/flags/fra.svg",
  // Add more as flags are created
};

// Map of country codes to coordinates for flag positioning on map
export const countryCoordinates: Record<string, [number, number]> = {
  "usa": [-98, 39],
  "can": [-95, 60],
  "mex": [-102, 23],
  "bra": [-55, -10],
  "arg": [-65, -34],
  "gbr": [-2, 54],
  "fra": [2.5, 46.5],
  "deu": [10, 51],
  "ita": [12, 43],
  "esp": [-4, 40],
  "rus": [90, 62],
  "chn": [105, 35],
  "ind": [78, 21],
  "aus": [134, -25],
  "jpn": [138, 36],
  "zaf": [25, -29],
  "egy": [30, 27],
  // Add more as needed
};

// List of countries to show flags for on the map (initial set)
export const flagDisplayList = [
  "usa", "can", "mex", "bra", "arg", 
  "gbr", "fra", "deu", "ita", "esp",
  "rus", "chn", "ind", "aus", "jpn", 
  "zaf", "egy"
];

// Re-export color mappings from map-utils for convenience
export const regionColorsMap = regionColors;
export const partyColorMap = partyColors;

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