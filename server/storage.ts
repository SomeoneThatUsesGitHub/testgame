import { 
  countries, 
  politicalEvents, 
  type Country, 
  type InsertCountry, 
  type PoliticalEvent, 
  type InsertPoliticalEvent, 
  type CountryWithEvents 
} from "@shared/schema";

export interface IStorage {
  getCountries(): Promise<Country[]>;
  getCountry(code: string): Promise<Country | undefined>;
  getCountryWithEvents(code: string): Promise<CountryWithEvents | undefined>;
  getPoliticalEvents(countryCode: string): Promise<PoliticalEvent[]>;
  searchCountries(query: string): Promise<Country[]>;
}

export class MemStorage implements IStorage {
  private countries: Map<string, Country>;
  private politicalEvents: Map<string, PoliticalEvent[]>;
  private countryIdCounter: number;
  private eventIdCounter: number;

  constructor() {
    this.countries = new Map();
    this.politicalEvents = new Map();
    this.countryIdCounter = 1;
    this.eventIdCounter = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  async getCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }

  async getCountry(code: string): Promise<Country | undefined> {
    return this.countries.get(code);
  }

  async getCountryWithEvents(code: string): Promise<CountryWithEvents | undefined> {
    const country = this.countries.get(code);
    if (!country) return undefined;
    
    const events = this.politicalEvents.get(code) || [];
    
    return {
      ...country,
      events
    };
  }

  async getPoliticalEvents(countryCode: string): Promise<PoliticalEvent[]> {
    return this.politicalEvents.get(countryCode) || [];
  }

