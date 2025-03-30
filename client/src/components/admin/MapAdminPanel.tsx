import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCountry } from '@/hooks/use-countries';
import { useCountryWithEvents } from '@/hooks/use-country-details';
import { syncCountriesToBackend } from '@/data/countrySyncer';
import { getCountryByCode } from '@/data/countryLoader';
import type { CountryData } from '@/data/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, X, Eye, EyeOff, Edit, Plus } from 'lucide-react';
import ChartEditor from './editors/ChartEditor';
import EventsEditor from './editors/EventsEditor';
import LeaderEditor from './editors/LeaderEditor';
import PreviewPanel from './PreviewPanel';

interface MapAdminPanelProps {
  countryCode: string | null;
  onClose: () => void;
}

/**
 * Admin panel that appears when a user clicks a country on the map
 * Allows creating new country data or editing existing data
 */
const MapAdminPanel: React.FC<MapAdminPanelProps> = ({ countryCode, onClose }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Get country data from API and files
  const { data: apiCountry, isLoading: isLoadingApi } = useCountry(countryCode);
  const { data: countryWithEvents, isLoading: isLoadingEvents } = useCountryWithEvents(countryCode);
  
  const existingFileData = countryCode ? getCountryByCode(countryCode) : null;
  const doesCountryExistInBackend = !!apiCountry;
  const doesCountryExistInFiles = !!existingFileData;
  
  // Empty country template
  const emptyCountry: CountryData = {
    code: countryCode || '',
    name: apiCountry?.name || '',
    capital: apiCountry?.capital || '',
    population: apiCountry?.population || 0,
    region: apiCountry?.region || '',
    flagCoordinates: [0, 0],
    leader: {
      name: '',
      title: '',
      party: '',
      inPowerSince: '',
      description: '',
    },
    demographics: {
      ageGroups: [
        { name: '0-14', value: 20 },
        { name: '15-24', value: 15 },
        { name: '25-54', value: 40 },
        { name: '55-64', value: 10 },
        { name: '65+', value: 15 },
      ],
      religions: [
        { name: 'Religion 1', value: 60 },
        { name: 'Religion 2', value: 25 },
        { name: 'Other', value: 15 },
      ],
      urbanRural: [
        { name: 'Urban', value: 70 },
        { name: 'Rural', value: 30 },
      ],
      educationLevels: [
        { name: 'Primary', value: 25 },
        { name: 'Secondary', value: 50 },
        { name: 'Tertiary', value: 20 },
        { name: 'None', value: 5 },
      ],
    },
    statistics: {
      gdpSectors: [
        { name: 'Agriculture', value: 10 },
        { name: 'Industry', value: 30 },
        { name: 'Services', value: 60 },
      ],
      employment: [
        { name: 'Agriculture', value: 5 },
        { name: 'Industry', value: 25 },
        { name: 'Services', value: 70 },
      ],
      trade: [
        { name: 'Partner 1', value: 40 },
        { name: 'Partner 2', value: 30 },
        { name: 'Others', value: 30 },
      ],
      spending: [
        { name: 'Defense', value: 20 },
        { name: 'Education', value: 15 },
        { name: 'Healthcare', value: 25 },
        { name: 'Other', value: 40 },
      ],
    },
    events: [],
  };
  
  // Initialize country data state
  const [countryData, setCountryData] = useState<CountryData>(
    existingFileData || emptyCountry
  );
  
  // Validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Update country data when API data loads
  useEffect(() => {
    if (existingFileData) {
      setCountryData(existingFileData);
    } else if (apiCountry && !doesCountryExistInFiles) {
      // Pre-fill from API data if available
      setCountryData(prev => ({
        ...emptyCountry,
        code: countryCode || '',
        name: apiCountry.name,
        capital: apiCountry.capital,
        population: apiCountry.population,
        region: apiCountry.region || '',
      }));
    }
  }, [existingFileData, apiCountry, countryCode, doesCountryExistInFiles]);
  
  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCountryData(prev => ({
      ...prev,
      [name]: name === 'population' ? parseInt(value, 10) || 0 : value,
    }));
    
    // Clear validation error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle coordinates change
  const handleCoordinatesChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCoords = [...countryData.flagCoordinates];
    newCoords[index] = numValue;
    
    setCountryData(prev => ({
      ...prev,
      flagCoordinates: newCoords as [number, number],
    }));
  };
  
  // Update demographic data
  const handleDemographicsChange = (
    category: keyof CountryData['demographics'], 
    data: any[]
  ) => {
    setCountryData(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [category]: data,
      },
    }));
  };
  
  // Update statistics data
  const handleStatisticsChange = (
    category: keyof CountryData['statistics'],
    data: any[]
  ) => {
    setCountryData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [category]: data,
      },
    }));
  };
  
  // Update leader data
  const handleLeaderChange = (field: string, value: string) => {
    setCountryData(prev => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
      },
    }));
  };
  
  // Update events data
  const handleEventsChange = (events: any[]) => {
    setCountryData(prev => ({
      ...prev,
      events,
    }));
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Required basic fields
    if (!countryData.code) newErrors.code = 'ISO code is required';
    if (countryData.code && !/^[a-z]{3}$/.test(countryData.code)) 
      newErrors.code = 'ISO code must be exactly 3 lowercase letters';
    if (!countryData.name) newErrors.name = 'Country name is required';
    if (!countryData.capital) newErrors.capital = 'Capital is required';
    if (!countryData.region) newErrors.region = 'Region is required';
    if (!countryData.population) newErrors.population = 'Population is required';
    
    // Only validate leader fields if they're partially filled
    const hasPartialLeaderData = countryData.leader.name || countryData.leader.title || 
                               countryData.leader.party || countryData.leader.inPowerSince || 
                               countryData.leader.description;
    
    if (hasPartialLeaderData) {
      // If ANY leader field is filled, then all are required
      if (!countryData.leader.name) newErrors['leader.name'] = 'Leader name is required';
      if (!countryData.leader.title) newErrors['leader.title'] = 'Leader title is required';
      if (!countryData.leader.party) newErrors['leader.party'] = 'Leader party is required';
      if (!countryData.leader.inPowerSince) newErrors['leader.inPowerSince'] = 'Leader in power since is required';
      if (!countryData.leader.description) newErrors['leader.description'] = 'Leader description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle saving the country data to a file
  const saveCountryData = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the highlighted errors before saving.',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    try {
      // Create formatted JSON with line breaks
      const formattedJson = JSON.stringify(countryData, null, 2)
        .replace(/"/g, "'")
        .replace(/'([^']+)':/g, '$1:');
      
      // Create the file content with proper formatting
      const fileContent = `/**
 * ${countryData.name} Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = ${formattedJson};

export default countryData;`;

      console.log('Saving country data:', countryData.code);
      
      // Create or update the country file in the data/countries directory
      const filePath = `client/src/data/countries/${countryData.code.toLowerCase()}.ts`;
      
      // Make a POST request to save the file content
      const response = await fetch('/api/country-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: filePath,
          content: fileContent
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save country file');
      }
      
      // After saving the file, sync with the backend
      const syncResult = await syncCountriesToBackend();
      
      if (syncResult) {
        toast({
          title: 'Country Published',
          description: `${countryData.name} has been saved and published successfully.`,
          variant: 'default',
        });
        
        // Exit edit mode after successful save
        setIsEditMode(false);
      } else {
        toast({
          title: 'Sync Failed',
          description: 'The country was saved but could not be published to the backend.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: 'Save Error',
        description: 'There was an error saving the country data.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Loading state
  if ((isLoadingApi || isLoadingEvents) && !isEditMode) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-background shadow-lg z-50 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Country Information</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading country data...</span>
        </div>
      </div>
    );
  }
  
  // Determine if this is a new country or existing one
  const isNewCountry = !doesCountryExistInFiles;

  // View mode - show country details with option to edit
  if (!isEditMode) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-background shadow-lg z-50 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {apiCountry?.name || 'Country Information'}
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-1"
            >
              {doesCountryExistInFiles ? (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create</span>
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4">
            {!doesCountryExistInFiles ? (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Country Not Configured</CardTitle>
                  <CardDescription>
                    This country exists in the system but doesn't have detailed information configured yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ISO Code</p>
                        <p>{apiCountry?.code}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{apiCountry?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Capital</p>
                        <p>{apiCountry?.capital}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Region</p>
                        <p>{apiCountry?.region || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setIsEditMode(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Country Details
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <PreviewPanel countryData={countryData} />
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  // Edit mode - show editable form with preview option
  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-3/4 bg-background shadow-lg z-50 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">
          {isNewCountry ? 'Create Country Details' : 'Edit Country Details'}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant={showPreview ? 'default' : 'outline'} 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
          <Button
            onClick={saveCountryData}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsEditMode(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="h-[calc(100vh-64px)] overflow-hidden">
        {showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <ScrollArea className="border-r">
              <div className="p-4">
                <EditorContent 
                  countryData={countryData}
                  errors={errors}
                  handleBasicInfoChange={handleBasicInfoChange}
                  handleCoordinatesChange={handleCoordinatesChange}
                  handleDemographicsChange={handleDemographicsChange}
                  handleStatisticsChange={handleStatisticsChange}
                  handleLeaderChange={handleLeaderChange}
                  handleEventsChange={handleEventsChange}
                />
              </div>
            </ScrollArea>
            <ScrollArea>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <PreviewPanel countryData={countryData} />
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea>
            <div className="p-4">
              <EditorContent 
                countryData={countryData}
                errors={errors}
                handleBasicInfoChange={handleBasicInfoChange}
                handleCoordinatesChange={handleCoordinatesChange}
                handleDemographicsChange={handleDemographicsChange}
                handleStatisticsChange={handleStatisticsChange}
                handleLeaderChange={handleLeaderChange}
                handleEventsChange={handleEventsChange}
              />
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

interface EditorContentProps {
  countryData: CountryData;
  errors: {[key: string]: string};
  handleBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCoordinatesChange: (index: number, value: string) => void;
  handleDemographicsChange: (category: keyof CountryData['demographics'], data: any[]) => void;
  handleStatisticsChange: (category: keyof CountryData['statistics'], data: any[]) => void;
  handleLeaderChange: (field: string, value: string) => void;
  handleEventsChange: (events: any[]) => void;
}

// Separated editor content component
const EditorContent: React.FC<EditorContentProps> = ({
  countryData,
  errors,
  handleBasicInfoChange,
  handleCoordinatesChange,
  handleDemographicsChange,
  handleStatisticsChange,
  handleLeaderChange,
  handleEventsChange
}) => {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="leader">Leadership</TabsTrigger>
        <TabsTrigger value="demographics">Demographics</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="events">Timeline Events</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Country Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className={errors.code ? 'text-destructive' : ''}>
                  ISO Code (3 letter, lowercase) {errors.code && `- ${errors.code}`}
                </Label>
                <Input 
                  id="code"
                  name="code"
                  value={countryData.code}
                  onChange={handleBasicInfoChange}
                  className={errors.code ? 'border-destructive' : ''}
                  placeholder="usa"
                  maxLength={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
                  Country Name {errors.name && `- ${errors.name}`}
                </Label>
                <Input 
                  id="name"
                  name="name"
                  value={countryData.name}
                  onChange={handleBasicInfoChange}
                  className={errors.name ? 'border-destructive' : ''}
                  placeholder="United States"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capital" className={errors.capital ? 'text-destructive' : ''}>
                  Capital City {errors.capital && `- ${errors.capital}`}
                </Label>
                <Input 
                  id="capital"
                  name="capital"
                  value={countryData.capital}
                  onChange={handleBasicInfoChange}
                  className={errors.capital ? 'border-destructive' : ''}
                  placeholder="Washington D.C."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="population" className={errors.population ? 'text-destructive' : ''}>
                  Population {errors.population && `- ${errors.population}`}
                </Label>
                <Input 
                  id="population"
                  name="population"
                  type="number"
                  value={countryData.population || ''}
                  onChange={handleBasicInfoChange}
                  className={errors.population ? 'border-destructive' : ''}
                  placeholder="331000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region" className={errors.region ? 'text-destructive' : ''}>
                  Region {errors.region && `- ${errors.region}`}
                </Label>
                <Input 
                  id="region"
                  name="region"
                  value={countryData.region}
                  onChange={handleBasicInfoChange}
                  className={errors.region ? 'border-destructive' : ''}
                  placeholder="North America"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Flag Coordinates (longitude, latitude)</Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number"
                    step="0.1"
                    value={countryData.flagCoordinates[0]}
                    onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                    placeholder="Longitude"
                  />
                  <Input 
                    type="number"
                    step="0.1"
                    value={countryData.flagCoordinates[1]}
                    onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                    placeholder="Latitude"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="leader">
        <LeaderEditor 
          leader={countryData.leader} 
          onChange={handleLeaderChange} 
          errors={errors}
        />
      </TabsContent>
      
      <TabsContent value="demographics">
        <div className="space-y-6">
          <ChartEditor 
            title="Age Groups" 
            data={countryData.demographics.ageGroups} 
            onChange={(data) => handleDemographicsChange('ageGroups', data)}
          />
          
          <ChartEditor 
            title="Religions" 
            data={countryData.demographics.religions} 
            onChange={(data) => handleDemographicsChange('religions', data)}
          />
          
          <ChartEditor 
            title="Urban/Rural" 
            data={countryData.demographics.urbanRural} 
            onChange={(data) => handleDemographicsChange('urbanRural', data)}
          />
          
          <ChartEditor 
            title="Education Levels" 
            data={countryData.demographics.educationLevels} 
            onChange={(data) => handleDemographicsChange('educationLevels', data)}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="statistics">
        <div className="space-y-6">
          <ChartEditor 
            title="GDP by Sector" 
            data={countryData.statistics.gdpSectors} 
            onChange={(data) => handleStatisticsChange('gdpSectors', data)}
          />
          
          <ChartEditor 
            title="Employment by Sector" 
            data={countryData.statistics.employment} 
            onChange={(data) => handleStatisticsChange('employment', data)}
          />
          
          <ChartEditor 
            title="Trade Partners" 
            data={countryData.statistics.trade} 
            onChange={(data) => handleStatisticsChange('trade', data)}
          />
          
          <ChartEditor 
            title="Government Spending" 
            data={countryData.statistics.spending} 
            onChange={(data) => handleStatisticsChange('spending', data)}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="events">
        <EventsEditor 
          events={countryData.events} 
          onChange={handleEventsChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MapAdminPanel;