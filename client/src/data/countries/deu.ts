/**
 * Germany Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = {
  // Basic country information
  code: "deu",
  name: "Germany",
  capital: "Berlin",
  population: 83000000,
  region: "Europe",
  flagCoordinates: [10.4, 51.1], // Central Germany coordinates
  
  // Current political leader
  leader: {
    name: "Olaf Scholz",
    title: "Chancellor",
    party: "Social Democratic Party",
    inPowerSince: "2021",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Olaf_Scholz_July_2023.jpg",
    description: "Olaf Scholz has served as Chancellor of Germany since December 2021, leading a coalition government. He previously served as Vice Chancellor of Germany and Federal Minister of Finance from 2018 to 2021."
  },
  
  // Demographics data
  demographics: {
    ageGroups: [
      { name: "0-14", value: 12.8 },
      { name: "15-24", value: 9.7 },
      { name: "25-54", value: 38.3 },
      { name: "55-64", value: 15.5 },
      { name: "65+", value: 23.7 }
    ],
    religions: [
      { name: "Roman Catholic", value: 27.0 },
      { name: "Protestant", value: 24.5 },
      { name: "Muslim", value: 5.0 },
      { name: "Orthodox", value: 1.9 },
      { name: "Other", value: 1.1 },
      { name: "None/Unknown", value: 40.5 }
    ],
    urbanRural: [
      { name: "Urban", value: 77.5 },
      { name: "Rural", value: 22.5 }
    ],
    educationLevels: [
      { name: "Primary", value: 18.0 },
      { name: "Secondary", value: 56.0 },
      { name: "Tertiary", value: 24.0 },
      { name: "None", value: 2.0 }
    ]
  },
  
  // Economic statistics
  statistics: {
    gdpSectors: [
      { name: "Agriculture", value: 0.7 },
      { name: "Industry", value: 30.7 },
      { name: "Services", value: 68.6 }
    ],
    employment: [
      { name: "Agriculture", value: 1.4 },
      { name: "Industry", value: 28.3 },
      { name: "Services", value: 70.3 }
    ],
    trade: [
      { name: "EU Countries", value: 58.0 },
      { name: "USA", value: 8.8 },
      { name: "China", value: 7.3 },
      { name: "UK", value: 6.1 },
      { name: "Others", value: 19.8 }
    ],
    spending: [
      { name: "Social Protection", value: 43.1 },
      { name: "Health", value: 16.3 },
      { name: "Education", value: 9.3 },
      { name: "General Services", value: 6.9 },
      { name: "Other", value: 24.4 }
    ]
  },
  
  // Political timeline events
  events: [
    {
      period: "1990-1998",
      title: "Helmut Kohl Era and Reunification",
      description: "Following German reunification, Chancellor Helmut Kohl led the country through the challenges of integrating East Germany. His government implemented economic reforms and supported European integration.",
      partyName: "Christian Democratic Union",
      partyColor: "Conservative",
      tags: ["Reunification", "European Integration"],
      order: 1
    },
    {
      period: "1998-2005",
      title: "Schröder Government",
      description: "Gerhard Schröder's Red-Green coalition implemented significant labor market and welfare reforms (Agenda 2010), opposed the Iraq War, and expanded renewable energy through new legislation.",
      partyName: "Social Democratic Party",
      partyColor: "Progressive",
      tags: ["Agenda 2010", "Iraq War Opposition"],
      order: 2
    },
    {
      period: "2005-2021",
      title: "Merkel Era",
      description: "Angela Merkel served as Chancellor for 16 years across four terms. Her tenure was marked by the European financial crisis, the refugee crisis of 2015, and the COVID-19 pandemic. She was known for her pragmatic leadership and strong role in the EU.",
      partyName: "Christian Democratic Union",
      partyColor: "Conservative",
      tags: ["Euro Crisis", "Refugee Policy", "COVID-19"],
      order: 3
    },
    {
      period: "2021-Present",
      title: "Traffic Light Coalition",
      description: "After Merkel's retirement, Olaf Scholz formed a 'traffic light coalition' between his Social Democrats, the Greens, and the liberal FDP. The government faces challenges including the Ukraine war, energy transition, and post-pandemic economic recovery.",
      partyName: "Coalition Government",
      partyColor: "Progressive",
      tags: ["Energy Transition", "Ukraine Crisis", "Digital Transformation"],
      order: 4
    }
  ]
};

export default countryData;