  async searchCountries(query: string): Promise<Country[]> {
    if (!query) return Array.from(this.countries.values());
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.countries.values()).filter(country => 
      country.name.toLowerCase().includes(lowerQuery) || 
      country.code.toLowerCase().includes(lowerQuery)
    );
  }

  private addCountry(country: InsertCountry): Country {
    const id = this.countryIdCounter++;
    const newCountry: Country = { ...country, id };
    this.countries.set(country.code, newCountry);
    return newCountry;
  }

  private addPoliticalEvent(event: InsertPoliticalEvent): PoliticalEvent {
    const id = this.eventIdCounter++;
    const newEvent: PoliticalEvent = { ...event, id };
    
    const events = this.politicalEvents.get(event.countryCode) || [];
    events.push(newEvent);
    this.politicalEvents.set(event.countryCode, events);
    
    return newEvent;
  }

  private initializeData() {
    // Add some countries
    const usaData: InsertCountry = {
      code: "usa",
      name: "United States",
      capital: "Washington D.C.",
      population: 331000000,
      color: "#60A5FA",
      region: "North America"
    };
    
    const canadaData: InsertCountry = {
      code: "can",
      name: "Canada",
      capital: "Ottawa",
      population: 38000000,
      color: "#DBEAFE",
      region: "North America"
    };
    
    const ukData: InsertCountry = {
      code: "gbr",
      name: "United Kingdom",
      capital: "London",
      population: 67000000,
      color: "#93C5FD",
      region: "Europe"
    };
    
    const franceData: InsertCountry = {
      code: "fra",
      name: "France",
      capital: "Paris",
      population: 67000000,
      color: "#DBEAFE",
      region: "Europe"
    };
    
    const germanyData: InsertCountry = {
      code: "deu",
      name: "Germany",
      capital: "Berlin",
      population: 83000000,
      color: "#93C5FD",
      region: "Europe"
    };
    
    const russiaData: InsertCountry = {
      code: "rus",
      name: "Russia",
      capital: "Moscow",
      population: 144000000,
      color: "#93C5FD",
      region: "Europe/Asia"
    };
    
    const chinaData: InsertCountry = {
      code: "chn",
      name: "China",
      capital: "Beijing",
      population: 1400000000,
      color: "#60A5FA",
      region: "Asia"
    };
    
    const indiaData: InsertCountry = {
      code: "ind",
      name: "India",
      capital: "New Delhi",
      population: 1380000000,
      color: "#DBEAFE",
      region: "Asia"
    };
    
    const japanData: InsertCountry = {
      code: "jpn",
      name: "Japan",
      capital: "Tokyo",
      population: 126000000,
      color: "#93C5FD",
      region: "Asia"
    };
    
    const brazilData: InsertCountry = {
      code: "bra",
      name: "Brazil",
      capital: "Brasília",
      population: 212000000,
      color: "#60A5FA",
      region: "South America"
    };
    
    const australiaData: InsertCountry = {
      code: "aus",
      name: "Australia",
      capital: "Canberra",
      population: 25000000,
      color: "#93C5FD",
      region: "Oceania"
    };
    
    const southAfricaData: InsertCountry = {
      code: "zaf",
      name: "South Africa",
      capital: "Pretoria",
      population: 59000000,
      color: "#DBEAFE",
      region: "Africa"
    };
    
    const egyptData: InsertCountry = {
      code: "egy",
      name: "Egypt",
      capital: "Cairo",
      population: 100000000,
      color: "#60A5FA",
      region: "Africa"
    };
    
    // Add the countries
    this.addCountry(usaData);
    this.addCountry(canadaData);
    this.addCountry(ukData);
    this.addCountry(franceData);
    this.addCountry(germanyData);
    this.addCountry(russiaData);
    this.addCountry(chinaData);
    this.addCountry(indiaData);
    this.addCountry(japanData);
    this.addCountry(brazilData);
    this.addCountry(australiaData);
    this.addCountry(southAfricaData);
    this.addCountry(egyptData);
    
    // Add political events for USA
    const usaEvents: InsertPoliticalEvent[] = [
      {
        countryCode: "usa",
        period: "1993-2001",
        title: "Bill Clinton Administration",
        description: "President Bill Clinton's two terms saw economic prosperity, the passage of NAFTA, and major welfare reform. The administration faced political challenges including impeachment proceedings.",
        partyColor: "Democratic",
        partyName: "Democratic",
        tags: ["Economic Boom", "NAFTA"],
        order: 1
      },
      {
        countryCode: "usa",
        period: "2001-2009",
        title: "George W. Bush Administration",
        description: "Following the September 11 attacks, President Bush launched the War on Terror, including invasions of Afghanistan and Iraq. His presidency also saw major tax cuts and the 2008 financial crisis.",
        partyColor: "Republican",
        partyName: "Republican",
        tags: ["War on Terror", "Financial Crisis"],
        order: 2
      },
      {
        countryCode: "usa",
        period: "2009-2017",
        title: "Barack Obama Administration",
        description: "President Obama led economic recovery efforts after the 2008 crisis and passed the Affordable Care Act. His administration also saw the killing of Osama bin Laden and the legalization of same-sex marriage.",
        partyColor: "Democratic",
        partyName: "Democratic",
        tags: ["Affordable Care Act", "Economic Recovery"],
        order: 3
      },
      {
        countryCode: "usa",
        period: "2017-2021",
        title: "Donald Trump Administration",
        description: "President Trump's term featured tax cuts, trade conflicts with China, and immigration policy changes. His presidency concluded with the COVID-19 pandemic and contested 2020 election results.",
        partyColor: "Republican",
        partyName: "Republican",
        tags: ["America First", "COVID-19 Pandemic"],
        order: 4
      },
      {
        countryCode: "usa",
        period: "2021-Present",
        title: "Joe Biden Administration",
        description: "President Biden's term began with COVID-19 response efforts and the American Rescue Plan. His administration has focused on infrastructure investment, climate policy, and international alliance rebuilding.",
        partyColor: "Democratic",
        partyName: "Democratic",
        tags: ["COVID Recovery", "Infrastructure"],
        order: 5
      }
    ];

    // Add political events for UK
    const ukEvents: InsertPoliticalEvent[] = [
      {
        countryCode: "gbr",
        period: "1990-1997",
        title: "John Major Administration",
        description: "Following Margaret Thatcher, John Major led the UK through economic challenges and European integration debates. His government signed the Maastricht Treaty, leading to the creation of the European Union.",
        partyColor: "Conservative",
        partyName: "Conservative",
        tags: ["Maastricht Treaty", "Post-Thatcher Era"],
        order: 1
      },
      {
        countryCode: "gbr",
        period: "1997-2007",
        title: "Tony Blair Administration",
        description: "Tony Blair's 'New Labour' government implemented constitutional reforms and expanded public services. His foreign policy was marked by close alliance with the US, particularly during the Iraq War.",
        partyColor: "Labour",
        partyName: "Labour",
        tags: ["Third Way Politics", "Iraq War"],
        order: 2
      },
      {
        countryCode: "gbr",
        period: "2007-2010",
        title: "Gordon Brown Administration",
        description: "Gordon Brown's premiership was dominated by the global financial crisis. His government nationalized several banks and implemented stimulus measures to combat economic downturn.",
        partyColor: "Labour",
        partyName: "Labour",
        tags: ["Financial Crisis", "Bank Bailouts"],
        order: 3
      },
      {
        countryCode: "gbr",
        period: "2010-2016",
        title: "David Cameron Administration",
        description: "David Cameron formed a coalition government with the Liberal Democrats, implementing austerity measures. His government legalized same-sex marriage and held the Brexit referendum, which led to his resignation.",
        partyColor: "Conservative",
        partyName: "Conservative",
        tags: ["Austerity", "Brexit Referendum"],
        order: 4
      },
      {
        countryCode: "gbr",
        period: "2016-2019",
        title: "Theresa May Administration",
        description: "Theresa May's premiership focused on Brexit negotiations with the EU. She called a snap election in 2017 which reduced her party's majority, complicating Brexit proceedings.",
        partyColor: "Conservative",
        partyName: "Conservative",
        tags: ["Brexit Negotiations", "Snap Election"],
        order: 5
      },
      {
        countryCode: "gbr",
        period: "2019-2022",
        title: "Boris Johnson Administration",
        description: "Boris Johnson secured a Brexit deal and led the UK's withdrawal from the EU. His government faced the COVID-19 pandemic and implemented national lockdowns and vaccination programs.",
        partyColor: "Conservative",
        partyName: "Conservative",
        tags: ["Brexit Completion", "COVID-19 Response"],
        order: 6
      },
      {
        countryCode: "gbr",
        period: "2022-Present",
        title: "Recent Administrations",
        description: "Following Boris Johnson, the UK has seen short-lived premierships addressing economic challenges, inflation, and post-Brexit adjustments while navigating international relations.",
        partyColor: "Conservative",
        partyName: "Conservative",
        tags: ["Economic Challenges", "Post-Brexit Era"],
        order: 7
      }
    ];
    
    // Add the events
    usaEvents.forEach(event => this.addPoliticalEvent(event));
    ukEvents.forEach(event => this.addPoliticalEvent(event));
    
    // Add basic events for other countries
    this.addBasicEventsForCountry("can", "Canada");
    this.addBasicEventsForCountry("fra", "France");
    this.addBasicEventsForCountry("deu", "Germany");
    this.addBasicEventsForCountry("rus", "Russia");
    this.addBasicEventsForCountry("chn", "China");
    this.addBasicEventsForCountry("ind", "India");
    this.addBasicEventsForCountry("jpn", "Japan");
    this.addBasicEventsForCountry("bra", "Brazil");
    this.addBasicEventsForCountry("aus", "Australia");
    this.addBasicEventsForCountry("zaf", "South Africa");
    this.addBasicEventsForCountry("egy", "Egypt");
  }
  
  private addBasicEventsForCountry(countryCode: string, countryName: string) {
    const basicEvents: InsertPoliticalEvent[] = [
      {
        countryCode,
        period: "1993-2000",
        title: "Early 1990s Reforms",
        description: `${countryName} underwent significant political and economic reforms in the early to mid-1990s, adapting to the post-Cold War global order.`,
        partyColor: countryCode === "rus" || countryCode === "chn" ? "Single-Party" : "Various",
        partyName: countryCode === "rus" ? "Mixed" : (countryCode === "chn" ? "Communist Party" : "Various"),
        tags: ["Political Reform", "Economic Changes"],
        order: 1
      },
      {
        countryCode,
        period: "2000-2010",
        title: "Early 21st Century",
        description: `${countryName} navigated international challenges including terrorism concerns, technological change, and global economic volatility during this decade.`,
        partyColor: countryCode === "rus" || countryCode === "chn" ? "Single-Party" : "Various",
        partyName: countryCode === "rus" ? "United Russia" : (countryCode === "chn" ? "Communist Party" : "Various"),
        tags: ["Globalization", "Economic Development"],
        order: 2
      },
      {
        countryCode,
        period: "2010-2020",
        title: "Contemporary Developments",
        description: `${countryName} experienced political evolution influenced by technological disruption, social movements, and economic policies adapted to changing global conditions.`,
        partyColor: countryCode === "rus" || countryCode === "chn" ? "Single-Party" : "Various",
        partyName: countryCode === "rus" ? "United Russia" : (countryCode === "chn" ? "Communist Party" : "Various"),
        tags: ["Digital Age", "Political Evolution"],
        order: 3
      },
      {
        countryCode,
        period: "2020-Present",
        title: "Recent Years",
        description: `${countryName} has addressed challenges including the COVID-19 pandemic, climate change concerns, and evolving international relations in the current geopolitical landscape.`,
        partyColor: countryCode === "rus" || countryCode === "chn" ? "Single-Party" : "Various",
        partyName: countryCode === "rus" ? "United Russia" : (countryCode === "chn" ? "Communist Party" : "Various"),
        tags: ["Pandemic Response", "Current Affairs"],
        order: 4
      }
    ];
    
    basicEvents.forEach(event => this.addPoliticalEvent(event));
  }
}

export const storage = new MemStorage();
