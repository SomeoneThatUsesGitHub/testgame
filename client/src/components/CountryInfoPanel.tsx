import { CountryWithEvents } from "@shared/schema";
import Timeline from "./Timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPopulation } from "../lib/map-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="w-full md:w-2/5 lg:w-3/10 bg-white border-l border-gray-200 flex flex-col">
      <div id="country-info-panel" className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out">
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
            <Tabs defaultValue="history" className="flex-1 flex flex-col">
              <div className="border-b border-gray-200">
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

              <TabsContent value="history" className="flex-1 overflow-y-auto p-4 m-0 border-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Political Timeline (1993-2023)</h3>
                  <p className="text-gray-600 text-sm">A summary of major political events and leadership changes over the last 30 years.</p>
                </div>

                <Timeline events={country.events || []} />
              </TabsContent>
              
              <TabsContent value="statistics" className="flex-1 overflow-y-auto p-4 m-0 border-0">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">Statistics Coming Soon</h3>
                    <p className="mt-2 text-sm text-gray-500">Detailed economic and social statistics will be available in a future update.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="demographics" className="flex-1 overflow-y-auto p-4 m-0 border-0">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">Demographics Coming Soon</h3>
                    <p className="mt-2 text-sm text-gray-500">Detailed population demographics will be available in a future update.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryInfoPanel;
