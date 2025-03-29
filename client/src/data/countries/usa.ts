/**
 * United States Country Data
 */

import { CountryData } from "../types";
// You can import a flag image if available
// import flagImage from "../../assets/flags/usa.svg";

const countryData: CountryData = {
  // Basic Information
  code: "usa",
  name: "United States",
  capital: "Washington D.C.",
  population: 331000000,
  region: "North America",
  flagCoordinates: [-95.7129, 37.0902], // Center of the United States
  
  // Current Political Leadership
  leader: {
    name: "Joe Biden",
    title: "President",
    party: "Democratic Party",
    inPowerSince: "2021",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg",
    description: "Joe Biden is the 46th President of the United States. Before becoming president, he served as the 47th Vice President from 2009 to 2017 under President Barack Obama. He previously represented Delaware in the United States Senate from 1973 to 2009."
  },
  
  // Demographics Data
  demographics: {
    // Population by age group
    ageGroups: [
      { name: "0-14", value: 18.2 },
      { name: "15-24", value: 13.1 },
      { name: "25-54", value: 39.2 },
      { name: "55-64", value: 12.8 },
      { name: "65+", value: 16.7 }
    ],
    // Population by religion
    religions: [
      { name: "Christianity", value: 65 },
      { name: "Judaism", value: 2 },
      { name: "Islam", value: 1 },
      { name: "Other", value: 7 },
      { name: "None", value: 25 }
    ],
    // Urban vs Rural
    urbanRural: [
      { name: "Urban", value: 82.7 },
      { name: "Rural", value: 17.3 }
    ],
    // Education levels
    educationLevels: [
      { name: "Primary", value: 95 },
      { name: "Secondary", value: 89 },
      { name: "Tertiary", value: 46 }
    ]
  },
  
  // Economic Statistics
  statistics: {
    // GDP Breakdown by sector
    gdpSectors: [
      { name: "Agriculture", value: 0.9 },
      { name: "Industry", value: 18.9 },
      { name: "Services", value: 80.2 }
    ],
    // Employment by sector
    employment: [
      { name: "Agriculture", value: 1.3 },
      { name: "Industry", value: 19.4 },
      { name: "Services", value: 79.3 }
    ],
    // Trade as % of GDP
    trade: [
      { name: "Exports", value: 11.9 },
      { name: "Imports", value: 14.6 }
    ],
    // Government spending as % of GDP
    spending: [
      { name: "Defense", value: 3.7 },
      { name: "Education", value: 4.9 },
      { name: "Healthcare", value: 17.7 }
    ]
  },
  
  // Political Events (last 30 years)
  events: [
    {
      period: "1993-2001",
      title: "Clinton Administration",
      description: "Bill Clinton served as the 42nd President. His tenure was marked by economic prosperity, the rise of the internet, NAFTA, and was overshadowed by personal scandals leading to impeachment by the House though acquitted by the Senate.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Economic Growth", "Tech Boom", "Impeachment"],
      order: 1
    },
    {
      period: "2001-2009",
      title: "Bush Administration",
      description: "George W. Bush served as the 43rd President. Following the September 11 attacks in 2001, his presidency was defined by the War on Terror, including wars in Afghanistan and Iraq, as well as the 2008 financial crisis.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["9/11", "War on Terror", "Financial Crisis"],
      order: 2
    },
    {
      period: "2009-2017",
      title: "Obama Administration",
      description: "Barack Obama served as the 44th President and the first African American to hold the office. His presidency saw the recovery from the Great Recession, healthcare reform (Affordable Care Act), and advances in LGBTQ+ rights.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Healthcare Reform", "Economic Recovery", "Progressive Policies"],
      order: 3
    },
    {
      period: "2017-2021",
      title: "Trump Administration",
      description: "Donald Trump served as the 45th President. His unconventional approach included tax cuts, immigration restrictions, America First foreign policy, and was marked by polarization culminating in his impeachment twice by the House.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["America First", "Tax Cuts", "Immigration"],
      order: 4
    },
    {
      period: "2021-Present",
      title: "Biden Administration",
      description: "Joe Biden became the 46th President. His early agenda focused on COVID-19 recovery, infrastructure investment, climate initiatives, and restoring international alliances.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["COVID Recovery", "Infrastructure", "Climate Policy"],
      order: 5
    }
  ]
};

export default countryData;