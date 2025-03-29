import { 
  countries, 
  politicalEvents,
  politicalLeaders, 
  type Country, 
  type InsertCountry, 
  type PoliticalEvent, 
  type InsertPoliticalEvent,
  type PoliticalLeader,
  type InsertPoliticalLeader, 
  type CountryWithEvents 
} from "@shared/schema";

export interface IStorage {
  getCountries(): Promise<Country[]>;
  getCountry(code: string): Promise<Country | undefined>;
  getCountryWithEvents(code: string): Promise<CountryWithEvents | undefined>;
  getPoliticalEvents(countryCode: string): Promise<PoliticalEvent[]>;
  getPoliticalLeader(countryCode: string): Promise<PoliticalLeader | undefined>;
  searchCountries(query: string): Promise<Country[]>;
}

export class MemStorage implements IStorage {
  private countries: Map<string, Country>;
  private politicalEvents: Map<string, PoliticalEvent[]>;
  private politicalLeaders: Map<string, PoliticalLeader>;
  private countryIdCounter: number;
  private eventIdCounter: number;
  private leaderIdCounter: number;

  constructor() {
    this.countries = new Map();
    this.politicalEvents = new Map();
    this.politicalLeaders = new Map();
    this.countryIdCounter = 1;
    this.eventIdCounter = 1;
    this.leaderIdCounter = 1;
    
    // Initialize with some data
    this.initializeData();
    
    // The code below can be uncommented to initialize from data files
    // Note: this approach would require additional implementation to access
    // the frontend data files from the backend - left as a comment for reference
    
    // try {
    //   console.log("Attempting to initialize from data files...");
    //   this.initializeFromFiles();
    // } catch (error) {
    //   console.log("Could not initialize from files, using default data", error);
    // }
  }
  
  // This method initializes data from the frontend country files
  // Note: In a production system, this would use a more sophisticated approach
  // to access the frontend files from the backend
  async initializeFromFiles(countryData: any) {
    if (!countryData || !countryData.countries || !Array.isArray(countryData.countries)) {
      console.log("Invalid country data format provided");
      return;
    }
    
    console.log(`Initializing ${countryData.countries.length} countries from files...`);
    
    // Add countries
    countryData.countries.forEach((country: any) => {
      this.addCountry({
        code: country.code,
        name: country.name,
        capital: country.capital,
        population: country.population,
        color: country.color,
        region: country.region
      });
    });
    
    // Add events
    if (countryData.events && Array.isArray(countryData.events)) {
      countryData.events.forEach((event: any) => {
        this.addPoliticalEvent({
          countryCode: event.countryCode,
          period: event.period,
          title: event.title,
          description: event.description,
          partyName: event.partyName,
          partyColor: event.partyColor,
          tags: event.tags,
          order: event.order
        });
      });
    }
    
    // Add leaders
    if (countryData.leaders && Array.isArray(countryData.leaders)) {
      countryData.leaders.forEach((leader: any) => {
        this.addPoliticalLeader({
          countryCode: leader.countryCode,
          name: leader.name,
          title: leader.title,
          party: leader.party,
          inPowerSince: leader.inPowerSince,
          imageUrl: leader.imageUrl,
          description: leader.description
        });
      });
    }
    
    console.log(`Initialization complete: ${this.countries.size} countries, ${this.politicalEvents.size} event sets, ${this.politicalLeaders.size} leaders`);
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
    const leader = this.politicalLeaders.get(code);
    
    return {
      ...country,
      events,
      leader
    };
  }
  
  async getPoliticalLeader(countryCode: string): Promise<PoliticalLeader | undefined> {
    return this.politicalLeaders.get(countryCode);
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
    const newCountry: Country = { 
      ...country, 
      id, 
      region: country.region || null 
    };
    this.countries.set(country.code, newCountry);
    return newCountry;
  }

  private addPoliticalEvent(event: InsertPoliticalEvent): PoliticalEvent {
    const id = this.eventIdCounter++;
    // Explicitly convert tags to string array to match PoliticalEvent type
    const tags = event.tags ? [...event.tags] : null;
    
    const newEvent: PoliticalEvent = { 
      ...event, 
      id,
      partyColor: event.partyColor || null,
      partyName: event.partyName || null,
      tags
    };
    
    const events = this.politicalEvents.get(event.countryCode) || [];
    events.push(newEvent);
    this.politicalEvents.set(event.countryCode, events);
    
    return newEvent;
  }
  
  private addPoliticalLeader(leader: InsertPoliticalLeader): PoliticalLeader {
    const id = this.leaderIdCounter++;
    const newLeader: PoliticalLeader = { 
      ...leader, 
      id,
      imageUrl: leader.imageUrl || null
    };
    
    this.politicalLeaders.set(leader.countryCode, newLeader);
    
    return newLeader;
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
    
    // Add political leaders
    const leaders: InsertPoliticalLeader[] = [
      {
        countryCode: "usa",
        name: "Joe Biden",
        title: "President",
        party: "Democratic Party",
        inPowerSince: "2021",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait_%28cropped%29.jpg",
        description: "Joe Biden is the 46th President of the United States, taking office in January 2021. Prior to his presidency, he served as Vice President under Barack Obama from 2009 to 2017 and represented Delaware in the U.S. Senate for 36 years."
      },
      {
        countryCode: "fra",
        name: "Emmanuel Macron",
        title: "President",
        party: "La République En Marche",
        inPowerSince: "2017",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Emmanuel_Macron_in_2019.jpg",
        description: "Emmanuel Macron is the President of France since May 2017. A former investment banker and economy minister, he founded the centrist political party La République En Marche and has pursued economic reforms and strengthening of the European Union."
      },
      {
        countryCode: "gbr",
        name: "Rishi Sunak",
        title: "Prime Minister",
        party: "Conservative Party",
        inPowerSince: "2022",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Rishi_Sunak_official_portrait_%28cropped%29.jpg",
        description: "Rishi Sunak has served as Prime Minister of the United Kingdom since October 2022. Prior to this, he was Chancellor of the Exchequer from 2020 to 2022. He is the first British Asian and Hindu to hold the office of Prime Minister."
      },
      {
        countryCode: "deu",
        name: "Olaf Scholz",
        title: "Chancellor",
        party: "Social Democratic Party",
        inPowerSince: "2021",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Olaf_Scholz_July_2023.jpg",
        description: "Olaf Scholz has served as Chancellor of Germany since December 2021, leading a coalition government. He previously served as Vice Chancellor of Germany and Federal Minister of Finance from 2018 to 2021."
      },
      {
        countryCode: "chn",
        name: "Xi Jinping",
        title: "President",
        party: "Communist Party of China",
        inPowerSince: "2013",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Xi_Jinping_2019.jpg",
        description: "Xi Jinping has been the General Secretary of the Chinese Communist Party and Chairman of the Central Military Commission since 2012, and President of the People's Republic of China since 2013. His political thoughts have been incorporated into the constitution of the Communist Party of China."
      }
    ];
    
    leaders.forEach(leader => this.addPoliticalLeader(leader));
    
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
