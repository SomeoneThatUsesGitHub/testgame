import { CountryWithEvents } from "@shared/schema";
import Timeline from "./Timeline";
import StatisticsCharts from "./StatisticsCharts";
import DemographicsCharts from "./DemographicsCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPopulation } from "../lib/map-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

interface CountryInfoPanelProps {
  country?: CountryWithEvents;
  isLoading: boolean;
  onClose: () => void;
}

const CountryInfoPanel = ({ country, isLoading, onClose }: CountryInfoPanelProps) => {
  // Debug logging
  console.log("CountryInfoPanel rendering with country:", country ? country.name : "none");
  console.log("Loading state:", isLoading);
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div id="country-info-panel" className="flex flex-col h-full transition-all duration-300 ease-in-out">
        {/* No country selected state */}
        {!country && !isLoading && (
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
        {country && !isLoading && (
          <div className="flex-1 flex flex-col h-full">
            {/* Country header */}
            <div className="bg-primary text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{country.name}</h2>
                <button
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  title="Close panel"
                  onClick={onClose}
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
                <TabsList className="h-auto border-b-0 w-full justify-between sm:justify-start overflow-x-auto">
                  <TabsTrigger value="history" className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1 sm:flex-none whitespace-nowrap">
                    History
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1 sm:flex-none whitespace-nowrap">
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1 sm:flex-none whitespace-nowrap">
                    Demographics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="history" className="flex-1 overflow-y-auto p-4 m-0 border-0 absolute inset-0 top-[41px] pb-16">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Political Timeline (1993-2023)</h3>
                  <p className="text-gray-600 text-sm">A summary of major political events and leadership changes over the last 30 years.</p>
                </div>

                <Timeline events={country.events || []} />
              </TabsContent>
              
              <TabsContent value="statistics" className="flex-1 overflow-y-auto p-4 m-0 border-0 absolute inset-0 top-[41px] pb-16">
                <StatisticsCharts country={country} />
              </TabsContent>
              
              <TabsContent value="demographics" className="flex-1 overflow-y-auto p-4 m-0 border-0 absolute inset-0 top-[41px] pb-16">
                <DemographicsCharts country={country} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryInfoPanel;
