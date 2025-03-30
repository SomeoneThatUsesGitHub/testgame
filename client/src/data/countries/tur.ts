/**
 * tur Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = {
  code: 'tur',
  name: 'tur',
  capital: 'tur',
  population: 12,
  region: 'tur',
  flagCoordinates: [
    11,
    11
  ],
  leader: {
    name: '',
    title: '',
    party: '',
    inPowerSince: '',
    description: ''
  },
  demographics: {
    ageGroups: [
      {
        name: '0-14',
        value: 20
      },
      {
        name: '15-24',
        value: 15
      },
      {
        name: '25-54',
        value: 40
      },
      {
        name: '55-64',
        value: 10
      },
      {
        name: '65+',
        value: 15
      }
    ],
    religions: [
      {
        name: 'Religion 1',
        value: 60
      },
      {
        name: 'Religion 2',
        value: 25
      },
      {
        name: 'Other',
        value: 15
      }
    ],
    urbanRural: [
      {
        name: 'Urban',
        value: 70
      },
      {
        name: 'Rural',
        value: 30
      }
    ],
    educationLevels: [
      {
        name: 'Primary',
        value: 25
      },
      {
        name: 'Secondary',
        value: 50
      },
      {
        name: 'Tertiary',
        value: 20
      },
      {
        name: 'None',
        value: 5
      }
    ]
  },
  statistics: {
    gdpSectors: [
      {
        name: 'Agriculture',
        value: 10
      },
      {
        name: 'Industry',
        value: 30
      },
      {
        name: 'Services',
        value: 60
      }
    ],
    employment: [
      {
        name: 'Agriculture',
        value: 5
      },
      {
        name: 'Industry',
        value: 25
      },
      {
        name: 'Services',
        value: 70
      }
    ],
    trade: [
      {
        name: 'Partner 1',
        value: 40
      },
      {
        name: 'Partner 2',
        value: 30
      },
      {
        name: 'Others',
        value: 30
      }
    ],
    spending: [
      {
        name: 'Defense',
        value: 20
      },
      {
        name: 'Education',
        value: 15
      },
      {
        name: 'Healthcare',
        value: 25
      },
      {
        name: 'Other',
        value: 40
      }
    ]
  },
  events: []
};

export default countryData;