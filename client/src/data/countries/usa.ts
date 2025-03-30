/**
 * United States Country Data
 */

import { CountryData } from "../types";
import flagImage from "../../assets/flags/usa.svg";

const countryData: CountryData = {
  // Basic Information
  code: "usa",
  name: "United States",
  capital: "Washington D.C.",
  population: 331000000,
  region: "North America",
  flagCoordinates: [-98, 39],
  
  // Current Political Leadership
  leader: {
    name: "Joe Biden",
    title: "President",
    party: "Democratic Party",
    inPowerSince: "2021",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait_%28cropped%29.jpg",
    description: "Joe Biden is the 46th President of the United States, taking office in January 2021. Prior to his presidency, he served as Vice President under Barack Obama from 2009 to 2017 and represented Delaware in the U.S. Senate for 36 years."
  },
  
  // Demographics Data
  demographics: {
    // Population by age group
    ageGroups: [
      { name: "0-14", value: 18.2 },
      { name: "15-24", value: 12.8 },
      { name: "25-54", value: 38.7 },
      { name: "55-64", value: 12.9 },
      { name: "65+", value: 17.4 }
    ],
    // Population by religion
    religions: [
      { name: "Protestant", value: 43 },
      { name: "Catholic", value: 20 },
      { name: "Mormon", value: 2 },
      { name: "Other Christian", value: 4 },
      { name: "Jewish", value: 2 },
      { name: "Muslim", value: 1 },
      { name: "Unaffiliated", value: 23 },
      { name: "Other", value: 5 }
    ],
    // Urban vs Rural
    urbanRural: [
      { name: "Urban", value: 83 },
      { name: "Rural", value: 17 }
    ],
    // Education levels
    educationLevels: [
      { name: "Less than High School", value: 10 },
      { name: "High School", value: 28 },
      { name: "Some College", value: 26 },
      { name: "Bachelor's or Higher", value: 36 }
    ]
  },
  
  // Economic Statistics
  statistics: {
    // GDP Breakdown by sector
    gdpSectors: [
      { name: "Agriculture", value: 0.9 },
      { name: "Industry", value: 18.2 },
      { name: "Services", value: 80.9 }
    ],
    // Employment by sector
    employment: [
      { name: "Agriculture", value: 1.3 },
      { name: "Industry", value: 19.4 },
      { name: "Services", value: 79.3 }
    ],
    // Exports & Imports (annual in billions USD)
    trade: [
      { name: "Exports", value: 2500 },
      { name: "Imports", value: 3100 }
    ],
    // Defense, Education, Healthcare spending (% of GDP)
    spending: [
      { name: "Defense", value: 3.7 },
      { name: "Education", value: 5.0 },
      { name: "Healthcare", value: 17.1 }
    ]
  },
  
  // Political Events
  events: [
    {
      period: "1993-2001",
      title: "Clinton Administration",
      description: "Bill Clinton's presidency focused on domestic economic policy, including balanced budgets and economic growth. Foreign policy challenges included interventions in the Balkans and the Middle East peace process.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Economic Growth", "Balanced Budget", "Foreign Intervention"],
      order: 1
    },
    {
      period: "2001-2009",
      title: "Bush Administration",
      description: "George W. Bush's presidency was defined by the response to the September 11 attacks, including the War on Terror, invasions of Afghanistan and Iraq, and domestic security policies. The financial crisis of 2008 marked the end of his term.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["War on Terror", "Iraq War", "Economic Crisis"],
      order: 2
    },
    {
      period: "2009-2017",
      title: "Obama Administration",
      description: "Barack Obama's presidency focused on economic recovery from the Great Recession, healthcare reform with the Affordable Care Act, and evolving foreign policy approaches including the Iran nuclear deal and counterterrorism operations.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Economic Recovery", "Healthcare Reform", "Counterterrorism"],
      order: 3
    },
    {
      period: "2017-2021",
      title: "Trump Administration",
      description: "Donald Trump's presidency featured economic policies including tax cuts and deregulation, an 'America First' foreign policy approach, immigration policy changes, and culminated in challenges to the 2020 election results.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["America First", "Tax Reform", "Immigration Policy"],
      order: 4
    },
    {
      period: "2021-Present",
      title: "Biden Administration",
      description: "Joe Biden's presidency has focused on pandemic recovery, infrastructure investment, climate initiatives, and restoring traditional international alliances while addressing emerging global challenges.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Pandemic Recovery", "Infrastructure", "Climate Initiatives"],
      order: 5
    }
  ]
};

export default countryData;