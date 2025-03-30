#!/usr/bin/env node

/**
 * Add Country Coordinates Script
 * This script helps add or update country coordinates for the map visualization.
 * 
 * Usage: 
 *   node scripts/add-coordinates.js
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Path to the config file
const configFilePath = path.join(__dirname, '..', 'client', 'src', 'lib', 'map-utils.ts');

// Function to extract existing coordinates
async function extractExistingCoordinates() {
  try {
    // Read the existing file
    const fileContent = await fs.promises.readFile(configFilePath, 'utf8');
    
    // Find the coordinatesMap variable
    const coordinatesRegex = /export const countryCoordinates: Record<string, \[number, number\]> = \{([\s\S]*?)\};/;
    const match = fileContent.match(coordinatesRegex);
    
    if (match && match[1]) {
      // Parse the existing coordinates
      const existingCoords = {};
      const lines = match[1].split('\n');
      
      for (const line of lines) {
        const entryMatch = line.match(/"([a-z]{3})": \[([-\d.]+), ([-\d.]+)\]/);
        if (entryMatch) {
          const [, code, lat, lng] = entryMatch;
          existingCoords[code] = [parseFloat(lat), parseFloat(lng)];
        }
      }
      
      return {
        exists: true,
        coords: existingCoords,
        fullMatch: match[0]
      };
    }
    
    return {
      exists: false,
      coords: {},
      fullMatch: ''
    };
  } catch (error) {
    console.error(`${colors.red}Error reading coordinates file:${colors.reset}`, error);
    return {
      exists: false,
      coords: {},
      fullMatch: ''
    };
  }
}

// Function to update coordinates
async function updateCoordinates(existingData, newCoords) {
  try {
    // Read the existing file
    const fileContent = await fs.promises.readFile(configFilePath, 'utf8');
    
    // Combine existing and new coordinates
    const combinedCoords = { ...existingData.coords, ...newCoords };
    
    // Generate the new coordinates object
    let newCoordinatesText = 'export const countryCoordinates: Record<string, [number, number]> = {\n';
    
    Object.entries(combinedCoords)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort by country code
      .forEach(([code, [lat, lng]]) => {
        newCoordinatesText += `  "${code}": [${lat}, ${lng}],\n`;
      });
    
    newCoordinatesText += '};';
    
    // Replace the old coordinates block with the new one
    const updatedContent = existingData.exists
      ? fileContent.replace(existingData.fullMatch, newCoordinatesText)
      : fileContent.replace(/\/\/ Add country coordinates here/, newCoordinatesText);
    
    // Write the updated content back to the file
    await fs.promises.writeFile(configFilePath, updatedContent, 'utf8');
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error updating coordinates file:${colors.reset}`, error);
    return false;
  }
}

// Main function to run the script
async function main() {
  console.log(`${colors.bright}${colors.blue}=== Country Coordinates Manager ===${colors.reset}\n`);
  console.log(`${colors.cyan}This tool helps manage country coordinates for the map visualization.${colors.reset}\n`);
  
  // Extract existing coordinates
  const existingData = await extractExistingCoordinates();
  
  if (existingData.exists) {
    console.log(`${colors.green}Found ${Object.keys(existingData.coords).length} existing country coordinates.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}No existing coordinates found. Creating new coordinates map.${colors.reset}`);
  }
  
  const newCoordinates = {};
  let addAnother = true;
  
  while (addAnother) {
    // Get country code
    const countryCode = await promptInput('\nEnter 3-letter country code (lowercase): ', 
      (code) => /^[a-z]{3}$/.test(code));
    
    if (existingData.coords[countryCode]) {
      console.log(`${colors.yellow}Country ${countryCode} already has coordinates: [${existingData.coords[countryCode]}]${colors.reset}`);
      const update = await promptInput('Update these coordinates? (y/n): ',
        (answer) => /^[yn]$/i.test(answer));
      
      if (update.toLowerCase() !== 'y') {
        const another = await promptInput('Add another country? (y/n): ',
          (answer) => /^[yn]$/i.test(answer));
        addAnother = another.toLowerCase() === 'y';
        continue;
      }
    }
    
    // Get coordinates
    console.log(`${colors.dim}Enter coordinates as decimal values (e.g., latitude 34.5, longitude -20.75)${colors.reset}`);
    const latitude = await promptInput('Latitude: ', 
      (lat) => !isNaN(parseFloat(lat)),
      (lat) => parseFloat(lat));
    
    const longitude = await promptInput('Longitude: ', 
      (lng) => !isNaN(parseFloat(lng)),
      (lng) => parseFloat(lng));
    
    // Add to new coordinates
    newCoordinates[countryCode] = [latitude, longitude];
    console.log(`${colors.green}Added coordinates for ${countryCode}: [${latitude}, ${longitude}]${colors.reset}`);
    
    // Ask if user wants to add another
    const another = await promptInput('Add another country? (y/n): ',
      (answer) => /^[yn]$/i.test(answer));
    
    addAnother = another.toLowerCase() === 'y';
  }
  
  if (Object.keys(newCoordinates).length > 0) {
    console.log(`\n${colors.blue}Updating coordinates file...${colors.reset}`);
    const success = await updateCoordinates(existingData, newCoordinates);
    
    if (success) {
      console.log(`${colors.green}Successfully updated coordinates for ${Object.keys(newCoordinates).length} countries.${colors.reset}`);
    } else {
      console.log(`${colors.red}Failed to update coordinates.${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}No changes made.${colors.reset}`);
  }
  
  // Close the readline interface
  rl.close();
}

// Helper function to prompt for input with validation
function promptInput(question, validator = () => true, transformer = (val) => val) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(question, (answer) => {
        if (validator(answer)) {
          resolve(transformer(answer));
        } else {
          console.log(`${colors.red}Invalid input. Please try again.${colors.reset}`);
          ask();
        }
      });
    };
    ask();
  });
}

// Run the script
main().catch(console.error);