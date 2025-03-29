import React, { useState, useEffect } from 'react';
import { CountryWithEvents } from "@shared/schema";
import { formatPopulation } from "../lib/map-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadershipSection from './LeadershipSection';
import Timeline from './Timeline';
import StatisticsCharts from './StatisticsCharts';
import DemographicsCharts from './DemographicsCharts';

// Import flags (we'll use free flag CDN)
const getFlagUrl = (countryCode: string) => {
  // Convert our country codes to 2-letter ISO codes for the flag API
  const twoLetterCode = convertToTwoLetterCode(countryCode.toLowerCase());
  return `https://flagcdn.com/w640/${twoLetterCode}.png`;
};

// Convert our 3-letter country codes to 2-letter codes for the flag API
const convertToTwoLetterCode = (code: string): string => {
  const codeMap: Record<string, string> = {
    'usa': 'us',
    'gbr': 'gb',
    'fra': 'fr',
    'deu': 'de',
    'jpn': 'jp',
    'chn': 'cn',
    'rus': 'ru',
    'ind': 'in',
    'bra': 'br',
    'aus': 'au',
    'can': 'ca',
    'zaf': 'za',
    'egy': 'eg'
  };
  
  return codeMap[code] || code;
};

/**
 * A simplified country panel that replaces the problematic tabs-based version
 */
