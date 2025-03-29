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
      
      {/* Ocean background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-200 opacity-40"></div>
      
      <ComposableMap 
        projection="geoEqualEarth" 
        style={{ 
          width: "100%", 
          height: "100%", 
          backgroundColor: "transparent"
        }}>
        <defs>
          {/* Define patterns and gradients for map styling */}
          <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4299E1" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#3182CE" stopOpacity={0.4} />
          </linearGradient>
          
          {/* Define drop shadow filter for countries */}
          <filter id="dropShadow" filterUnits="userSpaceOnUse" x="-10" y="-10" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
          
          {/* Define a highlight glow for selected countries */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
        >
          {/* Ocean background */}
          <rect x="-8000" y="-8000" width="16000" height="16000" fill="url(#oceanGradient)" />
          
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
                
                // For selected countries, use a brighter version of their color
                const fillColor = isSelected ? (country?.region ? regionColors[country.region] : "#3B82F6") : regionFill;
                
                // Apply a slightly random variation to make similar countries distinguishable
                // Use hash of country code to create consistent variation
                const hash = countryCode?.split('')?.reduce((a, b) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0) || 0;
                
                // Use the hash to create slight color variations for neighboring countries
                const colorVariation = hash % 20 - 10; // -10 to +10 variation
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      // The topoJSON we're using has different property names
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
                        // Try to extract from the FIPS code or name
                        code = geo.properties.name || geo.properties.NAME;
                      }
                      
                      if (code) {
                        // Pass the code to the parent component which will handle mapping
                        onCountrySelect(code);
                      } else {
                        console.warn("No country code found for:", geo.properties.NAME || "Unknown");
                      }
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "#FFFFFF",
                        strokeWidth: 0.9, // Thicker borders
                        outline: "none",
                        opacity: getOpacityForCountry(geo),
                        filter: isSelected ? "url(#glow)" : "url(#dropShadow)",
                        transition: "all 0.3s ease"
                      },
                      hover: {
                        fill: isSelected ? "#2563EB" : "#3B82F6",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5, // Thicker border on hover
                        outline: "none",
                        cursor: "pointer",
                        opacity: 1, // Full opacity on hover
                        filter: "url(#glow)",
                        transform: "translateY(-2px)", // Slight lift effect
                        transition: "all 0.3s ease"
                      },
                      pressed: {
                        fill: "#1D4ED8",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5,
                        outline: "none",
                        filter: "url(#dropShadow)",
                        transform: "translateY(0)"
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
