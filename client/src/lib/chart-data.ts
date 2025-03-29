import { Country } from "@shared/schema";

// Country-specific data getter functions
// These will be used to get chart data for each country

export interface StatisticalData {
  gdpData: any[];
  tradeData: any[];
  employmentData: any[];
}

export interface DemographicData {
  ageData: any[];
  urbanRuralData: any[];
  educationData: any[];
}

// Statistical data
export function getCountryStatistics(country?: Country): StatisticalData {
  // Default data used for all countries (for now)
  const defaultData: StatisticalData = {
    gdpData: [
      { year: '1993', gdp: 3000 },
      { year: '1998', gdp: 3600 },
      { year: '2003', gdp: 4200 },
      { year: '2008', gdp: 5100 },
      { year: '2013', gdp: 5900 },
      { year: '2018', gdp: 6800 },
      { year: '2023', gdp: 7400 },
    ],
    tradeData: [
      { name: 'Exports', value: 68 },
      { name: 'Imports', value: 72 },
      { name: 'Trade Balance', value: -4 },
    ],
    employmentData: [
      { sector: 'Agriculture', percent: 12 },
      { sector: 'Industry', percent: 32 },
      { sector: 'Services', percent: 56 },
    ]
  };

  // If no country provided, return default data
  if (!country) return defaultData;

  // Country-specific data overrides
  // In a real-world application, this would pull from a database
  const countryDataMap: Record<string, Partial<StatisticalData>> = {
    usa: {
      gdpData: [
        { year: '1993', gdp: 6800 },
        { year: '1998', gdp: 9000 },
        { year: '2003', gdp: 11000 },
        { year: '2008', gdp: 14000 },
        { year: '2013', gdp: 16800 },
        { year: '2018', gdp: 20500 },
        { year: '2023', gdp: 23000 },
      ],
      tradeData: [
        { name: 'Exports', value: 12 },
        { name: 'Imports', value: 15 },
        { name: 'Trade Balance', value: -3 },
      ],
      employmentData: [
        { sector: 'Agriculture', percent: 2 },
        { sector: 'Industry', percent: 18 },
        { sector: 'Services', percent: 80 },
      ]
    },
    chn: {
      gdpData: [
        { year: '1993', gdp: 445 },
        { year: '1998', gdp: 1025 },
        { year: '2003', gdp: 1660 },
        { year: '2008', gdp: 4600 },
        { year: '2013', gdp: 9600 },
        { year: '2018', gdp: 13850 },
        { year: '2023', gdp: 17700 },
      ],
      employmentData: [
        { sector: 'Agriculture', percent: 25 },
        { sector: 'Industry', percent: 42 },
        { sector: 'Services', percent: 33 },
      ]
    },
    // Add more country-specific data as needed
  };

  // Merge default data with country-specific overrides
  const countryOverrides = countryDataMap[country.code] || {};
  return {
    ...defaultData,
    ...countryOverrides
  };
}

// Demographic data
export function getCountryDemographics(country?: Country): DemographicData {
  // Default data used for all countries
  const defaultData: DemographicData = {
    ageData: [
      { name: '0-14', value: 16 },
      { name: '15-24', value: 13 },
      { name: '25-54', value: 40 },
      { name: '55-64', value: 14 },
      { name: '65+', value: 17 },
    ],
    urbanRuralData: [
      { year: '1993', urban: 74, rural: 26 },
      { year: '1998', urban: 76, rural: 24 },
      { year: '2003', urban: 78, rural: 22 },
      { year: '2008', urban: 80, rural: 20 },
      { year: '2013', urban: 82, rural: 18 },
      { year: '2018', urban: 83, rural: 17 },
      { year: '2023', urban: 85, rural: 15 },
    ],
    educationData: [
      { level: 'Primary', male: 98, female: 99 },
      { level: 'Secondary', male: 88, female: 90 },
      { level: 'Tertiary', male: 45, female: 50 },
    ]
  };

  // If no country provided, return default data
  if (!country) return defaultData;

  // Country-specific data overrides
  const countryDataMap: Record<string, Partial<DemographicData>> = {
    usa: {
      ageData: [
        { name: '0-14', value: 18 },
        { name: '15-24', value: 13 },
        { name: '25-54', value: 39 },
        { name: '55-64', value: 13 },
        { name: '65+', value: 17 },
      ],
      urbanRuralData: [
        { year: '1993', urban: 78, rural: 22 },
        { year: '1998', urban: 79, rural: 21 },
        { year: '2003', urban: 80, rural: 20 },
        { year: '2008', urban: 81, rural: 19 },
        { year: '2013', urban: 82, rural: 18 },
        { year: '2018', urban: 83, rural: 17 },
        { year: '2023', urban: 84, rural: 16 },
      ]
    },
    ind: {
      ageData: [
        { name: '0-14', value: 26 },
        { name: '15-24', value: 17 },
        { name: '25-54', value: 41 },
        { name: '55-64', value: 8 },
        { name: '65+', value: 8 },
      ],
      urbanRuralData: [
        { year: '1993', urban: 26, rural: 74 },
        { year: '1998', urban: 28, rural: 72 },
        { year: '2003', urban: 30, rural: 70 },
        { year: '2008', urban: 32, rural: 68 },
        { year: '2013', urban: 34, rural: 66 },
        { year: '2018', urban: 36, rural: 64 },
        { year: '2023', urban: 38, rural: 62 },
      ]
    },
    // Add more country-specific data as needed
  };

  // Merge default data with country-specific overrides
  const countryOverrides = countryDataMap[country.code] || {};
  return {
    ...defaultData,
    ...countryOverrides
  };
}