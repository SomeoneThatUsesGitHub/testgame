import { CountryWithEvents } from "@shared/schema";
import Timeline from "./Timeline";
import StatisticsCharts from "./StatisticsCharts";
import DemographicsCharts from "./DemographicsCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPopulation } from "../lib/map-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface CountryInfoPanelProps {
  country?: CountryWithEvents;
  isLoading: boolean;
  onClose: () => void;
}

const CountryInfoPanel = ({ country, isLoading, onClose }: CountryInfoPanelProps) => {
  // Keep track of the last valid country even when data is changing
  const [lastValidCountry, setLastValidCountry] = useState<CountryWithEvents | undefined>(undefined);
  
  // Update our local state when we get a valid country from props
  useEffect(() => {
    if (country) {
      setLastValidCountry(country);
    }
  }, [country]);
  
  // Use either the current country or our last valid one
  const displayCountry = country || lastValidCountry;
  
  // Debug logging
  console.log("CountryInfoPanel rendering with country:", displayCountry ? displayCountry.name : "none");
  console.log("Loading state:", isLoading);
  
  // Handler for closing panel
  const handleClose = (e: React.MouseEvent) => {
    console.log("CountryInfoPanel: handleClose called");
    e.preventDefault();
    e.stopPropagation();
    console.log("CountryInfoPanel: Calling parent onClose");
    onClose();
  };
  
  return (
    <div className="w-full md:w-2/5 lg:w-3/10 bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:relative inset-0 z-10">
      <div id="country-info-panel" className="flex flex-col h-full transition-all duration-300 ease-in-out">
        {/* No country selected state */}
        {!displayCountry && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-dark">No Country Selected</h2>
            <p className="text-gray-500">Click on any country on the map to view its political history over the last 30 years.</p>
          </div>
        )}

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

        {/* Country details state */}
        {displayCountry && !isLoading && (
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
                <h2 className="text-2xl font-bold">{displayCountry.name}</h2>
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
                  <p className="font-medium">{displayCountry.capital}</p>
                </div>
                <div>
                  <p className="text-sm text-white text-opacity-80">Population</p>
                  <p className="font-medium">{formatPopulation(displayCountry.population)}</p>
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

                <Timeline events={displayCountry.events || []} />
              </TabsContent>
              
              <TabsContent value="statistics" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <StatisticsCharts country={displayCountry} />
              </TabsContent>
              
              <TabsContent value="demographics" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <DemographicsCharts country={displayCountry} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryInfoPanel;
