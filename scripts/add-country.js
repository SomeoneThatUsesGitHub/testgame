#!/usr/bin/env node

/**
 * Add Country Script
 * This script helps standardize and simplify adding new countries to the application.
 * 
 * Usage: 
 *   node scripts/add-country.js
 * 
 * This interactive script will prompt for country information and generate:
 * 1. Country data entries for the server/storage.ts file
 * 2. Basic events structure for the country
 * 3. A leader template
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

// ISO 3166-1 alpha-3 country code validation
const isValidCountryCode = (code) => {
  return /^[a-z]{3}$/.test(code);
};

// Template for country data
const generateCountryTemplate = (data) => {
  return `const ${data.code}Data: InsertCountry = {
  code: "${data.code}",
  name: "${data.name}",
  capital: "${data.capital}",
  population: ${data.population},
  color: "${data.color}",
  region: "${data.region}"
};

`;
};

// Template for country leader
const generateLeaderTemplate = (data) => {
  return `{
  countryCode: "${data.code}",
  name: "${data.leaderName}",
  title: "${data.leaderTitle}",
  party: "${data.leaderParty}",
  inPowerSince: "${data.leaderSince}",
  imageUrl: "${data.leaderImage}",
  description: "${data.leaderDescription}"
}`;
};

// Main function to run the script
async function main() {
  console.log(`${colors.bright}${colors.blue}=== Country Data Generator ===${colors.reset}\n`);
  console.log(`${colors.cyan}This script helps you generate country data for the World Political Map application.${colors.reset}\n`);
  
  // Country information
  const country = {};
  
  // Basic information
  country.code = await promptInput('Enter ISO 3-letter country code (lowercase, e.g., usa, gbr): ', isValidCountryCode);
  country.name = await promptInput('Enter country name: ');
  country.capital = await promptInput('Enter capital city: ');
  country.population = await promptInput('Enter population (numbers only): ', 
    (val) => !isNaN(parseInt(val)), 
    (val) => parseInt(val));
  
  console.log(`\n${colors.yellow}Available region options:${colors.reset}`);
  console.log('North America, South America, Europe, Asia, Africa, Oceania, Europe/Asia, Middle East');
  country.region = await promptInput('Enter region: ');
  
  console.log(`\n${colors.yellow}Available color options (hexadecimal):${colors.reset}`);
  console.log('#60A5FA (blue), #93C5FD (light blue), #DBEAFE (very light blue), or custom hex');
  country.color = await promptInput('Enter color (hex): ');
  
  // Leader information
  console.log(`\n${colors.bright}${colors.green}Now enter information about the current political leader:${colors.reset}`);
  country.leaderName = await promptInput('Leader full name: ');
  country.leaderTitle = await promptInput('Leader title (e.g., President, Prime Minister): ');
  country.leaderParty = await promptInput('Political party name: ');
  country.leaderSince = await promptInput('Year they took power: ');
  country.leaderImage = await promptInput('Image URL (leave empty for none): ') || null;
  country.leaderDescription = await promptInput('Brief description (1-2 sentences): ');
  
  // Generate outputs
  console.log(`\n${colors.bright}${colors.blue}=== Generated Content ===${colors.reset}\n`);
  
  console.log(`${colors.bright}${colors.yellow}Country Data (add to initializeData method in server/storage.ts):${colors.reset}`);
  console.log(generateCountryTemplate(country));
  
  console.log(`${colors.bright}${colors.yellow}Add to the country list:${colors.reset}`);
  console.log(`this.addCountry(${country.code}Data);`);
  
  console.log(`${colors.bright}${colors.yellow}Add to basic events:${colors.reset}`);
  console.log(`this.addBasicEventsForCountry("${country.code}", "${country.name}");`);
  
  console.log(`${colors.bright}${colors.yellow}Leader Data (add to the leaders array in the initializeData method):${colors.reset}`);
  console.log(generateLeaderTemplate(country));
  
  console.log(`\n${colors.bright}${colors.green}Instructions:${colors.reset}`);
  console.log(`1. Add the country data to the 'initializeData' method in 'server/storage.ts'`);
  console.log(`2. Add the leader to the 'leaders' array in the same file`);
  console.log(`3. Call 'this.addBasicEventsForCountry("${country.code}", "${country.name}")' after the other countries`);
  console.log(`4. If you want to customize events beyond the basic template, create custom events like 'usaEvents'`);
  
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