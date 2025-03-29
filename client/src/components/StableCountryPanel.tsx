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
            
            {/* Country header - Enhanced with gradient and better spacing */}
            <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{country.name}</h2>
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

            {/* Display Leadership Information First - Guaranteed Visible */}
            <div className="flex-1 flex flex-col h-full overflow-auto">
              {/* LEADERSHIP SECTION - FIRST AND MOST PROMINENT */}
              <div className="p-6 bg-white border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-primary">Current Leadership</h2>
                
                {/* Country Leader Card */}
                <div className="mb-6">

                  <PoliticalLeaderCard 
                    leader={country.leader} 
                    isLoading={isLoading} 
                    className="shadow-lg"
                  />
                </div>
              </div>
              
              {/* Navigation Section */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex p-2 justify-center space-x-2">
                  <button
                    onClick={() => document.getElementById('history-section')?.scrollIntoView({behavior: 'smooth'})}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    Political History
                  </button>
                  <button
                    onClick={() => document.getElementById('statistics-section')?.scrollIntoView({behavior: 'smooth'})}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    Statistics
                  </button>
                  <button
                    onClick={() => document.getElementById('demographics-section')?.scrollIntoView({behavior: 'smooth'})}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    Demographics
                  </button>
                </div>
              </div>
              
              {/* Other Sections - In scrollable area below */}
              <div id="history-section" className="p-6 bg-white border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">Political Timeline (1993-2023)</h2>
                <p className="text-gray-600 mb-6">A summary of major political events and leadership changes over the last 30 years.</p>
                <Timeline events={country.events || []} />
              </div>
              
              <div id="statistics-section" className="p-6 bg-white border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">Statistics</h2>
                <StatisticsCharts country={country} />
              </div>
              
              <div id="demographics-section" className="p-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Demographics</h2>
                <DemographicsCharts country={country} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StableCountryPanel;