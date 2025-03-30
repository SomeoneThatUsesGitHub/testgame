import React, { useState, useEffect } from 'react';
import { CountryWithEvents } from "@shared/schema";
import { formatPopulation } from "../lib/map-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import MapAdminPanel from './admin/MapAdminPanel';

// Import flags (we'll use free flag CDN)
const getFlagUrl = (countryCode: string) => {
  // Convert our country codes to 2-letter ISO codes for the flag API
  const twoLetterCode = convertToTwoLetterCode(countryCode.toLowerCase());
  return `https://flagcdn.com/w640/${twoLetterCode}.png`;
};

// Convert our 3-letter country codes to 2-letter codes for the flag API
const convertToTwoLetterCode = (code: string): string => {
  const codeMap: Record<string, string> = {
    'usa': 'us',
    'gbr': 'gb',
    'fra': 'fr',
    'deu': 'de',
    'jpn': 'jp',
    'chn': 'cn',
    'rus': 'ru',
    'ind': 'in',
    'bra': 'br',
    'aus': 'au',
    'can': 'ca',
    'zaf': 'za',
    'egy': 'eg'
  };
  
  return codeMap[code] || code;
};

/**
 * Admin version of the country panel for direct editing
 */
export default function AdminFixedCountryPanel() {
  const [country, setCountry] = useState<CountryWithEvents | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Assume admin mode is always on for now
  const [isEditMode, setIsEditMode] = useState(false);

  // EVENT HANDLER FOR COUNTRY SELECTION
  // Effect to toggle body class when panel is open/closed
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('country-panel-open');
    } else {
      document.body.classList.remove('country-panel-open');
    }
    
    return () => {
      document.body.classList.remove('country-panel-open');
    };
  }, [isOpen]);
  
  useEffect(() => {
    function handleCountrySelected(e: Event) {
      const event = e as CustomEvent;
      const countryName = event.detail;
      
      // Exit if no countryName
      if (!countryName) return;
      
      console.log("ADMIN PANEL: Country selected:", countryName);
      
      // HARDCODED MAPPING - only the countries we know exist in our database
      let code;
      if (countryName.includes("United States") || countryName === "USA" || countryName === "US") {
        code = "usa";
      } else if (countryName.includes("United Kingdom") || countryName === "UK") {
        code = "gbr";
      } else if (countryName === "Russia") {
        code = "rus";
      } else if (countryName === "China") {
        code = "chn";
      } else if (countryName === "France") {
        code = "fra";
      } else if (countryName === "Germany") {
        code = "deu";
      } else if (countryName === "Japan") {
        code = "jpn";
      } else if (countryName === "India") {
        code = "ind";
      } else if (countryName === "Brazil") {
        code = "bra";
      } else if (countryName === "Australia") {
        code = "aus";
      } else if (countryName === "Canada") {
        code = "can";
      } else if (countryName === "South Africa") {
        code = "zaf";
      } else if (countryName === "Egypt") {
        code = "egy";
      } else if (countryName === "Mexico") {
        code = "mex";
      } else if (countryName === "Spain") {
        code = "esp";
      } else if (countryName === "Italy") {
        code = "ita";
      } else if (countryName === "Argentina") {
        code = "arg";
      } else if (countryName === "Colombia") {
        code = "col";
      } else if (countryName === "Chile") {
        code = "chl";
      } else if (countryName === "Peru") {
        code = "per";
      } else if (countryName === "Venezuela") {
        code = "ven";
      } else if (countryName === "Bolivia") {
        code = "bol";
      } else {
        // Convert to lowercase and limit to 3 characters for code
        code = countryName.toLowerCase().substring(0, 3);
        console.log("Using generated country code:", code, "for", countryName);
      }
      
      // Open panel and set country code (for both existing and new countries)
      setIsOpen(true);
      setCountryCode(code);
      
      // Only fetch existing country data
      setIsLoading(true);
      
      // Fetch country data with leader info
      fetch(`/api/countries/${code}/with-events`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              // Country doesn't exist yet - that's fine for admin mode
              console.log("ADMIN PANEL: Country doesn't exist yet:", code);
              setCountry(null);
              setIsLoading(false);
              return null;
            }
            throw new Error("Failed to fetch country data");
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            console.log("ADMIN PANEL: Data loaded successfully:", data.name);
            setCountry(data);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("ADMIN PANEL: Error loading country data:", err);
          setError("Failed to load country information");
          setIsLoading(false);
        });
    }
    
    // Add event listener
    document.addEventListener('countrySelected', handleCountrySelected);
    
    return () => {
      document.removeEventListener('countrySelected', handleCountrySelected);
    };
  }, []);
  
  // Close handler
  function handleClose() {
    console.log("ADMIN PANEL: Closing panel");
    setIsOpen(false);
    setCountry(null);
    setCountryCode(null);
    setIsEditMode(false);
  }
  
  // Enter edit mode
  function handleEdit() {
    setIsEditMode(true);
  }
  
  // Hide when not open
  if (!isOpen) {
    return null;
  }
  
  // If in edit mode, show the admin editor panel
  if (isEditMode) {
    return (
      <MapAdminPanel 
        countryCode={countryCode}
        onClose={() => {
          setIsEditMode(false);
          // You may want to refetch the country data here after saving
        }}
      />
    );
  }

  // Show preview with edit option
  return (
    <div className="h-full w-full md:w-full lg:w-full bg-white border-l border-gray-200 flex flex-col overflow-hidden fixed md:fixed right-0 top-[64px] md:top-[64px] bottom-0 z-40 shadow-xl country-fullscreen-bg">
      <div className="flex flex-col h-full">
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

        {/* Country doesn't exist yet - show create option */}
        {!country && !isLoading && !error && (
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/90 to-blue-600/90 py-5 md:py-6 px-6 md:px-8 shadow-md">
              <div className="md:max-w-7xl md:mx-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Create New Country</h2>
                  <p className="text-white/80">This country doesn't exist in the database yet</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-1.5 px-3 rounded-md text-sm font-medium hover:bg-white/30 transition-colors"
                    onClick={handleClose}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden md:inline">Return to Map</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Create prompt */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">Create New Country Data</h2>
                <p className="text-gray-600 mb-6">
                  This country doesn't have detailed information yet. Would you like to create it?
                </p>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleEdit}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Country Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Country exists - show preview with edit button */}
        {country && !isLoading && !error && (
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/90 to-blue-600/90 py-5 md:py-6 px-6 md:px-8 shadow-md">
              <div className="md:max-w-7xl md:mx-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Region badge */}
                    <div className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 rounded-full text-sm font-medium">
                      {country.region}
                    </div>
                    
                    {/* Small flag indicator */}
                    <img 
                      src={getFlagUrl(country.code)} 
                      alt={`${country.name} flag`} 
                      className="h-5 w-7 object-cover rounded shadow-sm" 
                    />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{country.name}</h2>
                  
                  <div className="flex flex-wrap gap-4 items-center text-white mt-2">
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm md:text-base">{country.capital}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/90">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm md:text-base">{formatPopulation(country.population)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Edit button */}
                  <Button 
                    variant="default" 
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Country
                  </Button>
                  
                  {/* Return to map button */}
                  <button
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-1.5 px-3 rounded-md text-sm font-medium hover:bg-white/30 transition-colors"
                    onClick={handleClose}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden md:inline">Return to Map</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Preview content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Country Preview</h3>
                
                {/* Country details */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ISO Code</p>
                      <p>{country.code}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{country.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Capital</p>
                      <p>{country.capital}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Region</p>
                      <p>{country.region || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Population</p>
                      <p>{formatPopulation(country.population)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Political events */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold">Political Timeline</h4>
                    <span className="text-sm text-muted-foreground">
                      {country.events?.length || 0} events
                    </span>
                  </div>
                  
                  {(!country.events || country.events.length === 0) ? (
                    <p className="text-muted-foreground">No timeline events are available.</p>
                  ) : (
                    <div className="space-y-4">
                      {country.events.slice(0, 2).map((event, index) => (
                        <div key={index} className="border-l-4 pl-4 pb-2" style={{ borderColor: event.partyColor || '#666' }}>
                          <h5 className="font-medium">{event.title}</h5>
                          <p className="text-sm text-muted-foreground">{event.period}</p>
                          <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                        </div>
                      ))}
                      {country.events.length > 2 && (
                        <p className="text-sm text-primary">
                          +{country.events.length - 2} more events...
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Leadership */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Leadership</h4>
                  
                  {!country.leader ? (
                    <p className="text-muted-foreground">No leadership information is available.</p>
                  ) : (
                    <div>
                      <h5 className="font-medium">{country.leader.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {country.leader.title} - {country.leader.party}
                      </p>
                      <p className="text-sm mt-1">In power since: {country.leader.inPowerSince}</p>
                    </div>
                  )}
                </div>
                
                {/* Edit button */}
                <div className="flex justify-center mb-8">
                  <Button 
                    size="lg" 
                    onClick={handleEdit}
                    className="px-8"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Full Country Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}