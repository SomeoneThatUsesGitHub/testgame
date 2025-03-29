/**
 * France Country Data
 */

import { CountryData } from "../types";
// You can import a flag image if available
// import flagImage from "../../assets/flags/fra.svg";

const countryData: CountryData = {
  // Basic Information
  code: "fra",
  name: "France",
  capital: "Paris",
  population: 67000000,
  region: "Europe",
  flagCoordinates: [2.2137, 46.2276], // Center of France
  
  // Current Political Leadership
  leader: {
    name: "Emmanuel Macron",
    title: "President",
    party: "La République En Marche",
    inPowerSince: "2017",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Emmanuel_Macron_%28cropped%29.jpg/800px-Emmanuel_Macron_%28cropped%29.jpg",
    description: "Emmanuel Macron is the President of France, elected in May 2017. Before entering politics, he was an investment banker and served as Minister of Economy, Industry and Digital Affairs under President François Hollande. Macron founded his own political movement, La République En Marche, in 2016."
  },
  
  // Demographics Data
  demographics: {
    // Population by age group
    ageGroups: [
      { name: "0-14", value: 18.3 },
      { name: "15-24", value: 11.7 },
      { name: "25-54", value: 37.6 },
      { name: "55-64", value: 12.4 },
      { name: "65+", value: 20.0 }
    ],
    // Population by religion
    religions: [
      { name: "Christianity", value: 51 },
      { name: "Islam", value: 6 },
      { name: "Judaism", value: 1 },
      { name: "Other", value: 2 },
      { name: "None", value: 40 }
    ],
    // Urban vs Rural
    urbanRural: [
      { name: "Urban", value: 81 },
      { name: "Rural", value: 19 }
    ],
    // Education levels
    educationLevels: [
      { name: "Primary", value: 99 },
      { name: "Secondary", value: 87 },
      { name: "Tertiary", value: 44 }
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
    // Trade as % of GDP
    trade: [
      { name: "Exports", value: 32.1 },
      { name: "Imports", value: 33.2 }
    ],
    // Government spending as % of GDP
    spending: [
      { name: "Defense", value: 1.9 },
      { name: "Education", value: 5.4 },
      { name: "Healthcare", value: 11.2 }
    ]
  },
  
  // Political Events (last 30 years)
  events: [
    {
      period: "1995-2007",
      title: "Chirac Presidency",
      description: "Jacques Chirac served as President of France. His presidency was marked by opposition to the Iraq War, the adoption of the euro, and constitutional reforms reducing the presidential term from 7 to 5 years.",
      partyName: "Rally for the Republic/UMP",
      partyColor: "Republican",
      tags: ["Constitutional Reform", "Iraq War Opposition", "Euro Adoption"],
      order: 1
    },
    {
      period: "2007-2012",
      title: "Sarkozy Presidency",
      description: "Nicolas Sarkozy served as President. His tenure saw economic reforms, the global financial crisis, France's return to NATO's integrated military command, and involvement in the Libyan Civil War.",
      partyName: "Union for a Popular Movement",
      partyColor: "Conservative",
      tags: ["Economic Reform", "Financial Crisis", "NATO Integration"],
      order: 2
    },
    {
      period: "2012-2017",
      title: "Hollande Presidency",
      description: "François Hollande served as President. His presidency was marked by terrorist attacks on French soil, same-sex marriage legalization, and economic challenges leading to declining popularity.",
      partyName: "Socialist Party",
      partyColor: "Democratic",
      tags: ["Terrorism Response", "Same-Sex Marriage", "Economic Struggles"],
      order: 3
    },
    {
      period: "2017-Present",
      title: "Macron Presidency",
      description: "Emmanuel Macron was elected as the youngest French President. His tenure has included labor reforms, Yellow Vest protests, the COVID-19 pandemic response, and efforts to strengthen the European Union.",
      partyName: "La République En Marche",
      partyColor: "Centrist",
      tags: ["Labor Reform", "Yellow Vest Movement", "EU Leadership"],
      order: 4
    }
  ]
};

export default countryData;