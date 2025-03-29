import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// The context interface
interface CountrySelectionContextProps {
  selectedCountryCode: string | null;
  setSelectedCountryCode: (code: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Create the context with default values
const CountrySelectionContext = createContext<CountrySelectionContextProps>({
  selectedCountryCode: null,
  setSelectedCountryCode: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

// Provider props interface
interface CountrySelectionProviderProps {
  children: ReactNode;
}

// Provider component
export const CountrySelectionProvider = ({ children }: CountrySelectionProviderProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('selectedCountryCode');
      if (savedCode) {
        console.log('Loaded saved country selection from localStorage:', savedCode);
        setSelectedCountryCode(savedCode);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (selectedCountryCode) {
      try {
        localStorage.setItem('selectedCountryCode', selectedCountryCode);
        console.log('Saved country selection to localStorage:', selectedCountryCode);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    } else if (selectedCountryCode === null) {
      try {
        localStorage.removeItem('selectedCountryCode');
        console.log('Removed country selection from localStorage');
      } catch (e) {
        console.error('Failed to remove from localStorage:', e);
      }
    }
  }, [selectedCountryCode]);

  return (
    <CountrySelectionContext.Provider
      value={{
        selectedCountryCode,
        setSelectedCountryCode,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CountrySelectionContext.Provider>
  );
};

// Hook to use the context
export const useCountrySelection = () => useContext(CountrySelectionContext);