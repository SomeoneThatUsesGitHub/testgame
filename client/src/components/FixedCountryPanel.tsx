import React, { useState, useEffect } from 'react';
import { CountryWithEvents } from "@shared/schema";
import Timeline from "./Timeline";
import StatisticsCharts from "./StatisticsCharts";
import DemographicsCharts from "./DemographicsCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPopulation } from "../lib/map-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * SUPER SIMPLE HARDCODED VERSION THAT JUST WORKS
 */
export default function FixedCountryPanel() {
  const [country, setCountry] = useState<CountryWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ULTRA SIMPLE EVENT HANDLER
  useEffect(() => {
    function handleCountrySelected(e: Event) {
      const event = e as CustomEvent;
      const countryName = event.detail;
      
      // Exit if no countryName
      if (!countryName) return;
      
      console.log("FIXED PANEL: Country selected:", countryName);
      
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
      
      // SUPER SIMPLE LOGIC
      setIsOpen(true);
      setIsLoading(true);
      
      // SIMPLE FETCH
      fetch(`/api/countries/${countryCode}/with-events`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch country data");
          }
          return response.json();
        })
        .then(data => {
          console.log("FIXED PANEL: Data loaded successfully:", data.name);
          setCountry(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("FIXED PANEL: Error loading country data:", err);
          setError("Failed to load country information");
          setIsLoading(false);
        });
    }
    
    // Simple event listener
    document.addEventListener('countrySelected', handleCountrySelected);
    
    return () => {
      document.removeEventListener('countrySelected', handleCountrySelected);
    };
  }, []);
  
  // Simple close handler
  function handleClose() {
    console.log("FIXED PANEL: Closing panel");
    setIsOpen(false);
    setCountry(null);
  }
  
  // ULTRA SIMPLE RENDERING
  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full w-full md:w-2/5 lg:w-3/10 bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:fixed right-0 top-[64px] bottom-0 z-50">
      <div className="flex flex-col h-full transition-all duration-300 ease-in-out">
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
            {/* Return to map button - only visible on mobile */}
            <div className="bg-gray-800 text-white p-3 md:hidden">
              <button 
                onClick={handleClose}
                className="flex items-center text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Map
              </button>
            </div>
            
            {/* Country header */}
            <div className="bg-primary text-white p-6">
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
              <div className="flex mt-4">
                <div className="mr-8">
                  <p className="text-sm text-white text-opacity-80">Capital</p>
                  <p className="font-medium">{country.capital}</p>
                </div>
                <div>
                  <p className="text-sm text-white text-opacity-80">Population</p>
                  <p className="font-medium">{formatPopulation(country.population)}</p>
                </div>
              </div>
            </div>

            {/* Country tabs */}
            <Tabs defaultValue="history" className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="border-b border-gray-200 flex-shrink-0">
                <TabsList className="h-auto border-b-0">
                  <TabsTrigger value="history" className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Political History
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Demographics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="history" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Political Timeline (1993-2023)</h3>
                  <p className="text-gray-600 text-sm">A summary of major political events and leadership changes over the last 30 years.</p>
                </div>

                <Timeline events={country.events || []} />
              </TabsContent>
              
              <TabsContent value="statistics" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <StatisticsCharts country={country} />
              </TabsContent>
              
              <TabsContent value="demographics" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <DemographicsCharts country={country} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}