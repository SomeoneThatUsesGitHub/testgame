/**
 * France Country Data
 */

import { CountryData } from "../types";
import flagImage from "../../assets/flags/fra.svg";

const countryData: CountryData = {
  // Basic Information
  code: "fra",
  name: "France",
  capital: "Paris",
  population: 67500000,
  region: "Europe",
  flagCoordinates: [2.5, 46.5],
  
  // Current Political Leadership
  leader: {
    name: "Emmanuel Macron",
    title: "President",
    party: "La République En Marche",
    inPowerSince: "2017",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Emmanuel_Macron_in_2019.jpg",
    description: "Emmanuel Macron is the President of France since May 2017. A former investment banker and economy minister, he founded the centrist political party La République En Marche and has pursued economic reforms and strengthening of the European Union."
  },
  
  // Demographics Data
  demographics: {
    // Population by age group
    ageGroups: [
      { name: "0-14", value: 17.8 },
      { name: "15-24", value: 11.4 },
      { name: "25-54", value: 37.6 },
      { name: "55-64", value: 12.5 },
      { name: "65+", value: 20.7 }
    ],
    // Population by religion
    religions: [
      { name: "Christian", value: 51 },
      { name: "Muslim", value: 8 },
      { name: "Jewish", value: 1 },
      { name: "Buddhist", value: 1 },
      { name: "No Religion", value: 31 },
      { name: "Other", value: 8 }
    ],
    // Urban vs Rural
    urbanRural: [
      { name: "Urban", value: 81 },
      { name: "Rural", value: 19 }
    ],
    // Education levels
    educationLevels: [
      { name: "Below Secondary", value: 21 },
      { name: "Secondary", value: 43 },
      { name: "Tertiary", value: 36 }
    ]
  },
  
  // Economic Statistics
  statistics: {
    // GDP Breakdown by sector
    gdpSectors: [
      { name: "Agriculture", value: 1.6 },
      { name: "Industry", value: 19.4 },
      { name: "Services", value: 79.0 }
    ],
    // Employment by sector
    employment: [
      { name: "Agriculture", value: 2.8 },
      { name: "Industry", value: 20.0 },
      { name: "Services", value: 77.2 }
    ],
    // Exports & Imports (annual in billions USD)
    trade: [
      { name: "Exports", value: 555 },
      { name: "Imports", value: 625 }
    ],
    // Defense, Education, Healthcare spending (% of GDP)
    spending: [
      { name: "Defense", value: 2.1 },
      { name: "Education", value: 5.4 },
      { name: "Healthcare", value: 11.2 }
    ]
  },
  
  // Political Events
  events: [
    {
      period: "1995-2007",
      title: "Chirac Presidency",
      description: "Jacques Chirac's presidency saw France maintaining its distinct foreign policy stance, including opposition to the Iraq War, while addressing domestic economic challenges and European integration issues.",
      partyName: "Rally for the Republic / UMP",
      partyColor: "Conservative",
      tags: ["European Integration", "Economic Reform"],
      order: 1
    },
    {
      period: "2007-2012",
      title: "Sarkozy Presidency",
      description: "Nicolas Sarkozy's presidency was marked by economic reforms and active foreign policy, including intervention in Libya and management of the 2008 financial crisis and subsequent European debt crisis.",
      partyName: "Union for a Popular Movement",
      partyColor: "Conservative",
      tags: ["Economic Crisis", "Foreign Intervention"],
      order: 2
    },
    {
      period: "2012-2017",
      title: "Hollande Presidency",
      description: "François Hollande's presidency faced economic stagnation and significant security challenges including terrorism. His administration introduced progressive social reforms while managing military operations in Africa.",
      partyName: "Socialist Party",
      partyColor: "Socialist",
      tags: ["Security Challenges", "Social Reform"],
      order: 3
    },
    {
      period: "2017-Present",
      title: "Macron Presidency",
      description: "Emmanuel Macron's presidency has pursued centrist economic reforms, European Union strengthening, and climate initiatives while navigating protests, pandemic response, and evolving global challenges.",
      partyName: "La République En Marche",
      partyColor: "Liberal",
      tags: ["Economic Reform", "European Leadership", "Pandemic Response"],
      order: 4
    }
  ]
};

export default countryData;