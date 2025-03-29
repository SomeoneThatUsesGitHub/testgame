import { useState, useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Country } from "@shared/schema";
import MapControls from "./MapControls";
import { getPolygonColor, regionColors } from "../lib/map-utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MapContainerProps {
  countries: Country[];
  selectedCountryCode: string | null;
  onCountrySelect: (countryCode: string) => void;
  searchQuery: string;
  isLoading: boolean;
}

// World topojson/geojson map URL
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const MapContainer = ({ 
  countries, 
  selectedCountryCode, 
  onCountrySelect,
  searchQuery,
  isLoading
}: MapContainerProps) => {
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({
    coordinates: [0, 0],
    zoom: 1
  });

  // Create a mapping from country codes to our country data
  const countryCodeMap = countries.reduce((map, country) => {
    map[country.code] = country;
    return map;
  }, {} as Record<string, Country>);

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

  // Filter countries based on search query
  const getOpacityForCountry = (geo: any) => {
    if (!searchQuery) return 1;
    
    const countryName = geo.properties.NAME || "";
    const countryISO = geo.properties.ISO_A3 || geo.properties.ISO_A2 || "";
    
    const matchesSearch = 
      countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      countryISO.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch ? 1 : 0.3;
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-3/5 lg:w-7/10 relative bg-gray-100 overflow-hidden flex items-center justify-center">
        <Skeleton className="w-4/5 h-4/5 rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/5 lg:w-7/10 relative bg-gray-100 overflow-hidden" id="map-container">
      <div className="absolute top-4 left-4 z-10">
        <MapControls 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
          onReset={handleResetView}
        />
      </div>
      
      <ComposableMap projection="geoEqualEarth" style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountryCode && 
                  (geo.properties.ISO_A3?.toLowerCase() === selectedCountryCode.toLowerCase() ||
                   geo.properties.ISO_A2?.toLowerCase() === selectedCountryCode.toLowerCase());

                // Try to find the country in our data
                const countryCode = geo.properties.ISO_A3?.toLowerCase() || geo.properties.ISO_A2?.toLowerCase();
                const country = countryCodeMap[countryCode];
                
                // Determine the fill color based on region or default
                const defaultFill = "#DBEAFE"; // Default light blue
                const regionFill = country?.region ? regionColors[country.region] : defaultFill;
                const fillColor = isSelected ? "#3B82F6" : regionFill;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      const code = geo.properties.ISO_A3?.toLowerCase() || geo.properties.ISO_A2?.toLowerCase();
                      if (code) onCountrySelect(code);
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        opacity: getOpacityForCountry(geo)
                      },
                      hover: {
                        fill: "#3B82F6",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#2563EB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
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
