import React, { useState, useEffect } from 'react';
import { CountryWithEvents } from "@shared/schema";
import { formatPopulation } from "../lib/map-utils";
import { Skeleton } from "@/components/ui/skeleton";
import LeadershipSection from './LeadershipSection';
import Timeline from './Timeline';
import StatisticsCharts from './StatisticsCharts';
import DemographicsCharts from './DemographicsCharts';

/**
 * A simplified country panel that replaces the problematic tabs-based version
 */
export default function SimpleFixedCountryPanel() {
  const [country, setCountry] = useState<CountryWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // EVENT HANDLER FOR COUNTRY SELECTION
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
  }
  
  // Hide when not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full w-full md:w-2/5 lg:w-3/10 bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:fixed right-0 top-[64px] md:top-[64px] bottom-0 z-40 shadow-xl">
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
            
            {/* Country header */}
            <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{country.name}</h2>
                {/* Close button - only visible on tablet/desktop */}
                <button
                  className="hidden md:block text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  title="Close panel"
                  onClick={handleClose}
                  aria-label="Close country information panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{country.capital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{formatPopulation(country.population)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{country.region}</span>
                </div>
              </div>
            </div>

            {/* All content in a simple scrollable container */}
            <div className="flex-1 flex flex-col h-full overflow-auto">
              {/* LEADERSHIP SECTION - FIRST */}
              <div className="p-6 bg-white border-b border-gray-100">
                <LeadershipSection
                  countryCode={country.code}
                  leader={country.leader}
                  isLoading={false}
                />
              </div>
              
              {/* POLITICAL HISTORY SECTION */}
              <div className="p-6 bg-white border-b border-gray-100">
                <h2 className="text-2xl font-bold text-primary mb-4">Political Timeline</h2>
                <p className="text-gray-600 mb-6">Major political events and changes over the last 30 years.</p>
                <Timeline events={country.events || []} />
              </div>
              
              {/* STATISTICS SECTION */}
              <div className="p-6 bg-white border-b border-gray-100">
                <h2 className="text-2xl font-bold text-primary mb-4">Statistics</h2>
                <p className="text-gray-600 mb-6">Economic and social statistics about {country.name}.</p>
                <StatisticsCharts country={country} />
              </div>
              
              {/* DEMOGRAPHICS SECTION */}
              <div className="p-6 bg-white border-b border-gray-100">
                <h2 className="text-2xl font-bold text-primary mb-4">Demographics</h2>
                <p className="text-gray-600 mb-6">Population demographics and distribution in {country.name}.</p>
                <DemographicsCharts country={country} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}