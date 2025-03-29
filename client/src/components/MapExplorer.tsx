import { useState, useEffect } from "react";
import MapContainer from "./MapContainer";
import CountryInfoPanel from "./CountryInfoPanel";
import SearchBar from "./SearchBar";
import { Country, CountryWithEvents } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MapExplorer = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const isMobile = useIsMobile();

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

  // Fetch selected country details with events when a country is selected
  const { data: selectedCountry, isLoading: isLoadingCountry, error: countryError } = useQuery<CountryWithEvents>({
    queryKey: [`/api/countries/${selectedCountryCode}/with-events`],
    enabled: !!selectedCountryCode,
    retry: 2,
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: false
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

  // Handler for country selection
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
      setSelectedCountryCode(mappedCode);
    } else {
      console.warn("Country not found in our dataset:", mappedCode);
      // Could show a toast notification here
    }
  };

  // Handler for closing the country info panel
  const handleClosePanel = () => {
    if (isMobile) {
      setShowInfoPanel(false);
    } else {
      setSelectedCountryCode(null);
    }
  };
  
  // Effect to show info panel when a country is selected on mobile
  useEffect(() => {
    if (isMobile && selectedCountry) {
      setShowInfoPanel(true);
    }
  }, [isMobile, selectedCountry]);
  
  // Handler for returning to map on mobile
  const handleReturnToMap = () => {
    setShowInfoPanel(false);
  };

  // Get filtered countries based on search query
  const { data: searchResults } = useQuery<Country[]>({
    queryKey: ["/api/search", searchQuery],
    enabled: searchQuery.length > 1, // Only search when query has at least 2 characters
    refetchOnWindowFocus: false,
  });

  // Handler for search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Political Atlas</h1>
          <div className="hidden md:block">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Mobile Search Bar - Takes full width on small screens */}
      <div className="md:hidden px-4 py-2 bg-gray-50">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Mobile Back Button - Only visible when info panel is shown */}
        {isMobile && showInfoPanel && selectedCountry && (
          <div className="bg-white p-2 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleReturnToMap}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Map</span>
            </Button>
          </div>
        )}

        {/* Map Container - Hidden on mobile when country info is shown */}
        <div className={`${isMobile && showInfoPanel ? 'hidden' : 'flex-1'}`}>
          <MapContainer 
            countries={countries || []} 
            selectedCountryCode={selectedCountryCode}
            onCountrySelect={handleCountrySelect}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isLoading={isLoadingCountries}
          />
        </div>
        
        {/* Country Info Panel - Fixed width on desktop, full width on mobile when shown */}
        <div className={`${isMobile ? (showInfoPanel ? 'block w-full' : 'hidden') : 'w-2/5 lg:w-1/3'}`}>
          <CountryInfoPanel 
            country={selectedCountry} 
            isLoading={isLoadingCountry}
            onClose={handleClosePanel}
          />
        </div>
      </main>
    </div>
  );
};

export default MapExplorer;
