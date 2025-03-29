import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Country } from "@shared/schema";
import MapControls from "./MapControls";
import { regionColors } from "../lib/map-utils";
import { Skeleton } from "@/components/ui/skeleton";
// Import the local topojson file
import worldMapData from "../assets/world-topo.json";

interface MapContainerProps {
  countries: Country[];
  selectedCountryCode: string | null;
  onCountrySelect: (countryCode: string) => void;
  searchQuery: string;
  searchResults?: Country[] | null;
  isLoading: boolean;
}

const MapContainer = ({ 
  countries, 
  selectedCountryCode, 
  onCountrySelect,
  searchQuery,
  searchResults,
  isLoading
}: MapContainerProps) => {
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({
    coordinates: [0, 0],
    zoom: 1
  });
  // Use the imported map data directly
  const [geoData] = useState<any>(worldMapData);
  const [isGeoLoading, setIsGeoLoading] = useState(false);

  // Log that we're using local map data
  useEffect(() => {
    console.log("Using local map data for world visualization");
    console.log("Map data format:", geoData.type);
    console.log("Map data objects:", Object.keys(geoData.objects));
  }, [geoData]);

  // Create a mapping from country codes to our country data
  const countryCodeMap = countries.reduce((map, country) => {
    map[country.code] = country;
    return map;
  }, {} as Record<string, Country>);

  // Log countries data for debugging
  useEffect(() => {
    if (countries && countries.length > 0) {
      console.log(`Loaded ${countries.length} countries for the map`);
      console.log("Sample country data:", countries[0]);
    }
  }, [countries]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleResetView = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  // Filter countries based on search results
  const getOpacityForCountry = (geo: any) => {
    // If no search query, show all countries at full opacity
    if (!searchQuery || searchQuery.length < 2) return 1;
    
    // If we have search results from the API, use those
    if (searchResults && searchResults.length > 0) {
      // Create a list of country codes from the search results
      const searchResultCodes = searchResults.map(country => country.code.toLowerCase());
      
      // Try to get country code from geo properties
      const countryCode = geo.properties.ISO_A3?.toLowerCase() || 
                          geo.properties.iso_a3?.toLowerCase() || 
                          geo.properties.ISO_A2?.toLowerCase() || 
                          geo.properties.iso_a2?.toLowerCase();
      
      // Check if this country is in the search results
      if (countryCode) {
        // Return full opacity if the country is in the search results
        return searchResultCodes.includes(countryCode) ? 1 : 0.3;
      }
    }
    
    // Fallback to client-side filtering if we don't have search results
    const countryName = geo.properties.NAME || "";
    const countryISO = geo.properties.ISO_A3 || geo.properties.ISO_A2 || "";
    
    const matchesSearch = 
      countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      countryISO.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch ? 1 : 0.3;
  };

  if (isLoading || isGeoLoading) {
    return (
      <div className="w-full md:w-3/5 lg:w-7/10 relative bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-4/5 h-4/5 mx-auto rounded-md" />
          <p className="mt-4 text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/5 lg:w-7/10 relative bg-gradient-to-br from-blue-300 to-blue-50 overflow-hidden" id="map-container">
      <div className="absolute top-4 left-4 z-10">
        <MapControls 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
          onReset={handleResetView}
        />
      </div>
      
      <ComposableMap 
        projection="geoEqualEarth" 
        style={{ 
          width: "100%", 
          height: "100%", 
          backgroundColor: "transparent"
        }}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
        >
          {/* Ocean background */}
          <rect x="-8000" y="-8000" width="16000" height="16000" fill="#BFD9EF" />
          
          <Geographies geography={geoData}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const isSelected = selectedCountryCode && 
                  (geo.properties.ISO_A3?.toLowerCase() === selectedCountryCode.toLowerCase() ||
                   geo.properties.ISO_A2?.toLowerCase() === selectedCountryCode.toLowerCase());

                // Try to find the country in our data
                const countryCode = geo.properties.ISO_A3?.toLowerCase() || geo.properties.ISO_A2?.toLowerCase();
                const country = countryCodeMap[countryCode];
                
                // Determine the fill color based on region or default
                const defaultFill = "#D1D5DB"; // Default gray
                const regionFill = country?.region ? regionColors[country.region] : defaultFill;
                
                // For selected countries, use a brighter color
                const fillColor = isSelected ? "#3B82F6" : regionFill;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      // Extract from the properties object based on what's available
                      let code = null;
                      
                      // Try to find a country code in the properties
                      if (geo.properties.ISO_A3) {
                        code = geo.properties.ISO_A3;
                      } else if (geo.properties.iso_a3) {
                        code = geo.properties.iso_a3;
                      } else if (geo.properties.ISO_A2) {
                        code = geo.properties.ISO_A2;
                      } else if (geo.properties.iso_a2) {
                        code = geo.properties.iso_a2;
                      } else if (geo.properties.ADM0_A3) {
                        code = geo.properties.ADM0_A3;
                      } else {
                        code = geo.properties.name || geo.properties.NAME;
                      }
                      
                      if (code) {
                        // Call the callback for backward compatibility
                        onCountrySelect(code);
                        
                        // Fire a custom event that our fixed panel will listen for
                      
                      // Always use a proper country name that our hardcoded mapping can handle
                      let countryName = geo.properties.NAME || geo.properties.name || "Unknown";
                      
                      // Special case for United States to make the name consistent
                      if (countryName === "United States of America") {
                        countryName = "United States";
                      }
                      
                      // Create the event with the country name
                      const customEvent = new CustomEvent('countrySelected', { 
                        detail: countryName,
                        bubbles: true
                      });
                      
                      console.log("Dispatching countrySelected event:", countryName);
                      document.dispatchEvent(customEvent);
                      } else {
                        console.warn("No country code found for:", geo.properties.NAME || "Unknown");
                      }
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "#FFFFFF",
                        strokeWidth: 0.9,
                        outline: "none",
                        opacity: getOpacityForCountry(geo)
                      },
                      hover: {
                        fill: "#3B82F6",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        opacity: 1
                      },
                      pressed: {
                        fill: "#2563EB",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5,
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapContainer;