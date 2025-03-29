import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Provider component with NO localStorage (simplified to prevent the bug)
export const CountrySelectionProvider = ({ children }: CountrySelectionProviderProps) => {
  // Simple state management with no localStorage interactions
  const [selectedCountryCode, setInternalCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom setter that logs changes but doesn't use localStorage
  const setSelectedCountryCode = (code: string | null) => {
    console.log('Setting country code to:', code);
    setInternalCountryCode(code);
  };

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