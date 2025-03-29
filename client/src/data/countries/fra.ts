/**
 * France Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = {
  // Basic country information
  code: "fra",
  name: "France",
  capital: "Paris",
  population: 67000000,
  region: "Europe",
  flagCoordinates: [2.2, 46.2], // Central France coordinates
  
  // Current political leader
  leader: {
    name: "Emmanuel Macron",
    title: "President",
    party: "La République En Marche",
    inPowerSince: "2017",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Emmanuel_Macron_in_2019.jpg",
    description: "Emmanuel Macron is the President of France since May 2017. A former investment banker and economy minister, he founded the centrist political party La République En Marche and has pursued economic reforms and strengthening of the European Union."
  },
  
  // Demographics data
  demographics: {
    ageGroups: [
      { name: "0-14", value: 18.0 },
      { name: "15-24", value: 11.7 },
      { name: "25-54", value: 38.0 },
      { name: "55-64", value: 12.3 },
      { name: "65+", value: 20.0 }
    ],
    religions: [
      { name: "Catholic", value: 47.0 },
      { name: "Muslim", value: 6.0 },
      { name: "Protestant", value: 2.0 },
      { name: "Jewish", value: 0.5 },
      { name: "Buddhist", value: 0.5 },
      { name: "Other", value: 2.0 },
      { name: "None", value: 42.0 }
    ],
    urbanRural: [
      { name: "Urban", value: 80.4 },
      { name: "Rural", value: 19.6 }
    ],
    educationLevels: [
      { name: "Primary", value: 17.2 },
      { name: "Secondary", value: 42.5 },
      { name: "Tertiary", value: 33.0 },
      { name: "None", value: 7.3 }
    ]
  },
  
  // Economic statistics
  statistics: {
    gdpSectors: [
      { name: "Agriculture", value: 1.5 },
      { name: "Industry", value: 19.5 },
      { name: "Services", value: 79.0 }
    ],
    employment: [
      { name: "Agriculture", value: 2.8 },
      { name: "Industry", value: 20.0 },
      { name: "Services", value: 77.2 }
    ],
    trade: [
      { name: "Germany", value: 14.8 },
      { name: "Spain", value: 7.7 },
      { name: "Italy", value: 7.6 },
      { name: "Belgium", value: 7.2 },
      { name: "Others", value: 62.7 }
    ],
    spending: [
      { name: "Social Protection", value: 41.0 },
      { name: "Health", value: 14.0 },
      { name: "Education", value: 9.5 },
      { name: "Defense", value: 3.5 },
      { name: "Other", value: 32.0 }
    ]
  },
  
  // Political timeline events
  events: [
    {
      period: "1995-2007",
      title: "Jacques Chirac Presidency",
      description: "Jacques Chirac served as President for two terms, focusing on European integration while maintaining France's independent stance, notably opposing the Iraq War. His administration faced economic challenges and social tensions, including the 2005 civil unrest.",
      partyName: "Rally for the Republic/Union for a Popular Movement",
      partyColor: "Conservative",
      tags: ["Iraq War Opposition", "EU Constitution", "Social Unrest"],
      order: 1
    },
    {
      period: "2007-2012",
      title: "Nicolas Sarkozy Presidency",
      description: "Nicolas Sarkozy's presidency was marked by economic reforms and an active international policy, particularly with NATO reintegration and the Libyan Civil War intervention. His term was challenged by the 2008 global financial crisis.",
      partyName: "Union for a Popular Movement",
      partyColor: "Conservative",
      tags: ["Economic Reform", "NATO Reintegration", "Financial Crisis"],
      order: 2
    },
    {
      period: "2012-2017",
      title: "François Hollande Presidency",
      description: "François Hollande's socialist presidency focused on economic equality and progressive social policies, including same-sex marriage legalization. His term was marred by terrorist attacks and persistently high unemployment.",
      partyName: "Socialist Party",
      partyColor: "Progressive",
      tags: ["Same-Sex Marriage", "Terrorism Response", "Economic Challenges"],
      order: 3
    },
    {
      period: "2017-Present",
      title: "Emmanuel Macron Presidency",
      description: "Emmanuel Macron, a centrist reformer, has pursued labor market liberalization, environmental initiatives, and European integration. His presidency has been marked by the Yellow Vest protests, COVID-19 pandemic, and efforts to position France as a leader in the EU.",
      partyName: "La République En Marche",
      partyColor: "Centrist",
      tags: ["Yellow Vests", "EU Leadership", "COVID-19 Response"],
      order: 4
    }
  ]
};

export default countryData;