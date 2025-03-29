/**
 * United States Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = {
  // Basic country information
  code: "usa",
  name: "United States",
  capital: "Washington D.C.",
  population: 331000000,
  region: "North America",
  flagCoordinates: [-98.5, 39.8], // Central US coordinates
  
  // Current political leader
  leader: {
    name: "Joe Biden",
    title: "President",
    party: "Democratic Party",
    inPowerSince: "2021",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait_%28cropped%29.jpg",
    description: "Joe Biden is the 46th President of the United States, taking office in January 2021. Prior to his presidency, he served as Vice President under Barack Obama from 2009 to 2017 and represented Delaware in the U.S. Senate for 36 years."
  },
  
  // Demographics data
  demographics: {
    ageGroups: [
      { name: "0-14", value: 18.2 },
      { name: "15-24", value: 13.1 },
      { name: "25-54", value: 39.3 },
      { name: "55-64", value: 12.9 },
      { name: "65+", value: 16.5 }
    ],
    religions: [
      { name: "Protestant", value: 43.5 },
      { name: "Catholic", value: 20.8 },
      { name: "Mormon", value: 1.6 },
      { name: "Jewish", value: 1.9 },
      { name: "Muslim", value: 0.9 },
      { name: "Other", value: 1.5 },
      { name: "Unaffiliated", value: 22.8 },
      { name: "Unknown", value: 7.0 }
    ],
    urbanRural: [
      { name: "Urban", value: 82.7 },
      { name: "Rural", value: 17.3 }
    ],
    educationLevels: [
      { name: "High School", value: 27.3 },
      { name: "Some College", value: 21.3 },
      { name: "Associate", value: 10.2 },
      { name: "Bachelor", value: 21.9 },
      { name: "Graduate", value: 14.3 },
      { name: "Less than HS", value: 5.0 }
    ]
  },
  
  // Economic statistics
  statistics: {
    gdpSectors: [
      { name: "Agriculture", value: 0.9 },
      { name: "Industry", value: 18.9 },
      { name: "Services", value: 80.2 }
    ],
    employment: [
      { name: "Agriculture", value: 1.3 },
      { name: "Industry", value: 19.4 },
      { name: "Services", value: 79.3 }
    ],
    trade: [
      { name: "Canada", value: 14.7 },
      { name: "Mexico", value: 14.5 },
      { name: "China", value: 13.2 },
      { name: "Japan", value: 5.5 },
      { name: "Others", value: 52.1 }
    ],
    spending: [
      { name: "Social Security", value: 23 },
      { name: "Medicare", value: 15 },
      { name: "Defense", value: 13 },
      { name: "Health", value: 12 },
      { name: "Income Security", value: 7 },
      { name: "Other", value: 30 }
    ]
  },
  
  // Political timeline events
  events: [
    {
      period: "1993-2001",
      title: "Bill Clinton Administration",
      description: "President Bill Clinton's two terms saw economic prosperity, the passage of NAFTA, and major welfare reform. The administration faced political challenges including impeachment proceedings.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Economic Boom", "NAFTA", "Welfare Reform"],
      order: 1
    },
    {
      period: "2001-2009",
      title: "George W. Bush Administration",
      description: "Following the September 11 attacks, President Bush launched the War on Terror, including invasions of Afghanistan and Iraq. His presidency also saw major tax cuts and the 2008 financial crisis.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["War on Terror", "Tax Cuts", "Financial Crisis"],
      order: 2
    },
    {
      period: "2009-2017",
      title: "Barack Obama Administration",
      description: "President Obama led economic recovery efforts after the 2008 crisis and passed the Affordable Care Act. His administration also saw the killing of Osama bin Laden and the legalization of same-sex marriage.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["Affordable Care Act", "Economic Recovery", "Same-Sex Marriage"],
      order: 3
    },
    {
      period: "2017-2021",
      title: "Donald Trump Administration",
      description: "President Trump's term featured tax cuts, trade conflicts with China, and immigration policy changes. His presidency concluded with the COVID-19 pandemic and contested 2020 election results.",
      partyName: "Republican Party",
      partyColor: "Republican",
      tags: ["America First", "Tax Reform", "COVID-19 Pandemic"],
      order: 4
    },
    {
      period: "2021-Present",
      title: "Joe Biden Administration",
      description: "President Biden's term began with COVID-19 response efforts and the American Rescue Plan. His administration has focused on infrastructure investment, climate policy, and international alliance rebuilding.",
      partyName: "Democratic Party",
      partyColor: "Democratic",
      tags: ["COVID Recovery", "Infrastructure", "Climate Actions"],
      order: 5
    }
  ]
};

export default countryData;