export default function SimpleFixedCountryPanel() {
  const [country, setCountry] = useState<CountryWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('politics');

  // EVENT HANDLER FOR COUNTRY SELECTION
  // Effect to toggle body class when panel is open/closed
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('country-panel-open');
    } else {
      document.body.classList.remove('country-panel-open');
    }
    
    return () => {
      document.body.classList.remove('country-panel-open');
    };
  }, [isOpen]);
  
  useEffect(() => {
    function handleCountrySelected(e: Event) {
      const event = e as CustomEvent;
      const countryName = event.detail;
      
      // Exit if no countryName
      if (!countryName) return;
      
      console.log("PANEL: Country selected:", countryName);
      
      // HARDCODED MAPPING - only the countries we know exist in our database
      let countryCode;
      if (countryName.includes("United States") || countryName === "USA" || countryName === "US") {
        countryCode = "usa";
      } else if (countryName.includes("United Kingdom") || countryName === "UK") {
        countryCode = "gbr";
      } else if (countryName === "Russia") {
        countryCode = "rus";
      } else if (countryName === "China") {
        countryCode = "chn";
      } else if (countryName === "France") {
        countryCode = "fra";
      } else if (countryName === "Germany") {
        countryCode = "deu";
      } else if (countryName === "Japan") {
        countryCode = "jpn";
      } else if (countryName === "India") {
        countryCode = "ind";
      } else if (countryName === "Brazil") {
        countryCode = "bra";
      } else if (countryName === "Australia") {
        countryCode = "aus";
      } else if (countryName === "Canada") {
        countryCode = "can";
      } else if (countryName === "South Africa") {
        countryCode = "zaf";
      } else if (countryName === "Egypt") {
        countryCode = "egy";
      } else {
        console.warn("Country not recognized:", countryName);
        return; // Don't open panel for unknown countries
      }
      
      // Open panel and fetch data
      setIsOpen(true);
      setIsLoading(true);
      
      // Fetch country data with leader info
      fetch(`/api/countries/${countryCode}/with-events`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch country data");
          }
          return response.json();
        })
        .then(data => {
          console.log("PANEL: Data loaded successfully:", data.name);
          console.log("PANEL: Leader data:", data.leader ? "PRESENT" : "MISSING");
          setCountry(data);
          setIsLoading(false);
          // Reset to politics tab when a new country is selected
          setActiveTab('politics');
        })
        .catch(err => {
          console.error("PANEL: Error loading country data:", err);
          setError("Failed to load country information");
          setIsLoading(false);
        });
    }
    
    // Add event listener
    document.addEventListener('countrySelected', handleCountrySelected);
    
    return () => {
      document.removeEventListener('countrySelected', handleCountrySelected);
    };
  }, []);
  
  // Close handler
  function handleClose() {
    console.log("PANEL: Closing panel");
    setIsOpen(false);
    setCountry(null);
    // Reset to politics tab when panel is closed
    setActiveTab('politics');
  }
  
  // Hide when not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full w-full md:w-full lg:w-full bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:fixed right-0 top-[64px] md:top-[64px] bottom-0 z-40 shadow-xl country-fullscreen-bg">
      <div className="flex flex-col h-full">
        {/* Loading state */}
        {isLoading && (
          <div className="flex-1 p-6 space-y-4">
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <div className="flex gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-full rounded-md mt-6" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-dark">Error Loading Data</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Country details state */}
        {country && !isLoading && !error && (
          <div className="flex-1 flex flex-col h-full">
            {/* Mobile header with back button - only visible on mobile */}
            <div className="bg-gray-800 text-white p-3 md:hidden flex items-center justify-between">
              <button 
                onClick={handleClose}
                className="flex items-center text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Map
              </button>
              <h2 className="text-sm font-medium">Country Information</h2>
              <div className="w-4"></div> {/* Empty space for balance */}
            </div>
            
            {/* Compact, stylish header without the large flag banner */}
            <div className="bg-gradient-to-r from-primary/90 to-blue-600/90 py-5 md:py-6 px-6 md:px-8 shadow-md">
              <div className="md:max-w-7xl md:mx-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Region badge */}
                    <div className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 rounded-full text-sm font-medium">
                      {country.region}
                    </div>
                    
                    {/* Small flag indicator */}
                    <img 
                      src={getFlagUrl(country.code)} 
                      alt={`${country.name} flag`} 
                      className="h-5 w-7 object-cover rounded shadow-sm" 
                    />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{country.name}</h2>
                  
                  <div className="flex flex-wrap gap-4 items-center text-white mt-2">
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm md:text-base">{country.capital}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm md:text-base">{formatPopulation(country.population)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Back to map button - visible on all devices */}
                  <button
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-1.5 px-3 rounded-md text-sm font-medium hover:bg-white/30 transition-colors"
                    onClick={handleClose}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden md:inline">Return to Map</span>
                  </button>
                  
                  {/* Close button */}
                  <button
                    className="text-white hover:bg-white/20 rounded-md p-2 transition-colors"
                    title="Close panel"
                    onClick={handleClose}
                    aria-label="Close country information panel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced layout for full-screen display */}
            <div className="flex-1 flex flex-col overflow-auto">
              {/* Two-column layout for desktop */}
              <div className="flex flex-col md:flex-row">
                {/* LEADERSHIP SECTION - left column on desktop */}
                <div className="w-full md:w-1/3 lg:w-1/4 md:border-r border-gray-200 p-4 md:p-6">
                  <div className="bg-white rounded-lg shadow-sm p-5 md:sticky md:top-6">
                    {country.leader ? (
                      <LeadershipSection
                        countryCode={country.code}
                        leader={country.leader}
                        isLoading={false}
                      />
                    ) : (
                      <div className="py-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text mb-2">Leadership Information</h2>
                        <p className="text-gray-500">No current leadership data is available for {country.name}.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* TABS CONTENT - right column (main content) on desktop */}
                <div className="flex-1 bg-white">
                  {/* Enhanced Tab Controls */}
                  <div className="border-b bg-white shadow-sm">
                    <div className="flex w-full justify-center p-0 h-14 bg-white max-w-4xl mx-auto">
                      <button 
                        onClick={() => setActiveTab('politics')}
                        className={`flex-1 h-full flex items-center justify-center gap-2 font-medium transition-colors ${
                          activeTab === 'politics' 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <span>Politics</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('statistics')}
                        className={`flex-1 h-full flex items-center justify-center gap-2 font-medium transition-colors ${
                          activeTab === 'statistics' 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V10"></path>
                          <path d="M12 20V4"></path>
                          <path d="M6 20v-6"></path>
                        </svg>
                        <span>Statistics</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('demographics')}
                        className={`flex-1 h-full flex items-center justify-center gap-2 font-medium transition-colors ${
                          activeTab === 'demographics' 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Demographics</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Contents */}
                  <div className="flex-1 country-tabs-container p-4 md:p-6">
                    {/* POLITICAL TIMELINE TAB */}
                    {activeTab === 'politics' && (
                      <div className="country-panel-tab bg-white p-6 md:p-8">
                        <div className="max-w-5xl mx-auto">
                          <h2 className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">Political Timeline</h2>
                          <p className="md:text-lg">Major political events and changes over the last 30 years.</p>
                          <Timeline events={country.events || []} />
                        </div>
                      </div>
                    )}
                    
                    {/* STATISTICS TAB */}
                    {activeTab === 'statistics' && (
                      <div className="country-panel-tab bg-white p-6 md:p-8">
                        <div className="max-w-5xl mx-auto">
                          <h2 className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">Statistics</h2>
                          <p className="md:text-lg">Economic and social statistics about {country.name}.</p>
                          <StatisticsCharts country={country} />
                        </div>
                      </div>
                    )}
                    
                    {/* DEMOGRAPHICS TAB */}
                    {activeTab === 'demographics' && (
                      <div className="country-panel-tab bg-white p-6 md:p-8">
                        <div className="max-w-5xl mx-auto">
                          <h2 className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">Demographics</h2>
                          <p className="md:text-lg">Population demographics and distribution in {country.name}.</p>
                          <DemographicsCharts country={country} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}