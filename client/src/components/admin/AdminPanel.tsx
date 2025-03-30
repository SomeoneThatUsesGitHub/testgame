import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import CountryEditor from './CountryEditor';
import CountryList from './CountryList';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin Panel component for managing country data
 * Allows users to add new countries and edit existing ones
 */
const AdminPanel = () => {
  const [location, setLocation] = useLocation();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Determine if we're in create mode or edit mode
  const isCreateMode = selectedCountryCode === 'new';

  // Handle country selection
  const handleSelectCountry = (code: string) => {
    setSelectedCountryCode(code);
  };

  // Handle creating a new country
  const handleCreateNew = () => {
    setSelectedCountryCode('new');
  };

  // Handle going back to list
  const handleBackToList = () => {
    setSelectedCountryCode(null);
  };

  // Handle successful save
  const handleSaveSuccess = (code: string, isNew: boolean) => {
    toast({
      title: isNew ? 'Country Created' : 'Country Updated',
      description: `Country ${isNew ? 'created' : 'updated'} successfully!`,
      variant: 'default',
    });
    
    // If it was a new country, switch to edit mode
    if (isNew) {
      setSelectedCountryCode(code);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Country Data Admin</h1>
          <p className="text-muted-foreground">Manage country data for the Political World Map</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation('/')}>
            Back to Map
          </Button>
          {!isCreateMode && !selectedCountryCode && (
            <Button onClick={handleCreateNew}>
              Add New Country
            </Button>
          )}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {selectedCountryCode ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" onClick={handleBackToList}>
              ← Back to List
            </Button>
            <h2 className="text-xl font-semibold">
              {isCreateMode ? 'Create New Country' : 'Edit Country'}
            </h2>
          </div>
          <CountryEditor 
            countryCode={selectedCountryCode} 
            onSaveSuccess={handleSaveSuccess}
          />
        </div>
      ) : (
        <CountryList onSelectCountry={handleSelectCountry} />
      )}
    </div>
  );
};

export default AdminPanel;