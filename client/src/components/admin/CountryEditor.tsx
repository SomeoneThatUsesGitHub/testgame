import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2 } from 'lucide-react';

import { useCountry } from '@/hooks/use-countries';
import { countryDataCollection, getCountryByCode } from '@/data/countryLoader';
import { syncCountriesToBackend } from '@/data/countrySyncer';
import type { CountryData, DataPoint, PoliticalEvent } from '@/data/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// These components will be created shortly
const ChartEditor = (props: any) => <div>Chart Editor Placeholder</div>;
const EventsEditor = (props: any) => <div>Events Editor Placeholder</div>;
const LeaderEditor = (props: any) => <div>Leader Editor Placeholder</div>;
const PreviewPanel = (props: any) => <div>Preview Panel Placeholder</div>;

interface CountryEditorProps {
  countryCode: string;
  onSaveSuccess: (code: string, isNew: boolean) => void;
}

/**
 * Component for editing all aspects of a country's data
 */
const CountryEditor: React.FC<CountryEditorProps> = ({ countryCode, onSaveSuccess }) => {
  const isNewCountry = countryCode === 'new';
  const { data: apiCountry, isLoading } = useCountry(isNewCountry ? null : countryCode);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  
  // Get country data from files
  const existingFileData = !isNewCountry 
    ? getCountryByCode(countryCode) 
    : null;
  
  // Initialize with template or existing data
  const emptyCountry: CountryData = {
    code: '',
    name: '',
    capital: '',
    population: 0,
    region: '',
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
        { name: '0-14', value: 0 },
        { name: '15-24', value: 0 },
        { name: '25-54', value: 0 },
        { name: '55-64', value: 0 },
        { name: '65+', value: 0 },
      ],
      religions: [
        { name: 'Religion 1', value: 0 },
      ],
      urbanRural: [
        { name: 'Urban', value: 0 },
        { name: 'Rural', value: 0 },
      ],
      educationLevels: [
        { name: 'Primary', value: 0 },
        { name: 'Secondary', value: 0 },
        { name: 'Tertiary', value: 0 },
        { name: 'None', value: 0 },
      ],
    },
    statistics: {
      gdpSectors: [
        { name: 'Agriculture', value: 0 },
        { name: 'Industry', value: 0 },
        { name: 'Services', value: 0 },
      ],
      employment: [
        { name: 'Agriculture', value: 0 },
        { name: 'Industry', value: 0 },
        { name: 'Services', value: 0 },
      ],
      trade: [
        { name: 'Partner 1', value: 0 },
        { name: 'Partner 2', value: 0 },
      ],
      spending: [
        { name: 'Category 1', value: 0 },
        { name: 'Category 2', value: 0 },
      ],
    },
    events: [],
  };
  
  // State for country data
  const [countryData, setCountryData] = useState<CountryData>(existingFileData || emptyCountry);
  
  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Update form data when country data loads
  useEffect(() => {
    if (existingFileData) {
      setCountryData(existingFileData);
    } else if (apiCountry && isNewCountry) {
      // If we're creating a new country and have API data for reference
      setCountryData({
        ...emptyCountry,
        code: '',
        name: '',
        capital: '',
        population: 0,
        region: '',
      });
    }
  }, [existingFileData, apiCountry, isNewCountry]);
  
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
    data: DataPoint[]
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
    data: DataPoint[]
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
  const handleEventsChange = (events: PoliticalEvent[]) => {
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
    
    // Leader validation
    if (!countryData.leader.name) newErrors['leader.name'] = 'Leader name is required';
    if (!countryData.leader.title) newErrors['leader.title'] = 'Leader title is required';
    if (!countryData.leader.party) newErrors['leader.party'] = 'Leader party is required';
    if (!countryData.leader.inPowerSince) newErrors['leader.inPowerSince'] = 'Leader in power since is required';
    if (!countryData.leader.description) newErrors['leader.description'] = 'Leader description is required';
    
    // Additional validations for charts and events could be added here
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle saving the country data to a file
  const saveCountryToFile = async () => {
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
      const isNew = isNewCountry || !existingFileData;
      
      // In a real implementation, we would write to the filesystem here
      // For now, we'll simulate this with a console log
      console.log('Saving country data to file:', countryData);
      
      // Create the file content
      const fileContent = `/**
 * ${countryData.name} Country Data
 */

import type { CountryData } from '../types';

const countryData: CountryData = ${JSON.stringify(countryData, null, 2)};

export default countryData;`;

      // This would be an API call to save the file on the server
      // For now, we'll just log it
      console.log('File content:', fileContent);
      
      // After saving, we would sync with the backend
      const syncResult = await syncCountriesToBackend();
      
      if (syncResult) {
        toast({
          title: 'Country Saved',
          description: `${countryData.name} has been saved and synced successfully.`,
          variant: 'default',
        });
        onSaveSuccess(countryData.code, isNew);
      } else {
        toast({
          title: 'Sync Failed',
          description: 'The country was saved but could not be synced with the backend.',
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
  
  // Handle deleting a country file
  const handleDeleteCountry = async () => {
    // This would actually delete the file in a real implementation
    console.log('Deleting country:', countryCode);
    
    // After deleting, we would sync with the backend
    try {
      const syncResult = await syncCountriesToBackend();
      
      if (syncResult) {
        toast({
          title: 'Country Deleted',
          description: `${countryData.name} has been deleted successfully.`,
          variant: 'default',
        });
        // Navigate back to the country list
        onSaveSuccess('', false);
      } else {
        toast({
          title: 'Sync Failed',
          description: 'The country was deleted but could not be synced with the backend.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'There was an error deleting the country data.',
        variant: 'destructive',
      });
    }
    
    setShowDeleteConfirm(false);
  };
  
  if (isLoading && !isNewCountry) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading country data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!existingFileData && !isNewCountry && (
        <Alert variant="destructive">
          <AlertTitle>Country not in files</AlertTitle>
          <AlertDescription>
            This country exists in the backend but not in the file system. 
            Saving will create a new file for this country.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button 
            onClick={saveCountryToFile}
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
                Save Country
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
        
        {!isNewCountry && (
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Country
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Country</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {countryData.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCountry}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Editor</h3>
            <ScrollArea className="h-[600px] rounded-md border p-4">
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
            </ScrollArea>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-6">Preview</h3>
            <PreviewPanel countryData={countryData} />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

interface EditorContentProps {
  countryData: CountryData;
  errors: {[key: string]: string};
  handleBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCoordinatesChange: (index: number, value: string) => void;
  handleDemographicsChange: (category: keyof CountryData['demographics'], data: DataPoint[]) => void;
  handleStatisticsChange: (category: keyof CountryData['statistics'], data: DataPoint[]) => void;
  handleLeaderChange: (field: string, value: string) => void;
  handleEventsChange: (events: PoliticalEvent[]) => void;
}

// Separated the editor content to reuse in both views
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
            onChange={(data: DataPoint[]) => handleDemographicsChange('ageGroups', data)}
          />
          
          <ChartEditor 
            title="Religions" 
            data={countryData.demographics.religions} 
            onChange={(data: DataPoint[]) => handleDemographicsChange('religions', data)}
          />
          
          <ChartEditor 
            title="Urban/Rural" 
            data={countryData.demographics.urbanRural} 
            onChange={(data: DataPoint[]) => handleDemographicsChange('urbanRural', data)}
          />
          
          <ChartEditor 
            title="Education Levels" 
            data={countryData.demographics.educationLevels} 
            onChange={(data: DataPoint[]) => handleDemographicsChange('educationLevels', data)}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="statistics">
        <div className="space-y-6">
          <ChartEditor 
            title="GDP by Sector" 
            data={countryData.statistics.gdpSectors} 
            onChange={(data: DataPoint[]) => handleStatisticsChange('gdpSectors', data)}
          />
          
          <ChartEditor 
            title="Employment by Sector" 
            data={countryData.statistics.employment} 
            onChange={(data: DataPoint[]) => handleStatisticsChange('employment', data)}
          />
          
          <ChartEditor 
            title="Trade Partners" 
            data={countryData.statistics.trade} 
            onChange={(data: DataPoint[]) => handleStatisticsChange('trade', data)}
          />
          
          <ChartEditor 
            title="Government Spending" 
            data={countryData.statistics.spending} 
            onChange={(data: DataPoint[]) => handleStatisticsChange('spending', data)}
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

export default CountryEditor;