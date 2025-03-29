import { CountryWithEvents } from "@shared/schema";
import Timeline from "./Timeline";
import StatisticsCharts from "./StatisticsCharts";
import DemographicsCharts from "./DemographicsCharts";
import PoliticalLeaderCard from "./PoliticalLeaderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPopulation } from "../lib/map-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useRef } from "react";

interface StableCountryPanelProps {
  countryCode: string | null;
  onClose: () => void;
}

// IMPORTANT: This static variable persists across renders and component unmounts/remounts
// We use this to keep track of the current country display state outside React's lifecycle
let GLOBAL_STATE = {
  activeCountryCode: null as string | null,
  isPanelActive: false,
  panelGUID: Math.random().toString(36).substring(2, 15),
};

const StableCountryPanel = ({ countryCode, onClose }: StableCountryPanelProps) => {
  // Generate a unique ID for this specific panel instance
  const panelId = useRef(Math.random().toString(36).substring(2, 15));
  
  // Component state
  const [country, setCountry] = useState<CountryWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState<number>(0);
  
  // Track our own code to prevent issues with React re-renders
  const stableCodeRef = useRef<string | null>(null);
  
  // Track if the panel is actively visible
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Initial setup
  useEffect(() => {
    console.log(`Panel ${panelId.current} mounted`);
    console.log("Current global panel state:", GLOBAL_STATE);
    
    // Mark this panel as the active one 
    GLOBAL_STATE.isPanelActive = true;
    GLOBAL_STATE.panelGUID = panelId.current;
    
    // Sync our state with the global state
    if (countryCode) {
      stableCodeRef.current = countryCode;
      GLOBAL_STATE.activeCountryCode = countryCode;
      setIsActive(true);
    }
    
    // Cleanup
    return () => {
      console.log(`Panel ${panelId.current} unmounting`);
      // Only clear global state if this is the active panel
      if (GLOBAL_STATE.panelGUID === panelId.current) {
        console.log("Clearing global panel state");
        GLOBAL_STATE.isPanelActive = false;
        GLOBAL_STATE.activeCountryCode = null;
      }
    };
  }, []);
  
  // Track countryCode changes
  useEffect(() => {
    if (countryCode === null) {
      console.log(`Panel ${panelId.current} received null country code`);
      // Only update if we're the active panel
      if (GLOBAL_STATE.panelGUID === panelId.current) {
        stableCodeRef.current = null;
        GLOBAL_STATE.activeCountryCode = null;
        setIsActive(false);
      }
    } else if (countryCode !== stableCodeRef.current) {
      console.log(`Panel ${panelId.current} received new country code:`, countryCode);
      
      // Capture this new code in our local ref and global state
      stableCodeRef.current = countryCode;
      GLOBAL_STATE.activeCountryCode = countryCode;
      
      // This is now the active panel
      GLOBAL_STATE.panelGUID = panelId.current;
      setIsActive(true);
      
      // Force a re-fetch by bumping our force render counter
      setForceRender(prev => prev + 1);
    }
  }, [countryCode]);
  
  // Fetch country data based on our stable code reference
  useEffect(() => {
    // Don't fetch if we're not active
    if (!isActive || !stableCodeRef.current) {
      console.log(`Panel ${panelId.current} is inactive or has no code, skipping fetch`);
      return;
    }
    
    const fetchCountryData = async () => {
      // Use our stable reference, not the prop
      const code = stableCodeRef.current;
      
      if (!code) {
        console.log(`Panel ${panelId.current} has no code to fetch`);
        return;
      }
      
      console.log(`Panel ${panelId.current} fetching data for:`, code);
      setIsLoading(true);
      setError(null);
      
      try {
        // Only allow the fetch if this is the active panel
        if (GLOBAL_STATE.panelGUID !== panelId.current) {
          console.log(`Panel ${panelId.current} is not the active panel, canceling fetch`);
          return;
        }
        
        const response = await fetch(`/api/countries/${code}/with-events`);
        
        // Check again after fetch completes
        if (GLOBAL_STATE.panelGUID !== panelId.current) {
          console.log(`Panel ${panelId.current} is not the active panel after fetch, discarding results`);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch country data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Panel ${panelId.current} fetched data for ${data.name}`);
        
        // Final check before updating state
        if (GLOBAL_STATE.panelGUID !== panelId.current) {
          console.log(`Panel ${panelId.current} is not the active panel before state update, discarding results`);
          return;
        }
        
        // Log the specific data structure
        console.log("COUNTRY DATA RECEIVED:", data);
        console.log("LEADER DATA AVAILABLE:", data.leader ? "YES" : "NO");
        setCountry(data);
      } catch (err) {
        console.error(`Panel ${panelId.current} encountered an error:`, err);
        
        if (GLOBAL_STATE.panelGUID === panelId.current) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        if (GLOBAL_STATE.panelGUID === panelId.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCountryData();
  }, [isActive, forceRender]);
  
  // Handler for closing panel 
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Panel ${panelId.current} close button clicked`);
    
    // Mark this panel as inactive
    GLOBAL_STATE.isPanelActive = false;
    GLOBAL_STATE.activeCountryCode = null;
    
    // Update our local state
    stableCodeRef.current = null;
    setIsActive(false);
    
    // Call the parent handler
    onClose();
  };
  
  // If we're not active and have no country code, don't render
  if (!isActive && !countryCode) {
    return null;
  }
  
  return (
    <div className="w-full md:w-2/5 lg:w-3/10 bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:relative inset-0 z-10">
      <div id="country-info-panel" className="flex flex-col h-full transition-all duration-300 ease-in-out">
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
            <Tabs defaultValue="leadership" className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="border-b border-gray-200 flex-shrink-0">
                <div className="flex overflow-x-auto">
                  <TabsList className="h-auto border-b-0 flex space-x-2 p-1">
                    <TabsTrigger value="leadership" className="px-4 py-3 text-sm font-medium bg-gray-100 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                      Leadership
                    </TabsTrigger>
                    <TabsTrigger value="history" className="px-4 py-3 text-sm font-medium bg-gray-100 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                      Political History
                    </TabsTrigger>
                    <TabsTrigger value="statistics" className="px-4 py-3 text-sm font-medium bg-gray-100 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                      Statistics
                    </TabsTrigger>
                    <TabsTrigger value="demographics" className="px-4 py-3 text-sm font-medium bg-gray-100 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                      Demographics
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <TabsContent value="leadership" className="flex-1 overflow-y-auto p-4 m-0 border-0 h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Current Leadership</h3>
                  <p className="text-gray-600 text-sm">Information about the current political leader of {country.name}.</p>
                </div>
                
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mt-8">
                  <div className="w-full">
                    <PoliticalLeaderCard 
                      leader={country.leader} 
                      isLoading={isLoading} 
                      className="shadow-md"
                    />
                  </div>
                </div>
              </TabsContent>
              
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
};

export default StableCountryPanel;