import { Country } from "@shared/schema";
import { useMemo } from "react";
import { geoCentroid } from "d3-geo";

// Import country data from centralized configuration
import { 
  countryFlagMap, 
  countryCoordinates, 
  flagDisplayList 
} from "../config/countryData";

interface CountryFlagsProps {
  countries: Country[];
  geoData: any;
  selectedCountryCode: string | null;
}

export const CountryFlags = ({ countries, geoData, selectedCountryCode }: CountryFlagsProps) => {
  // Filter for only countries with flags
  const countriesWithFlags = useMemo(() => {
    return countries.filter(
      country => flagDisplayList.includes(country.code.toLowerCase())
    );
  }, [countries, flagDisplayList]);

  // Find geographic boundaries for each country
  const countryFeatures = useMemo(() => {
    if (!geoData?.objects?.countries) return {};
    
    // Maps country codes to their geographic features
    const featureMap: Record<string, any> = {};
    const features = geoData.objects.countries.geometries || [];
    
    features.forEach((feature: any) => {
      const countryCode = (feature.properties?.ISO_A3 || "").toLowerCase();
      if (flagDisplayList.includes(countryCode)) {
        featureMap[countryCode] = feature;
      }
    });
    
    return featureMap;
  }, [geoData, flagDisplayList]);
  
  if (!geoData) return null;
  
  return (
    <>
      {/* Render flag images for countries in the display list */}
      {countriesWithFlags.map(country => {
        const countryCode = country.code.toLowerCase();
        const flagSrc = countryFlagMap[countryCode];
        const coordinates = countryCoordinates[countryCode];
        const isSelected = selectedCountryCode === countryCode;
        
        if (!flagSrc || !coordinates) return null;
        
        return (
          <g 
            key={country.code}
            onClick={() => {
              // Create a custom event with the country name
              const customEvent = new CustomEvent('countrySelected', { 
                detail: country.name,
                bubbles: true
              });
              
              console.log("Flag clicked: dispatching country event for", country.name);
              document.dispatchEvent(customEvent);
            }}
          >
            <image
              href={flagSrc}
              x={coordinates[0] - 12}
              y={coordinates[1] - 8}
              height={16}
              width={24}
              style={{
                filter: `drop-shadow(1px 2px 2px rgba(0,0,0,0.3))`,
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-in-out',
                cursor: "pointer",
                borderRadius: "2px"
              }}
            />
          </g>
        );
      })}
    </>
  );
};

export default CountryFlags;