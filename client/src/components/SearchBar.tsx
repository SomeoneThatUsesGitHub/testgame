import { useState, useEffect, useRef } from "react";
import { X, Search, Globe, MapPin } from "lucide-react";
import { useCountries } from "@/hooks/use-countries";
import { Country } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectCountry?: (countryCode: string) => void;
}

const SearchBar = ({ onSearch, onSelectCountry }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Get countries data for search results
  const { data: countries, isLoading } = useCountries();
  
  // Filter countries based on search query
  const filteredCountries = query.length >= 2 
    ? countries?.filter(country => 
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.code.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];
  
  // Debounce the search to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length >= 2);
  };
  
  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowResults(false);
    inputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    } else if (e.key === "ArrowDown" && filteredCountries && filteredCountries.length > 0) {
      e.preventDefault();
      const firstResult = document.querySelector('[data-search-result="0"]') as HTMLElement;
      if (firstResult) firstResult.focus();
    }
  };
  
  const handleCountryClick = (country: Country) => {
    setQuery(country.name);
    setShowResults(false);
    
    // If onSelectCountry prop is provided, call it with the country code
    if (onSelectCountry) {
      onSelectCountry(country.code);
    }
    
    // Also call the regular onSearch
    onSearch(country.name);
    
    // Trigger the country panel directly using the same custom event as the map
    const customEvent = new CustomEvent('countrySelected', { 
      detail: country.name,
      bubbles: true
    });
    
    console.log("Search selected: dispatching country event for", country.name);
    document.dispatchEvent(customEvent);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (query.length >= 2) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <div className={`relative transition-all duration-200 ${isFocused ? "w-72" : "w-64"}`}>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search for a country..." 
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-200 shadow-sm hover:shadow"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        {query && (
          <button 
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {isFocused && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary transform translate-y-1 rounded-full"></div>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50 border border-gray-200"
        >
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Loading...</div>
          ) : filteredCountries && filteredCountries.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredCountries.map((country, index) => (
                <li 
                  key={country.code}
                  data-search-result={index}
                  tabIndex={0}
                  onClick={() => handleCountryClick(country)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCountryClick(country)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-gray-500">
                      {country.capital} • {country.region}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-3 text-sm text-gray-500">
              No countries found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
