import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useCountries } from '@/hooks/use-countries';
import { formatPopulation } from '@/lib/map-utils';
import { syncCountriesToBackend } from '@/data/countrySyncer';
import type { CountryData } from '@/data/types';
import { countryDataCollection } from '@/data/countryLoader';

interface CountryListProps {
  onSelectCountry: (code: string) => void;
}

/**
 * Component to display a list of all countries with options to edit
 */
const CountryList: React.FC<CountryListProps> = ({ onSelectCountry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  
  // Get countries from the backend and from files
  const { data: apiCountries, isLoading } = useCountries();
  const fileCountries = countryDataCollection;
  
  // Filter countries based on search query
  const filteredApiCountries = apiCountries?.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.region?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Get country codes from files for comparison
  const fileCountryCodes = fileCountries.map(c => c.code);
  
  // Handle syncing countries from files to backend
  const handleSyncCountries = async () => {
    setSyncing(true);
    try {
      const result = await syncCountriesToBackend();
      if (result) {
        toast({
          title: 'Sync Successful',
          description: 'All country data has been synchronized successfully.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Sync Failed',
          description: 'There was an error synchronizing the country data.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Sync Error',
        description: 'An unexpected error occurred during synchronization.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          variant="outline"
          onClick={handleSyncCountries}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : 'Sync From Files'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton className="h-12 w-full" key={i} />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ISO Code</TableHead>
                  <TableHead>Country Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>In Files</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiCountries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No countries found. Try a different search term or add a new country.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApiCountries.map((country) => {
                    const inFiles = fileCountryCodes.includes(country.code);
                    
                    return (
                      <TableRow key={country.code}>
                        <TableCell className="font-mono">{country.code}</TableCell>
                        <TableCell>{country.name}</TableCell>
                        <TableCell>{country.region || '—'}</TableCell>
                        <TableCell>{formatPopulation(country.population)}</TableCell>
                        <TableCell>
                          {inFiles ? (
                            <span className="text-green-600 font-medium">Yes</span>
                          ) : (
                            <span className="text-amber-600">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onSelectCountry(country.code)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryList;