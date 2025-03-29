import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { formatPopulation } from '@/lib/map-utils';
import LeadershipSection from './LeadershipSection';
import Timeline from './Timeline';
import StatisticsCharts from './StatisticsCharts';
import DemographicsCharts from './DemographicsCharts';
import { useCountryWithEvents } from '@/hooks/use-country-details';
import { MapPinIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface SimpleCountryPanelProps {
  countryCode: string | null;
  onClose: () => void;
}

const SimpleCountryPanel: React.FC<SimpleCountryPanelProps> = ({ countryCode, onClose }) => {
  const { data: country, isLoading } = useCountryWithEvents(countryCode);

  // Close if country code is null
  useEffect(() => {
    if (!countryCode) {
      onClose();
    }
  }, [countryCode, onClose]);

  if (!country) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-primary text-white">
          <h2 className="text-xl font-bold">Loading...</h2>
          <Button 
            variant="outline" 
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
            onClick={onClose}>Close</Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{country.name}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 border-white/30 text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-white/70" />
            <span>{country.capital}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-white/70" />
            <span>{formatPopulation(country.population)}</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-white/70" />
            <span>{country.region}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* LEADERSHIP SECTION */}
        <div className="p-6 bg-white border-b border-gray-100">
          <LeadershipSection 
            countryCode={countryCode} 
            leader={country.leader} 
            isLoading={isLoading} 
          />
        </div>

        {/* POLITICAL HISTORY SECTION */}
        <div className="p-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-4">Political Timeline</h2>
          <p className="text-gray-600 mb-6">Major political events and changes over the last 30 years.</p>
          <Timeline events={country.events || []} />
        </div>

        {/* STATISTICS SECTION */}
        <div className="p-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-4">Statistics</h2>
          <p className="text-gray-600 mb-6">Economic and social statistics about {country.name}.</p>
          <StatisticsCharts country={country} />
        </div>

        {/* DEMOGRAPHICS SECTION */}
        <div className="p-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-4">Demographics</h2>
          <p className="text-gray-600 mb-6">Population demographics and distribution in {country.name}.</p>
          <DemographicsCharts country={country} />
        </div>
      </div>
    </div>
  );
};

export default SimpleCountryPanel;