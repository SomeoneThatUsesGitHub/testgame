import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce the search to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };
  
  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={`relative w-64 transition-all duration-200 ${isFocused ? "w-72" : "w-64"}`}>
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Search for a country..." 
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                 transition-all duration-200 shadow-sm hover:shadow"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
  );
};

export default SearchBar;
