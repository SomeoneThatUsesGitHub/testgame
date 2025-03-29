import { Country } from "@shared/schema";
import { useMemo } from "react";
import { geoCentroid } from "d3-geo";

// Import flag SVGs
import usaFlag from "../assets/flags/usa.svg";
import rusFlag from "../assets/flags/rus.svg";
import chnFlag from "../assets/flags/chn.svg";
import indFlag from "../assets/flags/ind.svg";
import fraFlag from "../assets/flags/fra.svg";

interface CountryFlagsProps {
  countries: Country[];
  geoData: any;
  selectedCountryCode: string | null;
}

// Map of country codes to flag images
const flagMap: Record<string, string> = {
  usa: usaFlag,
  rus: rusFlag,
  chn: chnFlag,
  ind: indFlag,
  fra: fraFlag
};

// Manual coordinates for countries to position flags directly on territories
const countryCoordinates: Record<string, [number, number]> = {
  usa: [-98, 39],    // Central US
  rus: [100, 62],    // Central Russia
  chn: [103, 35],    // Central China
  ind: [78, 22],     // Central India
  fra: [2.5, 46.5]   // Central France
};

// List of major countries we want to display flags for
const majorCountries = ["usa", "rus", "chn", "ind", "fra"];

export const CountryFlags = ({ countries, geoData, selectedCountryCode }: CountryFlagsProps) => {
  // Filter for only countries with flags
  const countriesWithFlags = useMemo(() => {
    return countries.filter(
      country => majorCountries.includes(country.code.toLowerCase())
    );
  }, [countries]);

  // Find geographic boundaries for each country
  const countryFeatures = useMemo(() => {
    if (!geoData?.objects?.countries) return {};
    
    // Maps country codes to their geographic features
    const featureMap: Record<string, any> = {};
    const features = geoData.objects.countries.geometries || [];
    
    features.forEach((feature: any) => {
      const countryCode = (feature.properties?.ISO_A3 || "").toLowerCase();
      if (majorCountries.includes(countryCode)) {
        featureMap[countryCode] = feature;
      }
    });
    
    return featureMap;
  }, [geoData]);
  
  if (!geoData) return null;
  
  return (
    <>
      {/* Render flag images for major countries */}
      {countriesWithFlags.map(country => {
        const countryCode = country.code.toLowerCase();
        const flagSrc = flagMap[countryCode];
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