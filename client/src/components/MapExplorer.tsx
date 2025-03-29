import { useState, useEffect } from "react";
import MapContainer from "./MapContainer";
import CountryInfoPanel from "./CountryInfoPanel";
import SearchBar from "./SearchBar";
import { Country, CountryWithEvents } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

const MapExplorer = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all countries for the map
  const { data: countries, isLoading: isLoadingCountries, error: countriesError } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    retry: 3,
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: false
  });

  // Debug logging
  useEffect(() => {
    if (countriesError) {
      console.error("Error fetching countries:", countriesError);
    } else if (countries) {
      console.log("Countries data loaded:", countries.length, "countries");
    }
  }, [countries, countriesError]);
  
  // Initialize from localStorage if there's a stored country code
  useEffect(() => {
    if (typeof window !== 'undefined' && !selectedCountryCode) {
      try {
        const savedCode = localStorage.getItem('selectedCountryCode');
        if (savedCode && countries?.some(c => c.code === savedCode)) {
          console.log("Restoring country selection from localStorage:", savedCode);
          setSelectedCountryCode(savedCode);
        }
      } catch (e) {
        console.error("Failed to read from localStorage:", e);
      }
    }
  }, [countries, selectedCountryCode]);

  // Fetch selected country details with events when a country is selected
  const { data: selectedCountry, isLoading: isLoadingCountry, error: countryError } = useQuery<CountryWithEvents>({
    queryKey: [`/api/countries/${selectedCountryCode}/with-events`],
    enabled: !!selectedCountryCode,
    retry: 2,
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: false,
    gcTime: 0 // Don't garbage collect the data too quickly
  });
  
  // Debug logging for selected country
  useEffect(() => {
    if (countryError) {
      console.error("Error fetching country details:", countryError);
    } else if (selectedCountry) {
      console.log("Selected country with events data loaded:", selectedCountry);
      console.log("Country API response events:", selectedCountry.events);
    } else if (selectedCountryCode && !selectedCountry && !isLoadingCountry) {
      console.error("Country data is undefined after loading completed");
      console.log("Making a direct API call to debug");
      fetch(`/api/countries/${selectedCountryCode}/with-events`)
        .then(res => res.json())
        .then(data => console.log("Direct API call result:", data))
        .catch(err => console.error("Direct API call error:", err));
    }
  }, [selectedCountry, countryError, selectedCountryCode, isLoadingCountry]);

  // Country code mapping from various formats to our dataset codes
  const countryCodeMapping: Record<string, string> = {
    // Map common ISO Alpha-3 codes to our dataset codes
    "USA": "usa", "US": "usa", "United States": "usa", "United States of America": "usa",
    "CAN": "can", "CA": "can", "Canada": "can",
    "GBR": "gbr", "GB": "gbr", "United Kingdom": "gbr", "UK": "gbr",
    "FRA": "fra", "FR": "fra", "France": "fra",
    "DEU": "deu", "DE": "deu", "Germany": "deu",
    "RUS": "rus", "RU": "rus", "Russia": "rus",
    "CHN": "chn", "CN": "chn", "China": "chn",
    "IND": "ind", "IN": "ind", "India": "ind",
    "JPN": "jpn", "JP": "jpn", "Japan": "jpn",
    "BRA": "bra", "BR": "bra", "Brazil": "bra",
    "AUS": "aus", "AU": "aus", "Australia": "aus",
    "ZAF": "zaf", "ZA": "zaf", "South Africa": "zaf",
    "EGY": "egy", "EG": "egy", "Egypt": "egy"
  };

  // Handler for country selection with state persistence
  const handleCountrySelect = (countryCode: string) => {
    console.log("Handling country selection for code:", countryCode);
    
    if (!countryCode) {
      console.warn("Invalid country code received");
      return;
    }
    
    // Check if we need to map this code (try multiple ways to normalize)
    // First check direct mapping
    let mappedCode = countryCodeMapping[countryCode] || null;
    
    if (!mappedCode) {
      // Try uppercase
      const upperCode = countryCode.toUpperCase();
      mappedCode = countryCodeMapping[upperCode] || null;
      
      // If still not found, try lowercase
      if (!mappedCode) {
        const lowerCode = countryCode.toLowerCase();
        mappedCode = countryCodeMapping[lowerCode] || lowerCode;
      }
    }
    
    console.log("Mapped to dataset code:", mappedCode);
    
    // Find if this country exists in our dataset
    const countryExists = countries?.some(c => c.code === mappedCode);
    
    if (countryExists) {
      console.log("Country found in dataset, setting selected country code");
      
      // Implement a fix to persist the country selection
      // This prevents any potential race conditions or rapid state updates
      // that might be causing the panel to close immediately
      
      // Force the country code into localStorage as well for persistence
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('selectedCountryCode', mappedCode);
          console.log("Saved country code to localStorage:", mappedCode);
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
      
      // Use a more robust approach to update state
      // First set it directly with the current function call
      setSelectedCountryCode(mappedCode);
      
      // Then use a timeout to ensure it persists even if something
      // is trying to clear it immediately afterward
      setTimeout(() => {
        console.log("Re-applying country selection in timeout");
        setSelectedCountryCode(prevCode => {
          // If somehow the selection was cleared already, reapply it
          if (prevCode !== mappedCode) {
            console.log("Selection was cleared, restoring from timeout");
            return mappedCode;
          }
          return prevCode;
        });
      }, 50);
    } else {
      console.warn("Country not found in our dataset:", mappedCode);
      // Could show a toast notification here
    }
  };

  // Handler for closing the country info panel
  const handleClosePanel = () => {
    console.log("Close panel handler called - clearing country selection");
    
    // Clear from localStorage too
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('selectedCountryCode');
        console.log("Removed country code from localStorage");
      } catch (e) {
        console.error("Failed to remove from localStorage:", e);
      }
    }
    
    // Clear the selection state
    setSelectedCountryCode(null);
  };

  // Get filtered countries based on search query
  const { data: searchResults, isLoading: isSearching } = useQuery<Country[]>({
    queryKey: ["/api/search"],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      console.log("🔄 Fetch request: /api/search");
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      console.log("✅ Fetch response for /api/search:", response.status);
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      return response.json();
    },
    enabled: searchQuery.length > 1, // Only search when query has at least 2 characters
    refetchOnWindowFocus: false,
    staleTime: 30000 // Cache for 30 seconds
  });

  // Handler for search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If query is empty, reset selected country
    if (!query) {
      // Also clear from localStorage for consistency
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('selectedCountryCode');
        } catch (e) {
          console.error("Failed to remove from localStorage:", e);
        }
      }
      setSelectedCountryCode(null);
    }
  };

  // Use the mobile detection hook
  const isMobile = useIsMobile();
  
  // Determine if map should be visible (always visible on desktop, only when no country is selected on mobile)
  const isMapVisible = !selectedCountryCode || !isMobile;
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Political Atlas</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Map Container - hide on mobile when country is selected */}
        <div className={`flex-1 ${isMapVisible ? 'block' : 'hidden md:block'}`}>
          <MapContainer 
            countries={countries || []} 
            selectedCountryCode={selectedCountryCode}
            onCountrySelect={handleCountrySelect}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isLoading={isLoadingCountries}
          />
        </div>
        
        {/* Only render panel if we have a selected country or we're loading */}
        {(selectedCountryCode || isLoadingCountry) && (
          <CountryInfoPanel 
            country={selectedCountry} 
            isLoading={isLoadingCountry}
            onClose={handleClosePanel}
          />
        )}
      </main>
    </div>
  );
};

export default MapExplorer;
