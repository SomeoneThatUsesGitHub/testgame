import { useState } from "react";
import MapContainer from "./MapContainer";
import CountryInfoPanel from "./CountryInfoPanel";
import SearchBar from "./SearchBar";
import { Country, CountryWithEvents } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

const MapExplorer = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all countries for the map
  const { data: countries, isLoading: isLoadingCountries } = useQuery<Country[]>({
    queryKey: ["/api/countries"]
  });

  // Fetch selected country details with events when a country is selected
  const { data: selectedCountry, isLoading: isLoadingCountry } = useQuery<CountryWithEvents>({
    queryKey: ["/api/countries", selectedCountryCode, "with-events"],
    enabled: !!selectedCountryCode
  });

  // Handler for country selection
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
  };

  // Handler for closing the country info panel
  const handleClosePanel = () => {
    setSelectedCountryCode(null);
  };

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
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <MapContainer 
          countries={countries || []} 
          selectedCountryCode={selectedCountryCode}
          onCountrySelect={handleCountrySelect}
          searchQuery={searchQuery}
          isLoading={isLoadingCountries}
        />
        
        <CountryInfoPanel 
          country={selectedCountry} 
          isLoading={isLoadingCountry}
          onClose={handleClosePanel}
        />
      </main>
    </div>
  );
};

export default MapExplorer;
